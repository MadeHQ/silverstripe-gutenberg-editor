<?php

namespace MadeHQ\Gutenberg\Blocks;

class HTMLBlock extends BaseBlock
{
    /**
     * @param string $content
     * @param array $attributes
     * @return string
     */
    public function render($content, array $attributes = array())
    {
        return '<div class="o-html">' . $content . '</div>';
    }
}
