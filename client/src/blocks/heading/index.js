import { __, sprintf } from '@wordpress/i18n';
import * as heading from '@wordpress/blocks/library/heading';
import { isBlockFeatureEnabled } from '../../config';

import {
    BlockControls,
    RichText,
    InspectorControls,
    AlignmentToolbar,
} from '@wordpress/blocks';

import { PanelBody, Toolbar } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks/api';

export const name = 'core/heading';

export const settings = {
    ...heading.settings,

    edit( { attributes, setAttributes, isSelected, mergeBlocks, insertBlocksAfter, onReplace, className } ) {
        const {
            align,
            content,
            nodeName,
            placeholder,
        } = attributes;

        const textAlignmentEnabled = isBlockFeatureEnabled(name, 'textAlignment');

        return [
            isSelected && (
                <BlockControls
                    key="controls"
                    controls={
                        '234'.split( '' ).map( ( level ) => ( {
                            icon: 'heading',
                            title: sprintf( __( 'Heading %s' ), level ),
                            isActive: 'H' + level === nodeName,
                            onClick: () => setAttributes( { nodeName: 'H' + level } ),
                            subscript: level,
                        } ) )
                    }
                />
            ),
            isSelected && (
                <InspectorControls key="inspector">
                    <h3>{ __( 'Heading Settings' ) }</h3>

                    <p>{ __( 'Level' ) }</p>

                    <Toolbar
                        controls={
                            '23456'.split( '' ).map( ( level ) => ( {
                                icon: 'heading',
                                title: sprintf( __( 'Heading %s' ), level ),
                                isActive: 'H' + level === nodeName,
                                onClick: () => setAttributes( { nodeName: 'H' + level } ),
                                subscript: level,
                            } ) )
                        }
                    />

                    { textAlignmentEnabled && (
                        <PanelBody title={ __( 'Text Alignment' ) }>
                            <AlignmentToolbar
                                value={ align }
                                onChange={ ( nextAlign ) => {
                                    setAttributes( { align: nextAlign } );
                                } }
                            />
                        </PanelBody>
                    )}
                </InspectorControls>
            ),
            <RichText
                key="editable"
                wrapperClassName="wp-block-heading"
                tagName={ nodeName.toLowerCase() }
                value={ content }
                onChange={ ( value ) => setAttributes( { content: value } ) }
                onMerge={ mergeBlocks }
                onSplit={
                    insertBlocksAfter ?
                        ( before, after, ...blocks ) => {
                            setAttributes( { content: before } );
                            insertBlocksAfter( [
                                ...blocks,
                                createBlock( 'core/paragraph', { content: after } ),
                            ] );
                        } :
                        undefined
                }
                onRemove={ () => onReplace( [] ) }
                style={ { textAlign: align } }
                className={ className }
                placeholder={ placeholder || __( 'Write heading…' ) }
                isSelected={ isSelected }
            />,
        ];
    },

    supports: {
        className: isBlockFeatureEnabled(name, 'className'),
        anchor: isBlockFeatureEnabled(name, 'anchor'),
    },
}
