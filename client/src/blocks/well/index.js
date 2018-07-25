import { InnerBlocks } from '@wordpress/blocks';

import { createBlock } from '@wordpress/blocks/api';

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

    transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'madehq/well', {
						nodeName: 'P',
						content,
					} );
				},
			},
			{
				type: 'pattern',
				regExp: /^(#{2,6})\s/,
				transform: ( { content } ) => {
					return createBlock( 'madehq/well', {
						nodeName: 'P',
						content,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( { content } ) => {
					return createBlock( 'core/paragraph', {
						content,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( { content } ) => {
					return createBlock( 'core/heading', {
						content,
					} );
				},
			},
		],
    },

    save( { attributes } ) {
        return (
            <div className="o-well">
                <InnerBlocks.Content />
            </div>
        );
    }
};
