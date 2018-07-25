/**
 * External dependencies
 */
import { assign, pull, map, get } from 'lodash';
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { getWrapperDisplayName, Fragment } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import InspectorControls from '@wordpress/blocks/inspector-controls';

import { isBlockFeatureEnabled, getConfigValue, default as getConfig } from '../config';
import { Personalisation } from '../components';

/**
 * Filters registered block settings, extending attributes with anchor using ID
 * of the first node.
 *
 * @param {Object} settings Original block settings.
 *
 * @return {Object} Filtered block settings.
 */
export function addAttribute( settings ) {
    if (isBlockFeatureEnabled(settings.name, 'personalisation')) {
        settings.attributes = assign(settings.attributes, {
            personalisation: {
                type: 'array',
                default: [],
            }
        });
    }

    return settings;
}

export function withInspectorControl( BlockEdit ) {
    const WrappedBlockEdit = ( props ) => {
        const personalisationEnabled = isBlockFeatureEnabled(props.name, 'personalisation') && props.isSelected;
        const configValues = getConfigValue('personalisation', []);

        let values = props.attributes.personalisation || [];

        const onChange = (event) => {
            let newValues = values.slice();

            if (event.target.checked) {
                newValues.push( event.target.value );
            } else {
                newValues = pull(newValues, event.target.value);
            }

            props.setAttributes( { personalisation: newValues } );
        };

        const checkboxes = configValues.map((option, index) => {
            const { label, value } = option;

            const id = `personalisation-${value}`;

            const isChecked = values.some(item => {
                return String(item).toLowerCase() === String(value).toLowerCase();
            });

            return (
                <div key={ index } className="components-checkbox-control">
                    <input
                        id={ id }
                        className="components-checkbox-control__input"
                        type="checkbox"
                        value={ value }
                        onChange={ onChange }
                        checked={ isChecked }
                    />

                    <label className="components-checkbox-control__label" htmlFor={ id }>
                        { label }
                    </label>
                </div>
            );
        });

        if (personalisationEnabled) {
            return (
                <Fragment>
                    <BlockEdit { ...props } />
                    <InspectorControls key="inspector-personalisation">
                        <PanelBody title={ __( 'Personalisation' ) }>
                            { checkboxes }
                        </PanelBody>
                    </InspectorControls>
                </Fragment>
            );
        }

        return <BlockEdit { ...props } />;
    };

    WrappedBlockEdit.displayName = getWrapperDisplayName( BlockEdit, 'personalisation' );

    return WrappedBlockEdit;
}

export function addSaveProps( extraProps, blockType, attributes ) {
    return extraProps;
}

addFilter( 'blocks.registerBlockType', 'silverstripe/personalisation/attribute', addAttribute );
addFilter( 'blocks.BlockEdit', 'silverstripe/personalisation/inspector-control', withInspectorControl );
addFilter( 'blocks.getSaveContent.extraProps', 'silverstripe/personalisation/save-props', addSaveProps );
