<?php

namespace MadeHQ\Gutenberg\Forms;

use SilverStripe\Forms\TextareaField;
use SilverStripe\Core\Convert;
use SilverStripe\View\Requirements;

class GutenbergEditorField extends TextareaField
{
    /**
     *
     */
    public function Field($properties = array())
    {
        Requirements::css('mademedia/silverstripe-gutenberg-editor: client/dist/style.css');

        Requirements::javascript('mademedia/silverstripe-gutenberg-editor: client/dist/globals.js');
        Requirements::javascript('mademedia/silverstripe-gutenberg-editor: client/dist/bundle.js');

        return parent::Field($properties);
    }

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
