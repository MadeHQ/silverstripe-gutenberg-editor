import { isBlockFeatureEnabled } from '../../config';

import classnames from 'classnames';
import * as paragraph from '@wordpress/blocks/library/paragraph';
import { __ } from '@wordpress/i18n';

import {
    InspectorControls,
    RichText
} from '@wordpress/blocks';

import { createBlock } from '@wordpress/blocks/api';

import { blockAutocompleter, userAutocompleter } from '@wordpress/blocks/autocompleters';

import { PanelBody, ToggleControl, Autocomplete } from '@wordpress/components';

import './style.scss';

class LedeBlock extends paragraph.settings.edit {
    constructor() {
        super( ...arguments );
    }

    render() {
        const {
            attributes,
            setAttributes,
            insertBlocksAfter,
            isSelected,
            mergeBlocks,
            onReplace,
        } = this.props;

        const {
            content,
            dropCap,
        } = attributes;

        const dropCapEnabled = isBlockFeatureEnabled('lede', 'dropCap');

        return [
            dropCapEnabled && isSelected && (
                <InspectorControls key="inspector">
                    <PanelBody title={ __( 'Text Settings' ) }>
                        <ToggleControl
                            label={ __( 'Drop Cap' ) }
                            checked={ !! dropCap }
                            onChange={ this.toggleDropCap }
                        />
                    </PanelBody>
                </InspectorControls>
            ),

            <div key="editable" ref={ this.bindRef } className="lede--block">
                <Autocomplete completers={ [
                    blockAutocompleter( { onReplace } ),
                    userAutocompleter(),
                ] }>
                    { ( { isExpanded, listBoxId, activeId } ) => (
                        <RichText
                            tagName="p"
                            className={ classnames( 'wp-block-paragraph', {
                                'has-drop-cap': dropCap,
                            } ) }
                            value={ content }
                            onChange={ ( nextContent ) => {
                                setAttributes( {
                                    content: nextContent,
                                } );
                            } }
                            onSplit={ insertBlocksAfter ?
                                ( before, after, ...blocks ) => {
                                    setAttributes( { content: before } );
                                    insertBlocksAfter( [
                                        ...blocks,
                                        createBlock( 'core/paragraph', { content: after } ),
                                    ] );
                                } :
                                undefined
                            }
                            onMerge={ mergeBlocks }
                            onReplace={ this.onReplace }
                            onRemove={ () => onReplace( [] ) }
                            placeholder={ __( 'Insert lede…' ) }
                            aria-autocomplete="list"
                            aria-expanded={ isExpanded }
                            aria-owns={ listBoxId }
                            aria-activedescendant={ activeId }
                            isSelected={ isSelected }
                        />
                    ) }
                </Autocomplete>
            </div>,
        ];
    }
}

const schema = {
    content: {
        type: 'array',
        source: 'children',
        selector: 'p',
        default: [],
    },
    dropCap: {
        type: 'boolean',
        default: false,
    },
};

export const name = 'madehq/lede-copy';

export const settings = {
    ...paragraph.settings,

    title: 'Lede Copy',

    description: 'Insert lede copy',

    edit: LedeBlock,

    attributes: schema,

    save( { attributes } ) {
        const { content, dropCap, } = attributes;

        const className = classnames('o-lede', {
            'o-dropcap': dropCap,
        });

        return <p className={ className ? className : undefined }>{ content }</p>;
    }
};
