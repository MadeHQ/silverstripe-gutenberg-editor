<?php

namespace MadeHQ\Gutenberg\Blocks;

class Image2Block extends BaseBlock
{
    /**
     * @config
     * @var int
     */
    private static $width = 800;

    /**
     * @config
     * @var int
     */
    private static $height = 450;

    /**
     * @config
     * @var int
     */
    private static $full_width = 1920;

    /**
     * @config
     * @var int
     */
    private static $full_height = 1080;

    public function render($content, array $attributes = array())
    {
        return $content;
    }
}
