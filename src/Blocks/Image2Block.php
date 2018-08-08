<?php

namespace MadeHQ\Gutenberg\Blocks;

use SilverStripe\Assets\Image;
use SilverStripe\Assets\File;

use SilverStripe\ORM\ArrayList;
use SilverStripe\View\ArrayData;

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
    private static $inline_width = 300;

    /**
     * @config
     * @var int
     */
    private static $inline_height = 300;

    /**
     * @config
     * @var int
     */
    private static $max_width = 1920;

    /**
     * @config
     * @var int
     */
    private static $max_height = 1080;

    public function render($content, array $attributes = array())
    {
        if (array_key_exists('inline', $attributes) && $attributes['inline']) {
            $template = $this->getInlineTemplateData($attributes);
            return $template->renderWith('Blocks/Image2Inline');
        }
        $template = $this->getTemplateData($attributes);
        return $template->renderWith('Blocks/Image2Gallery');
    }

    private function getInlineTemplateData($attributes)
    {
        $widthRatio = static::config()->get('inline_width') / static::config()->get('inline_height');
        $heightRatio = static::config()->get('inline_height') / static::config()->get('inline_width');
        $ratio = $heightRatio < $widthRatio ? $heightRatio : $widthRatio;

        $images = array_reduce($attributes['images'], function ($carry, $imageData) use ($ratio) {
            $image = File::get_by_id(File::class, $imageData['id']);
            if (is_object($image) && $image->exists()) {
                $width = $image->Width;
                $height = $image->Height;

                if ($width > static::config()->get('inline_width')) {
                    $width = static::config()->get('inline_width');
                    $height = $width * $ratio;
                }

                if ($height > static::config()->get('inline_height')) {
                    $height = static::config()->get('inline_height');
                    $width = $height * $ratio;
                }

                $carry->push(ArrayData::create([
                    'Image' => $image,
                    'Caption' => array_key_exists('caption', $imageData) && $imageData['caption'] ? $imageData['caption'] : $image->Caption,
                    'Credit' => array_key_exists('credit', $imageData) && $imageData['credit'] ? $imageData['credit'] : $image->Credit,
                    'Width' => (int) $width,
                    'Height' => (int) $height,
                ]));
            }
            return $carry;
        }, ArrayList::create());

        return ArrayData::create([
            'Images' => $images
        ]);
    }

    private function getTemplateData($attributes)
    {
        $widthRatio = static::config()->get('max_width') / static::config()->get('max_height');
        $heightRatio = static::config()->get('max_height') / static::config()->get('max_width');
        $ratio = $heightRatio < $widthRatio ? $heightRatio : $widthRatio;
        $images = array_reduce($attributes['images'], function ($carry, $imageData) use ($ratio) {
            $image = File::get_by_id(File::class, $imageData['id']);
            if (is_object($image) && $image->exists()) {
                $width = $image->Width;
                $height = $image->Height;

                if ($width > static::config()->get('max_width')) {
                    $height = $width * $ratio;
                    $width = static::config()->get('max_width');
                }

                if ($height > static::config()->get('max_height')) {
                    $width = $height * $ratio;
                    $height = static::config()->get('max_height');
                }

                $carry->push(ArrayData::create([
                    'Image' => $image,
                    'Caption' => array_key_exists('caption', $imageData) && $imageData['caption'] ? $imageData['caption'] : $image->Caption,
                    'Credit' => array_key_exists('credit', $imageData) && $imageData['credit'] ? $imageData['credit'] : $image->Credit,
                    'Width' => (int) $width,
                    'Height' => (int) $height,
                ]));
            }
            return $carry;
        }, ArrayList::create());

        return ArrayData::create([
            'Images' => $images,
            'Width' => static::config()->get('width'),
            'Height' => static::config()->get('height'),
        ]);
    }
}
