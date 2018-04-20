<?php
namespace MadeHQ\Gutenberg\FieldTypes;

use SilverStripe\ORM\FieldType\DBText;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\ArrayList;
use SilverStripe\Core\Convert;
use SilverStripe\View\ArrayData;
use SilverStripe\View\Requirements;

class DBGutenbergText extends DBText
{
    private static $casting = [
        'RAW' => 'HTMLText',
    ];

    /**
     * @config
     * @var string
     */
    private static $escape_type = 'xml';

    /**
     * Template mapping
     *
     * @config
     * @var array
     */
    private static $template_mapping = [
        'text' => 'SirTrevor/Text',
        'numbered_list' => 'SirTrevor/NumberedList',
        'bulleted_list' => 'SirTrevor/BulletedList',
        'well' => 'SirTrevor/Well',
        'quote' => 'SirTrevor/Quote',
    ];

    /**
     * @var array
     */
    protected static $templateMappingCache = null;

    /**
     * Enable shortcode parsing on this field
     *
     * @var boolean
     */
    protected $processShortcodes = null;

    /**
     * List of html properties to whitelist
     *
     * @var array
     */
    protected $whitelist = [];

    /**
     * Check if shortcodes are enabled
     *
     * @return boolean
     */
    public function getProcessShortcodes()
    {
        return $this->processShortcodes;
    }

    /**
     * Set shortcodes on or off by default
     *
     * @param boolean $process
     * @return $this
     */
    public function setProcessShortcodes($process)
    {
        $this->processShortcodes = (boolean) $process;
        return $this;
    }

    /**
     * List of html properties to whitelist
     *
     * @return array
     */
    public function getWhitelist()
    {
        return $this->whitelist;
    }

    /**
     * Set list of html properties to whitelist
     *
     * @param array $whitelist
     * @return $this
     */
    public function setWhitelist($whitelist)
    {
        if (!is_array($whitelist)) {
            $whitelist = preg_split('/\s*,\s*/', $whitelist);
        }
        $this->whitelist = $whitelist;
        return $this;
    }

    /**
     * @param array $options
     *
     * Options accepted in addition to those provided by Text:
     *
     *   - shortcodes: If true, shortcodes will be turned into the appropriate HTML.
     *                 If false, shortcodes will not be processed.
     *
     *   - whitelist: If provided, a comma-separated list of elements that will be allowed to be stored
     *                (be careful on relying on this for XSS protection - some seemingly-safe elements allow
     *                attributes that can be exploited, for instance <img onload="exploiting_code();" src="..." />)
     *                Text nodes outside of HTML tags are filtered out by default, but may be included by adding
     *                the text() directive. E.g. 'link,meta,text()' will allow only <link /> <meta /> and text at
     *                the root level.
     *
     * @return $this
     */
    public function setOptions(array $options = [])
    {
        if (array_key_exists('shortcodes', $options)) {
            $this->setProcessShortcodes(!!$options['shortcodes']);
        }
        if (array_key_exists('whitelist', $options)) {
            $this->setWhitelist($options['whitelist']);
        }
        return parent::setOptions($options);
    }

    /**
     * @param string $template
     * @return string|null
     */
    protected function getBlockTemplate($template)
    {
        if (!is_string($template) || !strlen($template)) {
            return null;
        }
        if (is_null(static::$templateMappingCache)) {
            static::$templateMappingCache = static::config()->get('template_mapping');
        }
        if (!is_array(static::$templateMappingCache)) {
            return null;
        }
        if (!array_key_exists($template, static::$templateMappingCache)) {
            return null;
        }
        return static::$templateMappingCache[$template];
    }

