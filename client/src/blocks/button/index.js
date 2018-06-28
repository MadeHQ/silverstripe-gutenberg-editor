import * as button from '@wordpress/blocks/library/button';

class ButtonBlock extends button.settings.edit {
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
