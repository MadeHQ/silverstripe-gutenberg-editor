<?php

use MadeHQ\Gutenberg\Blocks\BaseBlock;

use SilverStripe\Assets\File;
use SilverStripe\View\ArrayData;
use SilverStripe\ORM\DataObject;

class FeaturePanelBlockExample extends BaseBlock
{
    public function render($content, array $attributes = array())
    {
        if (!array_key_exists('id', $attributes) || !$attributes['id']) {
            return '';
        }

        $panel = DataObject::get_by_id(FeaturePanel::class, $attributes['id']);

        if (!$panel) {
            return '';
        }

        $panel->Theme = array_key_exists('theme', $attributes) && $attributes['theme'] ? $attributes['theme'] : 'black';

        return $this->renderWith(sprintf('Blocks/FeaturePanel_%s', $panel->Type), $panel);
    }
}
