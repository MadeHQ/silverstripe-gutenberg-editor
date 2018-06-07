import { withInstanceId } from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import Gallery from '../../components/blocks/gallery';

import './style.scss';

export const name = 'madehq/image-gallery';

export const settings = {
    title: __( 'Gallery' ),

    description: __( 'This will allow you to create a gallery with multiple images' ),

    icon: 'format-gallery',

    category: 'common',

    keywords: [ __( 'image' ) ],

    edit: withInstanceId(Gallery),

    attributes: {
        items: {
            type: 'array',
        }
    },

    save: function(data) {
console.log('Gallery::save', data);
        return '';
    }
};
