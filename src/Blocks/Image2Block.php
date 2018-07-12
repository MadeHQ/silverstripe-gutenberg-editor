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
    private static $full_width = 1920;

    /**
     * @config
     * @var int
     */
    private static $full_height = 1080;

    public function render($content, array $attributes = array())
    {
        $template = $this->getTemplateData($attributes);
        return $template->renderWith('InlineGallery');
    }

    private function getTemplateData($attributes)
    {
        $images = array_reduce($attributes['images'], function ($carry, $imageData) {
            $image = File::get_by_id(File::class, $imageData['id']);
            if (is_object($image) && $image->exists()) {
                $carry->push(ArrayData::create([
                    'Image' => $image,
                    'Caption' => array_key_exists('caption', $imageData) && $imageData['caption'] ? $imageData['caption'] : $image->Caption,
                    'Credit' => array_key_exists('credit', $imageData) && $imageData['credit'] ? $imageData['credit'] : $image->Credit,
                ]));
            }
            return $carry;
        }, ArrayList::create());

        return ArrayData::create([
            'Images' => $images,
        ]);
    }
}
