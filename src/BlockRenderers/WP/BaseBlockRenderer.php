<?php

namespace MadeHQ\Gutenberg\BlockRenderers\WP;

class BaseBlockRenderer
{
    public static function render($block)
    {
        return $block['data'];
    }
}
