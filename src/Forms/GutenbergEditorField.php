<?php

namespace MadeHQ\Gutenberg\Forms;

use SilverStripe\Forms\TextareaField;
use SilverStripe\Control\{HTTPRequest, HTTPResponse_Exception, HTTPResponse};
use SilverStripe\Core\Convert;
use Embed\Embed;
use Embed\Adapters\Webpage;

class GutenbergEditorField extends TextareaField
{
    /**
     * @var array
     */
    private static $allowed_actions = [
        'oembed'
    ];

    /**
     * The default block to render when new block is created.
     *
     * @config
     * @var string
     */
    private static $default_block = 'Text';

    private static $default_classes = [
        'gutenburg-editor'
    ];
}
