<?php
namespace MadeHQ\Gutenberg\FieldTypes;

use SilverStripe\ORM\FieldType\{DBText, DBHTMLText};
use SilverStripe\ORM\ArrayList;
use SilverStripe\Core\Config\Configurable;
use SilverStripe\Core\Convert;
use SilverStripe\View\ArrayData;

use MadeHQ\Gutenberg\Blocks\{
    BaseBlock, ParagraphBlock, EmbedBlock, ListBlock,
    PullQuoteBlock, HeadingBlock, SeparatorBlock,
    QuoteBlock, CodeBlock, TableBlock, HTMLBlock,
    ImageBlock, ImageGallery, Image2Block
};

class DBGutenbergText extends DBText
{
    use Configurable;

    /**
     * @config
     * @var array
     */
    private static $block_processors = [
        'paragraph' => ParagraphBlock::class,
        'embed' => EmbedBlock::class,
        'list' => ListBlock::class,
        'pullquote' => PullQuoteBlock::class,
        'heading' => HeadingBlock::class,
        'separator' => SeparatorBlock::class,
        'quote' => QuoteBlock::class,
        'code' => CodeBlock::class,
        'table' => TableBlock::class,
        'html' => HTMLBlock::class,
        'madehq/image-selector' => ImageBlock::class,
        'madehq/image-gallery' => ImageGallery::class,
        'madehq/image' => Image2Block::class,
    ];

    private static $casting = [
        'RAW' => 'HTMLText',
        'forTemplate' => 'HTMLText',
    ];

    /**
     * @return HTMLText
     */
    public function RAW()
    {
        return $this->value;
    }

    /**
     * Plain text version
     *
     * @return string Plain text
     */
    public function Plain()
    {
        return html_entity_decode(
            preg_replace(
                array('/\s{2,}/', '/[\t\n]/'),
                ' ',
                strip_tags($this->forTemplate())
            ),
            ENT_QUOTES
        );
    }

    /**
     * @return DBHTMLText
     */
    public function forTemplate()
    {
        // Store locally
        $value = $this->value;

        // Don't try to parse content if it's not Gutenberg
        if (stripos($value, 'wp:') === false) {
            return DBHTMLText::create()->setValue($value);
        }

        // Add some functionality to make this extendebale
        $this->extend('onBeforeBlockParse', $value);

        // Call the processor
        $content = $this->processBlocks($value);

        // Add some functionality to make this extendebale
        $this->extend('onAfterBlockParse', $content);

        return $content;
    }

    /**
     * Shamelessly taken from Wordpress. It's a mess, but it works.
     *
     * @link https://github.com/WordPress/gutenberg/blob/master/lib/blocks.php#L126
     * @param string $value
     * @return string
     */
    protected function processBlocks($value = '')
    {
        $content = $value;

        $rendered_content = '';

        $block_processors = static::config()->get('block_processors');

        $matcher = '/<!--\s+wp:([\w\/\-]+)(\s+(\{.*?\}))?\s+(\/)?-->/s';

        while (preg_match($matcher, $content, $block_match, PREG_OFFSET_CAPTURE)) {
            $opening_tag = $block_match[0][0];
            $offset = $block_match[0][1];
            $block_name = $block_match[1][0];
            $is_self_closing = isset($block_match[4]);

            // Reset attributes JSON to prevent scope bleed from last iteration.
            $block_attributes_json = null;

            if (isset($block_match[3])) {
                $block_attributes_json = $block_match[3][0];
            }

            $block_content = substr($content, strlen($opening_tag));

            $content = substr($content, $offset + strlen($opening_tag));

            if (!$is_self_closing) {
                $end_tag_pattern = '/<!--\s+\/wp:' . str_replace('/', '\/', preg_quote($block_name)) . '\s+-->/s';

                if (!preg_match($end_tag_pattern, $block_content, $block_match_end, PREG_OFFSET_CAPTURE)) {
                    break;
                }

                $end_tag = $block_match_end[0][0];
                $end_offset = $block_match_end[0][1];

                $block_content = substr($block_content, 0, strpos($block_content, $end_tag));

                $content = substr($content, $end_offset + strlen($end_tag));
            }

            if (array_key_exists($block_name, $block_processors)) {
                // user_error(sprintf(
                //     'The block "%s" does not have a processor', $block_name
                // ), E_USER_WARNING);

                // continue;
                $block_type = singleton($block_processors[$block_name]);
            } else {
                $block_type = singleton(BaseBlock::class);
            }

            $attributes = array();

            if (!empty($block_attributes_json)) {
                $decoded_attributes = json_decode( $block_attributes_json, true );

                if (!is_null($decoded_attributes)) {
                    $attributes = $decoded_attributes;
                }
            }

            $this->extend('beforeBlockRender', $block_content, $attributes);

            if (is_string($block_content)) {
                $block_content = $block_type->render($block_content, $attributes);

                $this->extend('afterBlockRender', $block_content, $attributes);

                $rendered_content .= $block_content;
            }

            $content = trim($content);
        }

        return $rendered_content;
    }
}
