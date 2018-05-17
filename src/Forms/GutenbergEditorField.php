<?php

namespace MadeHQ\Gutenberg\Forms;

use SilverStripe\Forms\TextareaField;
use SilverStripe\Core\Convert;

class GutenbergEditorField extends TextareaField
{
    /**
     * {@inheritdoc}
     */
    public function getAttributes()
    {
        $gutenbergData = [
            'oembed' => 'gutenberg-api/oembed',
        ];

        $this->extend('updateGutenbergData', $gutenbergData);

        $attributes = array_merge(parent::getAttributes(), [
            'data-gutenberg' => Convert::array2json($gutenbergData),
        ]);

        $this->extend('updateAttributes', $attributes);

        return $attributes;
    }
}
