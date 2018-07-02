import * as button from '@wordpress/blocks/library/button';

import { __ } from '@wordpress/i18n';

import {
    ToggleControl,
    PanelColor,
    Dashicon,
    IconButton,
    withFallbackStyles,
} from '@wordpress/components';

import {
    UrlInput,
    BlockControls,
    BlockAlignmentToolbar,
    RichText,
    InspectorControls,
    ColorPalette,
} from '@wordpress/blocks';

import ContrastChecker from '@wordpress/blocks/contrast-checker';

import './style.scss';

const { getComputedStyle } = window;

const ContrastCheckerWithFallbackStyles = withFallbackStyles( ( node, ownProps ) => {
    const { textColor, backgroundColor } = ownProps;
    //avoid the use of querySelector if textColor color is known and verify if node is available.
    const textNode = ! textColor && node ? node.querySelector( '[contenteditable="true"]' ) : null;
    return {
        fallbackBackgroundColor: backgroundColor || ! node ? undefined : getComputedStyle( node ).backgroundColor,
        fallbackTextColor: textColor || ! textNode ? undefined : getComputedStyle( textNode ).color,
    };
} )( ContrastChecker );

class ButtonBlock extends button.settings.edit {
    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            className,
            onFocus,
        } = this.props;

        const {
            text,
            url,
            title,
            align,
            color,
            textColor,
            clear,
        } = attributes;

        return [
            <span key="button" className={ className } title={ title } ref={ this.bindRef }>
                <RichText
                    tagName="span"
                    placeholder={ __( 'Add text…' ) }
                    value={ text }
                    onChange={ ( value ) => setAttributes( { text: value } ) }
                    formattingControls={ [] }
                    className="wp-block-button__link"
                    style={ {
                        backgroundColor: color,
                        color: textColor,
                    } }
                    isSelected={ isSelected }
                    keepPlaceholderOnFocus={ true }
                />
            </span>,
            isSelected && (
                <form
                    key="form-link"
                    className="blocks-button__inline-link"
                    onSubmit={ ( event ) => event.preventDefault() }>
                    <Dashicon icon="admin-links" />
                    <UrlInput
                        value={ url }
                        onChange={ ( value ) => setAttributes( { url: value } ) }
                    />
                    <IconButton icon="editor-break" label={ __( 'Apply' ) } type="submit" />
                </form>
            ),
        ];
    }
}

export const name = button.name;

export const settings = {
    ...button.settings,

    edit: ButtonBlock,

    save( { attributes } ) {
        const { url, text, title, align, color, textColor } = attributes;

        const buttonStyle = {
            backgroundColor: color,
            color: textColor,
            align: align,
        };

        const linkClass = 'wp-block-button__link';

        return (
            <a className={ linkClass } href={ url } title={ title } style={ buttonStyle }>
                { text }
            </a>
        );
    },
};
