import { RichText as BaseRichText } from '@wordpress/blocks/rich-text';
import { withSafeTimeout } from '@wordpress/components';
import { forEach, merge } from 'lodash';

export class RichText extends BaseRichText {
    removeFormat( format ) {
        this.editor.focus();
        this.editor.formatter.remove( format );
        this.onChange();
    }

    applyFormat( format, args, node ) {
        this.editor.focus();
        this.editor.formatter.apply( format, args, node );
        this.onChange();
    }
}

export default withSafeTimeout(RichText);
