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

        return preg_replace_callback('/(\<h[1-6](.*?))\>(.*)(<\/h[1-6]>)/i', function($matches) use ($filter) {
            if (!stripos($matches[0], 'id=')) {
                return $matches[1] . $matches[2] . ' id="' . $filter->filter($matches[3]) . '">' . $matches[3] . $matches[4];
            }

            return $matches[0];
        }, $content);
    }
}
