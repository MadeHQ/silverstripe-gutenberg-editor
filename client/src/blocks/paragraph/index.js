import { isBlockFeatureEnabled } from '../../config';

import * as paragraph from '@wordpress/blocks/library/paragraph';
import { __ } from '@wordpress/i18n';

import {
    BlockControls,
    AlignmentToolbar,
    BlockAlignmentToolbar,
    InspectorControls,
    ColorPalette,
    RichText
} from '@wordpress/blocks';

import { createBlock } from '@wordpress/blocks/api';

import ContrastChecker from '@wordpress/blocks/contrast-checker';
import { blockAutocompleter, userAutocompleter } from '@wordpress/blocks/autocompleters';

import {
    PanelBody,
    ToggleControl,
    RangeControl,
    PanelColor,
    Autocomplete,
    withFallbackStyles
} from '@wordpress/components';

const { getComputedStyle } = window;

const ContrastCheckerWithFallbackStyles = withFallbackStyles((node, ownProps) => {
    const { textColor, backgroundColor } = ownProps;
    //avoid the use of querySelector if both colors are known and verify if node is available.
    const editableNode = (!textColor || !backgroundColor) && node ? node.querySelector('[contenteditable="true"]') : null;
    //verify if editableNode is available, before using getComputedStyle.
    const computedStyles = editableNode ? getComputedStyle(editableNode) : null;
    return {
        fallbackBackgroundColor: (backgroundColor || !computedStyles) ? undefined : computedStyles.backgroundColor,
        fallbackTextColor: (textColor || !computedStyles) ? undefined : computedStyles.color,
    };
})(ContrastChecker);

class ParagraphBlock extends paragraph.settings.edit {
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
            align,
            content,
            dropCap,
            placeholder,
            fontSize,
            backgroundColor,
            textColor,
            width,
        } = attributes;

        const className = dropCap ? 'has-drop-cap' : null;

        const textAlignmentEnabled = isBlockFeatureEnabled('paragraph', 'textAlignment');
        const dropCapEnabled = isBlockFeatureEnabled('paragraph', 'dropCap');
        const fontSizeEnabled = isBlockFeatureEnabled('paragraph', 'fontSize');
        const backgroundColorEnabled = isBlockFeatureEnabled('paragraph', 'backgroundColor');
        const textColorEnabled = isBlockFeatureEnabled('paragraph', 'textColor');
        const blockAlignmentEnabled = isBlockFeatureEnabled('paragraph', 'blockAlignment');

        const textSettingsEnabled = (
            dropCapEnabled || fontSizeEnabled
        );

        const inspectorEnabled = (
            textSettingsEnabled || backgroundColorEnabled ||
            textColorEnabled || blockAlignmentEnabled
        );

        return [
            textAlignmentEnabled && isSelected && (
                <BlockControls key="controls">
                    <AlignmentToolbar
                        value={ align }
                        onChange={ ( nextAlign ) => {
                            setAttributes( { align: nextAlign } );
                        } }
                    />
                </BlockControls>
            ),

            inspectorEnabled && isSelected && (
                <InspectorControls key="inspector">

                { textSettingsEnabled && (
                    <PanelBody title={ __( 'Text Settings' ) }>
                        { dropCapEnabled && (
                            <ToggleControl
                                label={ __( 'Drop Cap' ) }
                                checked={ !! dropCap }
                                onChange={ this.toggleDropCap }
                            />
                        )}

                        { fontSizeEnabled && (
                            <RangeControl
                                label={ __( 'Font Size' ) }
                                value={ fontSize || '' }
                                onChange={ ( value ) => setAttributes( { fontSize: value } ) }
                                min={ 10 }
                                max={ 200 }
                                beforeIcon="editor-textcolor"
                                allowReset
                            />
                        )}
                    </PanelBody>
                )}

                { backgroundColorEnabled && (
                    <PanelColor title={ __( 'Background Color' ) } colorValue={ backgroundColor } initialOpen={ false }>
                        <ColorPalette
                            value={ backgroundColor }
                            onChange={ ( colorValue ) => setAttributes( { backgroundColor: colorValue } ) }
                        />
                    </PanelColor>
                )}

                { textColorEnabled && (
                    <PanelColor title={ __( 'Text Color' ) } colorValue={ textColor } initialOpen={ false }>
                        <ColorPalette
                            value={ textColor }
                            onChange={ ( colorValue ) => setAttributes( { textColor: colorValue } ) }
                        />
                    </PanelColor>
                )}

                { this.nodeRef && backgroundColorEnabled && textColorEnabled && (
                    <ContrastCheckerWithFallbackStyles
                        node={ this.nodeRef }
                        textColor={ textColor }
                        backgroundColor={ backgroundColor }
                        isLargeText={ fontSize >= 18 }
                    />
                )}

                { blockAlignmentEnabled && (
                    <PanelBody title={ __( 'Block Alignment' ) }>
                        <BlockAlignmentToolbar
                            value={ width }
                            onChange={ ( nextWidth ) => setAttributes( { width: nextWidth } ) }
                        />
                    </PanelBody>
                )}
                </InspectorControls>
            ),
            <div key="editable" ref={ this.bindRef }>
                <Autocomplete completers={ [
                    blockAutocompleter( { onReplace } ),
                    userAutocompleter(),
                ] }>
                    { ( { isExpanded, listBoxId, activeId } ) => (
                        <RichText
                            tagName="p"
                            className={ classnames( 'wp-block-paragraph', className, {
                                'has-background': backgroundColor,
                            } ) }
                            style={ {
                                backgroundColor: backgroundColor,
                                color: textColor,
                                fontSize: fontSize ? fontSize + 'px' : undefined,
                                textAlign: align,
                            } }
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
                            placeholder={ placeholder || __( 'Add text or type / to add content' ) }
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
    align: {
        type: 'string',
    },
    dropCap: {
        type: 'boolean',
        default: false,
    },
    placeholder: {
        type: 'string',
    },
    width: {
        type: 'string',
    },
    textColor: {
        type: 'string',
    },
    backgroundColor: {
        type: 'string',
    },
    fontSize: {
        type: 'string',
    },
    customFontSize: {
        type: 'number',
    },
};

export const name = paragraph.name;

export const settings = {
    ...paragraph.settings,

    edit: ParagraphBlock,

    attributes: schema,
};
