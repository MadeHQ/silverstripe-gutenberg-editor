<?php

namespace MadeHQ\Gutenberg\Blocks;

use SilverStripe\ORM\DataObject;
use SilverStripe\Assets\File;
use SilverStripe\ORM\ArrayList;

class ImageGallery extends BaseBlock
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
        if (!array_key_exists('items', $attributes)) {
            return false;
        }

        if (!is_array($attributes['items']) || !count($attributes['items'])) {
            return false;
        }

        $images = new ArrayList;

        foreach ( $attributes['items'] as $item ) {
            if (!array_key_exists('fileId', $item) || !$item['fileId']) {
                continue;
            }

            $file = DataObject::get_by_id(File::class, $item['fileId']);

            $images->push([
                'Image' => $file,
                'Caption' => array_key_exists('caption', $item) ? $item['caption'] : '',
                'Credit' => array_key_exists('credit', $item) ? $item['credit'] : '',
            ]);
        }

        if (!$images->count()) {
            return false;
        }

        return $this->renderWith('Blocks/Image2Gallery', [
            'Images' => $images,
            'Width' => static::config()->get('width'),
            'Height' => static::config()->get('height'),
            'FullWidth' => static::config()->get('full_width'),
            'FullHeight' => static::config()->get('full_height'),
        ]);
    }
}
