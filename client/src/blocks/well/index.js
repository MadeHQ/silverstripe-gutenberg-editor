import { InnerBlocks } from '@wordpress/blocks';

import './style.scss';

export const name = 'madehq/well';

export const settings = {
    title: 'Well',

    description: 'Insert a well of content',

    icon: 'button',

    category: 'common',

    edit({ isSelected }) {
        return [
            <div className="well--block" key="editor">
                <InnerBlocks />
            </div>
        ];
    },

    attributes: {},

    save( { attributes } ) {
        return (
            <div className="o-well">
                <InnerBlocks.Content />
            </div>
        );
    }
};
