import { __ } from '@wordpress/i18n';
import * as list from '@wordpress/blocks/library/list';
import { isBlockFeatureEnabled } from '../../config';

import {
    BlockControls,
    InspectorControls,
} from '@wordpress/blocks';

import { PanelBody } from '@wordpress/components';
import { createBlock } from '@wordpress/blocks/api';
import { Personalisation, RichText } from '../../components';

class ListBlock extends list.settings.edit {
    render() {
        const {
            attributes,
            isSelected,
            insertBlocksAfter,
            setAttributes,
            mergeBlocks,
            onReplace,
            className,
            onFocus,
        } = this.props;

        const { nodeName, values, personalisation } = attributes;

        const personalisationEnabled = isBlockFeatureEnabled('list', 'personalisation');

        const sidebarEnabled = (
            personalisationEnabled
        );

        return [
            isSelected && (
                <BlockControls
                    key="controls"
                    controls={ [
                        {
                            icon: 'editor-ul',
                            title: __( 'Convert to unordered list' ),
                            isActive: this.isListActive( 'UL' ),
                            onClick: this.createSetListType( 'UL', 'InsertUnorderedList' ),
                        },
                        {
                            icon: 'editor-ol',
                            title: __( 'Convert to ordered list' ),
                            isActive: this.isListActive( 'OL' ),
                            onClick: this.createSetListType( 'OL', 'InsertOrderedList' ),
                        },
                        {
                            icon: 'editor-outdent',
                            title: __( 'Outdent list item' ),
                            onClick: this.createExecCommand( 'Outdent' ),
                        },
                        {
                            icon: 'editor-indent',
                            title: __( 'Indent list item' ),
                            onClick: this.createExecCommand( 'Indent' ),
                        },
                    ] }
                />
            ),

            isSelected && sidebarEnabled && (
                <InspectorControls key="inspector">
                    { personalisationEnabled && (
                        <PanelBody title={ __( 'Personalisation' ) }>
                            <Personalisation
                                values={ personalisation || [] }
                                onChange={ ( values ) => setAttributes( { personalisation: values } ) }
                            />
                        </PanelBody>
                    )}
                </InspectorControls>
            ),

            <RichText
                multiline="li"
                key="editable"
                tagName={ nodeName.toLowerCase() }
                getSettings={ this.getEditorSettings }
                onSetup={ this.setupEditor }
                onChange={ this.setNextValues }
                value={ values }
                wrapperClassName="blocks-list"
                className={ className }
                onFocus={ onFocus }
                placeholder={ __( 'Write list…' ) }
                onMerge={ mergeBlocks }
                onSplit={
                    insertBlocksAfter ?
                        ( before, after, ...blocks ) => {
                            if ( ! blocks.length ) {
                                blocks.push( createBlock( 'core/paragraph' ) );
                            }

                            if ( after.length ) {
                                blocks.push( createBlock( 'core/list', {
                                    nodeName,
                                    values: after,
                                } ) );
                            }

                            setAttributes( { values: before } );
                            insertBlocksAfter( blocks );
                        } :
                        undefined
                }
                onRemove={ () => onReplace( [] ) }
                isSelected={ isSelected }
            />,
        ];
    }
}

export const name = 'core/list';

export const settings = {
    ...list.settings,

    edit: ListBlock,

    attributes: {
        nodeName: {
            type: 'string',
            source: 'property',
            selector: 'ol,ul',
            property: 'nodeName',
            default: 'UL',
        },
        values: {
            type: 'array',
            source: 'children',
            selector: 'ol,ul',
            default: [],
        },
        personalisation: {
            type: 'array',
        },
    },
}
