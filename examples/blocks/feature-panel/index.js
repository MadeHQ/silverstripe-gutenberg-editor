import React from 'react';

const cloudinaryImage = window.cloudinaryImage;

const InspectorControls = window.wp.blocks.InspectorControls;

const { withFetch } = window.wp.components;
const { compose } = window.wp.element;

import { map } from 'lodash';

const {
    BaseControl,
    SelectControl,
    ToggleControl,
} = window.wp.components;

const { find, isNull, isArray } = window._;

import './style.scss';

export const name = 'site/feature-panel';

export const settings = {
    title: 'Feature Panel',

    description: 'Insert a feature panel',

    category: 'common',

    attributes: {
        id: {
            type: 'integer',
            default: 0,
        },
        theme: {
            type: 'string',
            default: 'black',
        }
    },

    save( { attributes } ) {
        const { id } = attributes;

        return (
            <div className="feature-panel"></div>
        );
    },

    edit: withFetch(() => ({
        featurePanelData: '/gutenberg-api/feature-panels',
    }))( ({ attributes, setAttributes, isSelected, featurePanelData }) => {
        if (!featurePanelData) {
            return (
                <p className="block-loading">Loading&hellip;</p>
            );
        }

        const { id, theme, } = attributes;

        const panelList = featurePanelData.panels.map(item => {
            return {
                value: item.id, label: item.title,
            };
        });

        const themeList = map(featurePanelData.themes, (label, value) => {
            return {
                value, label
            }
        });

        panelList.unshift({
            value: 0, label: 'Select a feature…',
        });

        let panelObject = find(featurePanelData.panels, item => {
            return parseInt(item.id, 10) === parseInt(id, 10);
        });

        const {
            prefix,
            title,
            subtitle,
            type,
            image,
            link,
        } = panelObject || {};

        const classes = [];

        if (type !== 'default') {
            classes.push(`feature-panel-${type}`);
        } else {
            classes.push('feature-panel');
        }

        classes.push(`feature-panel--${theme}`);

        let titleClass = 'feature-panel__title';

        if (type === 'cutout') {
            titleClass = 'feature-panel-cutout__title';
        } else if (type === 'circle') {
            titleClass = 'feature-panel-circle__title';
        }

        if (title) {
            if (title.length >= 40) {
                titleClass = `${titleClass} ${titleClass}--long`;
            }

            if (title.length >= 20) {
                titleClass = `${titleClass} ${titleClass}--medium`;
            }
        }

        return [
            isSelected && (
                <InspectorControls key="inspector">
                    <SelectControl
                        label={ 'Features' }
                        value={ id }
                        onChange={ value => setAttributes( { id: parseInt(value, 10) } ) }
                        options={ panelList }
                    />

                    <SelectControl
                        label="Theme"
                        value={ theme }
                        onChange={ theme => setAttributes( { theme } ) }
                        options={ themeList }
                    />
                </InspectorControls>
            ),

            <div key="editor">
                { (!id || !panelObject) && (
                    <p className="block-select-prompt">Please select a feature&hellip;</p>
                ) }

                { !!id && panelObject && type === 'default' && (
                    <div className={ classes.join(' ') }>
                        { image && image.length > 0 && (
                            <div className="feature-panel__media">
                                <figure className="o-figure" itemScope itemType="http://schema.org/ImageObject">
                                    <picture className="media media-image">
                                        <video style={{display: 'none'}}>
                                            <source srcSet={`${cloudinaryImage( image, 750, 760, 'fill')}`} media="(max-width: 479px)" />
                                            <source srcSet={`${cloudinaryImage( image, 822, 634, 'fill')}`} media="(max-width: 799px)" />
                                        </video>
                                        <img className="feature-panel__image" srcSet={cloudinaryImage( image, 650, 500, 'fill')} />
                                    </picture>
                                </figure>
                            </div>
                        ) }

                        <div className="feature-panel__inner">
                            { prefix && prefix.length > 0 && (
                                <span className="feature-panel__prefix">{ prefix }</span>
                            ) }

                            { title && title.length > 0 && (
                                <h3
                                    className={ titleClass }
                                    dangerouslySetInnerHTML={{
                                        __html: title
                                    }}
                                />
                            ) }

                            { subtitle && subtitle.length > 0 && (
                                <span className="feature-panel__suffix">{ subtitle }</span>
                            ) }

                            { link && (
                                <a className="btn btn--rounded btn--solid btn--tertiary">
                                    { link.text || "Find out more" }
                                </a>
                            ) }
                        </div>
                    </div>
                ) }

                { !!id && panelObject && type === 'circle' && (
                    <div className={ classes.join(' ') }>
                        <div className="feature-panel-circle__inner u-constrained--small">
                            { image && image.length > 0 && (
                                <img className="feature-panel-circle__image" src={cloudinaryImage(image, 400, 400, 'fill')} />
                            ) }

                            <div className="feature-panel-circle__prefix">
                                { prefix && prefix.length > 0 && (
                                    <p className="feature-panel__prefix">{ prefix }</p>
                                ) }

                                { title && title.length > 0 && (
                                    <h4
                                        className={ titleClass }
                                        dangerouslySetInnerHTML={{
                                            __html: title
                                        }}
                                    />
                                ) }

                                { subtitle && subtitle.length > 0 && (
                                    <p className="feature-panel-circle__suffix">{ subtitle }</p>
                                ) }

                                { link && (
                                    <a className="btn btn--rounded">
                                        { link.text || "Find out more" }
                                    </a>
                                ) }
                            </div>
                        </div>
                    </div>
                ) }

                { !!id && panelObject && type === 'cutout' && (
                    <div className={ classes.join(' ') }>
                        { image && image.length > 0 && (
                            <div className="feature-panel-cutout__media">
                                <figure className="o-figure" itemScope itemType="http://schema.org/ImageObject">
                                    <picture className="media media-image">
                                        <video style={{display: 'none'}}>
                                            <source srcSet={`${cloudinaryImage( image, 800, 1000, 'fit', null, 'auto', '')}`} media="(max-width: 799px)" />
                                            <source srcSet={`${cloudinaryImage( image, 650, 350, 'fit', null, 'auto', '')}`} media="(min-width: 800px)" />
                                        </video>
                                        <img className="feature-panel-cutout__image" srcSet={cloudinaryImage( image, 650, 500, 'fit', null, 'auto', '')} />
                                    </picture>
                                </figure>
                            </div>
                        ) }

                        <div className="feature-panel-cutout__inner">
                            { title && title.length > 0 && (
                                <h3
                                    className={ titleClass }
                                    dangerouslySetInnerHTML={{
                                        __html: title
                                    }}
                                />
                            ) }

                            { subtitle && subtitle.length > 0 && (
                                <span className="feature-panel-cutout__suffix">{ subtitle }</span>
                            ) }

                            { link && (
                                <a className="feature-panel-cutout__btn">
                                    { link.text || "Find out more" }
                                </a>
                            ) }
                        </div>
                    </div>
                ) }
            </div>
        ];
    })
};
