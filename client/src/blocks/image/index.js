import { withInstanceId } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import ImageBlock from '../../components/blocks/image';

const schema = {
	content: {
		type: 'object'
	},
};

const supports = {
	className: false,
};

export const name = 'madehq/image-selector';

export const settings = {
    title: __( 'Image' ),

    description: __( 'This will allow you to pull an image into content' ),

    icon: 'format-image',

    category: 'common',

    keywords: [ __( 'text' ) ],

    edit: withInstanceId(ImageBlock),

    attributes: {
        fileId: {
            type: 'string',
            selector: 'input[type="hidden"]',
            default: false,
        },
        title: {
            type: 'string',
        },
        altText: {
            type: 'string',
        },
        height: {
            type: 'string'
        },
        width: {
            type: 'string'
        },
    },

    save: function(data) {
        return `<img src="${data.attributes.fileId}" alt="${data.attributes.altText}" title="${data.attributes.title}" />`;
    }
};
