<?php

namespace MadeHQ\Gutenberg\Blocks;

use SilverStripe\Assets\File;

class ImageBlock extends BaseBlock
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

    public function render($content, array $attributes = array())
    {
        if (!array_key_exists('fileId', $attributes) || !$attributes['fileId']) {
            return false;
        }

        $file = File::get_by_id(File::class, $attributes['fileId']);
        if (!$file || !$file->exists()) {
            return false;
        }

        $alt = array_key_exists('altText', $attributes) ? $attributes['altText'] : '';
        $title = array_key_exists('title', $attributes) ? $attributes['title'] : '';

        $width = (int) static::config()->get('width');
        $height = (int) static::config()->get('height');

        if ($width && $height) {
            return sprintf('<img src="%s" alt="%s" title="%s" />', $file->URL($width, $height, 'fill'), $alt, $title);
        } else if ($width) {
            return sprintf('<img src="%s" alt="%s" title="%s" />', $file->resizeByWidth($width, 'fill'), $alt, $title);
        } else if ($height) {
            return sprintf('<img src="%s" alt="%s" title="%s" />', $file->resizeByHeight($height, 'fill'), $alt, $title);
        }

        return sprintf('<img src="%s" alt="%s" title="%s" />', $file->URL(800, 450), $alt, $title);
    }
}
