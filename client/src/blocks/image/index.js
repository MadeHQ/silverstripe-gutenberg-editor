// import { concatChildren, Component, RawHTML } from '@wordpress/element';
import React, { createElement, Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import InsertMediaModal from 'InsertMediaModal';

console.log(InsertMediaModal);

export const name = 'silverstripe/image';

export const settings = {
    title: __( 'Image' ),

    icon: 'format-image',

    category: 'common',

    // edit: function,

    // The "save" property must be specified and must be a valid function.
    save: function( props ) {
        return createElement(
            'p', // Tag type.
            { className: props.className }, // The class="wp-block-gb-basic-01" : The class name is generated using the block's name prefixed with wp-block-, replacing the / namespace separator with a single -.
            'Hello World! — from the frontend (01 Basic Block).' // Content inside the tag.
        );
    },
};
