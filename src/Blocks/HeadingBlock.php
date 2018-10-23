<?php

namespace MadeHQ\Gutenberg\Blocks;

use SilverStripe\View\Parsers\URLSegmentFilter;

class HeadingBlock extends BaseBlock
{
    /**
     * @param string $content
     * @param array $attributes
     * @return string
     */
    public function render($content, array $attributes = array())
    {
        $filter = URLSegmentFilter::create();
        $filter->setAllowMultibyte(true);

        // Look for headings
        return preg_replace_callback('/(\<h[1-6](.*?))\>(.*)(<\/h[1-6]>)/i', function($matches) use ($filter) {
            // Ignore if there already is an ID
            if (stripos($matches[0], 'id=') !== false) {
                return $matches[0];
            }

            // Remove the tags
            $value = strip_tags($matches[3]);

            // Sanitise
            $value = $filter->filter($value);

            // Compile the stuff
            return $matches[1] . $matches[2] . ' id="' . $value . '">' . $matches[3] . $matches[4];
        }, $content);
    }
}
