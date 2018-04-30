// import { concatChildren, Component, RawHTML } from '@wordpress/element';
import React, { Component } from '@wordpress/element';
import InsertMediaModal from '../../../../../silverstripe/asset-admin/client/src/containers/InsertMediaModal/InsertMediaModal';
// import InsertMediaModal from 'InsertMediaModal';
// import InsertMediaModal from 'silverstripe-asset-admin/../containers/InsertMediaModal/InsertMediaModal.js';

import { __ } from '@wordpress/i18n';
console.log('CloudinaryImageBlock::top');
class CloudinaryImageBlock extends Component {
    constructor(props) {
        super(props);
        this.handleAddInsert.bind(this);
    }

    handleAddInsert() {
        console.log('CloudinaryImageBlock::handleAddInsert', this);
    }

    render() {
        console.log('CloudinaryImageBlock::render');
        return (
          <InsertMediaModal
            title={false}
            show={false}
            onInsert={this.handleAddInsert}
            type="select"
            bodyClassName="modal__dialog"
            className="insert-media-react__dialog-wrapper"
            fileAttributes={null}
            folderId={0}
          />
        );
    };
}

const schema = {
	content: {
		type: 'object'
	},
};

const supports = {
	className: false,
};

export const name = 'madehq/cloudinary';

export const settings = {
    title: __( 'Cloudinary Image' ),

    description: __( 'This will allow you to pull an image into content' ),

    icon: 'format-image',

    category: 'common',

    keywords: [ __( 'text' ) ],

    edit: CloudinaryImageBlock,

    save: function() {
        console.log('CloudinaryImageBlock::settings::save', ...arguments);
    }
};
