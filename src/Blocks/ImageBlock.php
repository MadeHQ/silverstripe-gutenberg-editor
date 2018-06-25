<?php

namespace MadeHQ\Gutenberg\Blocks;

use SilverStripe\Assets\File;

class ImageBlock extends BaseBlock
{
    private static $imageWidth = 800;

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

        return sprintf('<img src="%s" alt="%s" title="%s" />', $file->resizeByWidth(static::config()->get('imageWidth')), $alt, $title);
    }
}
