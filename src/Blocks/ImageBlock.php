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
        $url = array_key_exists('url', $attributes) ? $attributes['url'] : '';

        $width = (int) static::config()->get('width');
        $height = (int) static::config()->get('height');

        if ($width && $height) {
            $image = sprintf('<img src="%s" alt="%s" title="%s" class="inline-image__image" />', $file->URL($width, $height, 'fill'), $alt, $title);
        } else if ($width) {
            $image = sprintf('<img src="%s" alt="%s" title="%s" class="inline-image__image" />', $file->resizeByWidth($width, 'fill'), $alt, $title);
        } else if ($height) {
            $image = sprintf('<img src="%s" alt="%s" title="%s" class="inline-image__image" />', $file->resizeByHeight($height, 'fill'), $alt, $title);
        } else {
            $image = sprintf('<img src="%s" alt="%s" title="%s" class="inline-image__image" />', $file->URL(800, 450), $alt, $title);
        }

        if ($url && is_string($url) && strlen($url)) {
            $markup = sprintf('<a href="%s" class="inline-image__link">%s</a>', $url, $image);
        } else {
            $markup = $image;
        }

        return sprintf('<div class="inline-image">%s</div>', $markup);
    }
}