    /**
     * @return string
     */
    public function RAW()
    {
        // Add some functionality to make this extendebale
        $this->extend('onBeforeJSONDecode', $this->value);
        // Decode JSON
        $json = Convert::json2array($this->value);
        // Add some functionality to make this extendebale
        $this->extend('onAfterJSONDecode', $json);
        // Return with empty string if we have no data
        if (!is_array($json) || !array_key_exists('data', $json) || empty($json['data'])) {
            return '';
        }
        // HTML
        $html = [];
        // Index because HTML fields needs unique names
        $index = 0;
        // Loop through each block
        foreach ($json['data'] as $item) {
            // Extend for pre-processing
            $this->extend('onBeforeProcessBlock', $item);
            // Grab type & data for later use
            $type = $item['type'];
            $data = $item['data'];
            // Grab template using the type
            $template = $this->getBlockTemplate($type);
            var_dump($data);
            // Throw a warning if a template has not been provided
            if (!$template) {
                // user_error(sprintf(
                //     'The template for block "%s" could has not been provided', $type
                // ), E_USER_WARNING);
                // No need to continue
                continue;
            }
            // Build out content
            $content = [];
            // If text exists
            if (array_key_exists('text', $data)) {
                $content['Content'] = DBHTMLText::create()->setValue($data['text']);
            }
            // If list items
            if (array_key_exists('listItems', $data)) {
                $listItems = [];
                foreach ($data['listItems'] as $item) {
                    array_push($listItems, DBHTMLText::create()->setValue($item['content']));
                }
                $content['ListItems'] = new ArrayList($listItems);
            }
            // Add cite for blockquote
            if (array_key_exists('cite', $data)) {
                $content['Credit'] = $data['cite'];
            }
            // Render the thing
            $output = $this->renderWith($template, new ArrayData($content));
            // Store with global array
            array_push($html, $output->forTemplate());
            // Extend for post-processing
            $this->extend('onAfterProcessBlock', $item);
        }
        // Grab global array return as HTML after mergin
        return DBHTMLText::create()->setValue(implode("\r\n", $html));
        // $text = json_decode($text, true);
        // $return = [];
        // if (is_array($text) && isset($text['data'])) {
        //     foreach ($text['data'] as $data) {
        //          * The bug is with new image, the data is in an array where each character is an element of this array
        //          *
        //          * This code transforms this array into a string (JSON format)
        //          * and after it transforms it into an another array for Sir Trevor
        //         if ('image' === $data['type'] && !isset($data['data']['file'])) {
        //             $return[] = [
        //                 'type' => 'image',
        //                 'data' => json_decode(implode($data['data']), true),
        //             ];
        //         } else {
        //             $return[] = $data;
        //         }
        //     }
        //     return json_encode(['data' => $return], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        // }
        // return '';
        die;
        if ($this->processShortcodes) {
            return ShortcodeParser::get_active()->parse($this->value);
        } else {
            return $this->value;
        }
    }
    /**
     * Return the value of the field with relative links converted to absolute urls (with placeholders parsed).
     *
     * @return string
     */
    public function AbsoluteLinks()
    {
        return HTTP::absoluteURLs($this->forTemplate());
    }
    /**
     * @return string
     */
    public function forTemplate()
    {
        // Suppress XML encoding for DBHtmlText
        return $this->RAW();
    }
    /**
     * Safely escape for XML string
     *
     * @return string
     */
    public function CDATA()
    {
        return sprintf(
            '<![CDATA[%s]]>',
            str_replace(']]>', ']]]]><![CDATA[>', $this->RAW())
        );
    }
    /**
     * @param string $value
     * @return string
     */
    public function prepValueForDB($value)
    {
        return parent::prepValueForDB($this->whitelistContent($value));
    }
    /**
     * Filter the given $value string through the whitelist filter
     *
     * @param string $value Input html content
     * @return string Value with all non-whitelisted content stripped (if applicable)
     */
    public function whitelistContent($value)
    {
        if ($this->whitelist) {
            $dom = HTMLValue::create($value);
            $query = [];
            $textFilter = ' | //body/text()';
            foreach ($this->whitelist as $tag) {
                if ($tag === 'text()') {
                    $textFilter = ''; // Disable text filter if allowed
                } else {
                    $query[] = 'not(self::' . $tag . ')';
                }
            }
            foreach ($dom->query('//body//*[' . implode(' and ', $query) . ']' . $textFilter) as $el) {
                if ($el->parentNode) {
                    $el->parentNode->removeChild($el);
                }
            }
            $value = $dom->getContent();
        }
        return $value;
    }
    /**
     * @return SirTrevorEditorField
     */
    public function scaffoldFormField($title = null, $params = null)
    {
        return new SirTrevorEditorField($this->name, $title);
    }
    public function scaffoldSearchField($title = null)
    {
        return new TextField($this->name, $title);
    }
    /**
     * Get plain-text version
     *
     * @return string
     */
    public function Plain()
    {
        // Preserve line breaks
        $text = preg_replace('/\<br(\s*)?\/?\>/i', "\n", $this->RAW());
        // Convert paragraph breaks to multi-lines
        $text = preg_replace('/\<\/p\>/i', "\n\n", $text);
        // Strip out HTML tags
        $text = strip_tags($text);
        // Implode >3 consecutive linebreaks into 2
        $text = preg_replace('~(\R){2,}~', "\n\n", $text);
        // Decode HTML entities back to plain text
        return trim(Convert::xml2raw($text));
    }
    public function getSchemaValue()
    {
        // Form schema format as HTML
        $value = $this->RAW();
        if ($value) {
            return [ 'html' => $this->RAW() ];
        }
        return null;
    }
    public function exists()
    {
        // Optimisation: don't process shortcode just for ->exists()
        $value = $this->getValue();
        // All truthy values and non-empty strings exist ('0' but not (int)0)
        return $value || (is_string($value) && strlen($value));
    }
}
