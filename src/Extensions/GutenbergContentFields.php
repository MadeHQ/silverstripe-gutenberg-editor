<?php
namespace MadeHQ\Gutenberg\Extensions;

use SilverStripe\ORM\DataExtension;
use SilverStripe\Forms\FieldList;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Injector\Injector;
use MadeHQ\Gutenberg\FieldTypes\DBGutenbergText;
use MadeHQ\Gutenberg\Forms\GutenbergEditorField;

class GutenbergContentFields extends DataExtension
{
    /**
     * @param FieldList $fields
     */
    public function updateCMSFields(FieldList $fields)
    {
        $injectorConfig = Config::inst()->get(Injector::class, 'HTMLText');
        if ($injectorConfig && isset($injectorConfig['class']) && $injectorConfig['class'] === DBGutenbergText::class) {
            $fields->replaceField('Content', GutenbergEditorField::create('Content'));
        }
    }
}
