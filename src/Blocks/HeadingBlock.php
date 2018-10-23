<?php

namespace MadeHQ\Gutenberg\Blocks;

class HeadingBlock extends BaseBlock
{
    /**
     * @param string $content
     * @param array $attributes
     * @return string
     */
    public function render($content, array $attributes = array())
    {
        // Look for headings
        return preg_replace_callback('/(\<h[1-6](.*?))\>(.*)(<\/h[1-6]>)/i', function ($matches) {
            // Return the original text if there already is an ID
            if (stripos($matches[0], 'id=') !== false) {
                return $matches[0];
            }

            // Try to generate a slug
            $slug = $this->slugify($matches[3]);

            // Return the original text if we don't have slug
            if (!$slug) {
                return $matches[0];
            }

            // Compile the stuff
            return $matches[1] . $matches[2] . ' id="' . $slug . '">' . $matches[3] . $matches[4];
        }, $content);
    }

    /**
     * Generates a slug using the heading - should remove any excess crap
     * which {@link SilverStripe\View\Parsers\URLSegmentFilter} doesn't.
     * Shamelessly stolen from {@link https://stackoverflow.com/a/2955878}
     *
     * @param string
     * @return string
     */
    public static function slugify($text)
    {
        // remove tags
        $text = strip_tags($text);

        // replace non letter or digits by -
        $text = preg_replace('~[^\pL\d]+~u', '-', $text);

        // transliterate
        $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

        // remove unwanted characters
        $text = preg_replace('~[^-\w]+~', '', $text);

        // trim
        $text = trim($text, '-');

        // remove duplicate -
        $text = preg_replace('~-+~', '-', $text);

        // lowercase
        $text = strtolower($text);

        if (empty($text)) {
            return false;
        }

        return $text;
    }

}
