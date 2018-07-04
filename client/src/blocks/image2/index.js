import { __ } from '@wordpress/i18n';
import { withInstanceId, withState, PanelBody } from '@wordpress/components';
import { InspectorControls, BlockAlignmentToolbar } from '@wordpress/blocks';
import { ImageControl } from '../../components';

import { findIndex } from 'lodash';

const cloudinaryImage = window.cloudinaryImage;

// import './style.scss';

export const name = 'madehq/image';

export const settings = {
    title: __( 'Image 2' ),

    description: __( 'This will allow you to pull an image or gallery into content' ),

    icon: 'format-image',

    category: 'common',

    keywords: [ __( 'text' ) ],

    edit({ attributes, setAttributes, isSelected, editable, setState }) {
        const { images, align } = attributes;

        const updateImages = images => {
            setAttributes({ images: images });
        };

        return [
            isSelected && (
                <InspectorControls key="inspector">
                    <PanelBody title={ __( 'Block Alignment' ) }>
                        <BlockAlignmentToolbar
                            value={ align }
                            onChange={ ( nextAlign ) => setAttributes( { align: nextAlign } ) }
                        />
                    </PanelBody>
                </InspectorControls>
            ),

            <ImageControl
                value={ images }
                onChange={ updateImages }
                isSelected={ isSelected }
            />
        ];
    },

    attributes: {
        images: {
            type: 'array',
            default: [],
        },
        align: {
            type: 'string',
            default: 'left',
        },
    },

    save({ attributes }) {
        const { images, align } = attributes;

        let classes = ['inline-gallery js-inline-gallery'];

        classes.push(`inline-gallery--align-${align}`);

        classes = classes.join(' ');

        return (
            <div className={ classes } itemScope itemType="http://schema.org/ImageGallery">
                <div className="inline-gallery__list js-inline-gallery__list">

                { images.map(image => (
                    <div className="inline-gallery__item">
                        <figure
                            className="gallery-item o-figure"
                            itemProp="associatedMedia" itemScope itemType="http://schema.org/ImageObject"
                            data-width="1920" data-height="1080"
                            data-large-src={ cloudinaryImage(image.url, 1920, 1080, 'fill') }
                            { ...(image.caption.length && { 'data-caption': image.caption } ) }
                            { ...(image.credit.length && { 'data-credit': image.credit } ) }
                        >
                            <button className="gallery-item__link js-gallery-popup">
                                <svg className="o-icon o-icon--medium" aria-hidden="true">
                                    <use xlinkHref="#icon-expand"></use>
                                </svg>
                            </button>

                            <div className="gallery-item__media u-ratio u-ratio--3-2">
                                <img className="gallery-item__image"
                                    itemProp="thumbnail"
                                    src={ cloudinaryImage(image.url, 800, 450, 'fill') }
                                />
                            </div>

                            <figcaption className="gallery-item__meta o-figure__meta">
                                <span className="gallery-item__slide-number"></span>

                                { image.caption.length && (
                                    <p itemProp="caption" className="gallery-item__caption o-figure__caption">
                                        { image.caption }
                                    </p>
                                ) }

                                { image.credit.length && (
                                    <span itemProp="credit" className="gallery-item__credit">
                                        { image.credit }
                                    </span>
                                ) }
                            </figcaption>
                        </figure>
                    </div>
                )) }

                </div>
            </div>
        );
    }
};
