import { __ } from '@wordpress/i18n';
import { withInstanceId, withState, PanelBody, BaseControl, ToggleControl } from '@wordpress/components';
import { InspectorControls, BlockAlignmentToolbar } from '@wordpress/blocks';
import { ImageControl } from '../../components';

import { map, mapValues, extend, isEmpty } from 'lodash';

const cloudinaryImage = window.cloudinaryImage;

import './style.scss';

export const name = 'madehq/image';

export const settings = {
    title: __( 'Image 2' ),

    description: __( 'This will allow you to pull an image or gallery into content' ),

    icon: 'format-image',

    category: 'common',

    keywords: [ __( 'text' ) ],

    edit({ attributes, setAttributes, isSelected }) {
        const { images, captions, credits, inline } = attributes;

        const updateImages = value => {
            let newImages = mapValues(value, (item, key) => {
                let image = images[key];

                if (!image) {
                    return item;
                }

                item.credit = image.credit;
                item.caption = image.caption;

                return item;
            });

            setAttributes({ images: newImages });
        };

        const updateCredit = (key, value) => {
            let newImages = extend({}, images);

            newImages[key].credit = value;

            setAttributes({ images: newImages });
        }

        const updateCaption = (key, value) => {
            let newImages = extend({}, images);

            newImages[key].caption = value;

            setAttributes({ images: newImages });
        }

        const updateInline = () => {
            setAttributes({ inline: !inline });
        }

        const renderImage = (image, key) => {
            return (
                <div key={ key } className="full-preview ui-widget">
                    <img className="full-preview__image" src={ cloudinaryImage(image.url, 606, 341) } />

                    <fieldset className="full-preview__fields">
                        <div id={`DynamicImage${image.id}_Caption_Holder`}>
                            <label
                                htmlFor={`DynamicImage${image.id}_Credit`}
                                id={`title-DynamicImage${image.id}_Credit`}
                                className="screen-reader-text"
                            >
                                Credit
                            </label>

                            <input
                                type="text"
                                className="text no-change-track"
                                placeholder="Credit (&copy;)"
                                id={ `DynamicImage${image.id}_Credit` }
                                value={ image.credit }
                                onChange={ e => updateCredit(key, e.target.value) }
                            />
                        </div>

                        <div id={`DynamicImage${image.id}_Caption_Holder`}>
                            <label
                                htmlFor={`DynamicImage${image.id}_Caption`}
                                id={`title-DynamicImage${image.id}_Caption`}
                                className="screen-reader-text"
                            >
                                Caption
                            </label>

                            <input
                                type="text"
                                className="text no-change-track"
                                placeholder="Caption"
                                id={ `DynamicImage${image.id}_Caption` }
                                value= { image.caption }
                                onChange={ e => updateCaption(key, e.target.value) }
                            />
                        </div>
                    </fieldset>
                </div>
            );
        };

        const classes = ['full-preview-holder'];

        if (images.length === 1) {
            classes.push('has-one');
        }

        return [
            isSelected && (
                <InspectorControls key="inspector">
                    <ToggleControl
                        label="Show images inline"
                        checked={ !! inline }
                        onChange={ updateInline }
                    />
                    <BaseControl label="Image Browser">
                        <ImageControl
                            value={ images }
                            onChange={ updateImages }
                            isSelected={ isSelected }
                        />
                    </BaseControl>
                </InspectorControls>
            ),

            <div key="editor">
                { !images || isEmpty(images) && (
                    <p className="block-select-prompt">Please select an image&hellip;</p>
                ) }

                { images && !isEmpty(images) && (
                    <div className={ classes.join(' ') }>
                        <div className="full-preview-list">
                            { map(images, renderImage) }
                        </div>
                    </div>
                ) }
            </div>
        ];
    },

    attributes: {
        images: {
            type: 'object',
            default: {},
        },
        inline: {
            type: 'boolean',
            default: false
        }
    },

    save({ attributes }) {
        return (
            <div className="inline-gallery"></div>
        );
    }
};
