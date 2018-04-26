<?php
namespace MadeHQ\Gutenberg\FieldTypes;

use SilverStripe\ORM\FieldType\DBText;
use SilverStripe\ORM\FieldType\DBHTMLText;
use SilverStripe\ORM\ArrayList;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Convert;
use SilverStripe\View\ArrayData;
use SilverStripe\View\Requirements;

class DBGutenbergText extends DBText
{
    use Configurable;

    private static $blockProcessors = [
        'wp:paragraph' => 'MadeHQ\Gutenberg\BlockRenderers\WP\Paragraph'
    ];

    private static $casting = [
        'RAW' => 'HTMLText',
    ];

    /**
     * @config
     * @var string
     */
    private static $escape_type = 'xml';

    public function forTemplate()
    {
        $this->value = '<!-- wp:paragraph {"align":"right"} -->\n<p>Here is a test of the gutenberg plugin<\/p>\n<!-- \/wp:paragraph -->\n\n<!-- wp:paragraph -->\n<p>A second paragraph to use<\/p>\n<!-- \/wp:paragraph -->';
        $partDetails = $this->getPartDetails();
        $blockProcessors = static::config()->uninherited('blockProcessors');

        $html = array_reduce($partDetails, function ($carry, $block) use ($blockProcessors) {
            // $partProcessor = sprintf('partProcessor%s%s', ucwords($part['namespace']), ucwords($part['block']));
            // $carry.= $this->$partProcessor($part);
            $classKey = sprintf('%s:%s', $block['namespace'], $block['block']);
            if (array_key_exists($classKey, $blockProcessors)) {
                $class = $blockProcessors[$classKey];
                $carry.= singleton($class)::render($block);
            } else {
                $carry.= $block['data'];
            }
            return $carry;
        }, '');
        return $html;
        var_dump($partDetails, $html);
        die;
    }

    protected function getPartDetails() {
        $rawParts = preg_split('(<!--\s+\\\/(\w+):(\w+)\s+-->)', $this->value);
        $partDetails = array_reduce($rawParts, function ($carry, $item) {
            if (trim($item)) {
                preg_match('/<!--\s+(\w+):(\w+)\s+(\{.*\})?\s?-->(.*)/', $item, $matches);
                array_push($carry, [
                    'namespace' => $matches[1],
                    'block' => $matches[2],
                    'attributes' => json_decode($matches[3], true),
                    'data' => strtr($matches[4], [
                        '\/' => '/',
                        '\n' => "\n",
                    ]),
                ]);
            }
            return $carry;
        }, []);
        return $partDetails;
    }
}
