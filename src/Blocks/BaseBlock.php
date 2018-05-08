<?php

namespace MadeHQ\Gutenberg\Blocks;

use SilverStripe\Core\Config\Configurable;

class BaseBlock
{
    use Configurable;

    /**
     * @param string $content
     * @param array $attributes
     * @return string
     */
    public function render($content, array $attributes = array())
    {
        return $content;
    }
}
