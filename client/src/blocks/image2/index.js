import { __ } from '@wordpress/i18n';
import { withInstanceId, withState, PanelBody, BaseControl } from '@wordpress/components';
import { InspectorControls, BlockAlignmentToolbar } from '@wordpress/blocks';
import { ImageControl } from '../../components';

import { map, mapValues, extend, isEmpty } from 'lodash';

const cloudinaryImage = window.cloudinaryImage;

import './style.scss';

const GRAVITY_VALUES = [
  { value: 'auto',          title: 'Auto'},
  { value: 'center',        title: 'Center'},
  { value: 'face',          title: 'Face'},
  { value: 'face:auto',     title: 'Face (or auto)'},
  { value: 'faces',         title: 'Faces'},
  { value: 'faces:auto',    title: 'Faces (or auto)'},
  { value: 'body:face',     title: 'Body or Face'},
  { value: 'north',         title: 'Top'},
  { value: 'north_east',    title: 'Top Right'},
  { value: 'east',          title: 'Right'},
  { value: 'south_east',    title: 'Bottom Right'},
  { value: 'south',         title: 'Bottom'},
  { value: 'south_west',    title: 'Bottom Left'},
  { value: 'west',          title: 'Left'},
  { value: 'north_west',    title: 'Top Left'},
];

export const name = 'madehq/image';

export const settings = {
    title: __( 'Image 2' ),

    description: __( 'This will allow you to pull an image or gallery into content' ),

    icon: 'format-image',

    category: 'common',

    keywords: [ __( 'text' ) ],

    edit({ attributes, setAttributes, isSelected }) {
        const { images, captions, credits } = attributes;

        const updateImages = value => {
            let newImages = mapValues(value, (item, key) => {
                let image = images[key];

                if (!image) {
                    return item;
                }

                item.credit = image.credit;
                item.caption = image.caption;
                image.gravity = image.gravity || 'auto';

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

      const updateGravity = (key, value) => {
        let newImages = extend({}, images);

        newImages[key].gravity = value;

        setAttributes({ images: newImages });
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

                        <div id={`DynamicImage${image.id}_Caption_Holder`}>
                            <label
                                htmlFor={`DynamicImage${image.id}_Gravity`}
                                id={`title-DynamicImage${image.id}_Gravity`}
                                className="screen-reader-text"
                            >
                                Gravity
                            </label>

                            <select
                                className="text no-change-track"
                                id={ `DynamicImage${image.id}_Gravity` }
                                value= { image.gravity }
                                onChange={ e => updateGravity(key, e.target.value) }
                            >
                                { GRAVITY_VALUES.map( i => <option value={i.value}>Gravity: {i.title}</option> ) }
                            </select>
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
    },

    save({ attributes }) {
        return (
            <div className="inline-gallery"></div>
        );
    }
};
