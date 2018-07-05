import React from 'react';
import ReactDOM from 'react-dom';

import * as components from '@wordpress/components';
import * as blocks from '@wordpress/blocks';
import * as element from '@wordpress/element';

import { ImageControl, withFetch } from './components';

window.wp = window.wp || {};
window.wp.components = {
    ...components,
    ImageControl,
    withFetch,
};

window.wp.blocks = blocks;
window.wp.element = element;

import { isArray, isString, debounce, isEqual, extend, has, isObject, filter, includes, without, delay, find, isNull } from "lodash";

window._ = {
    isEqual: isEqual,
    isObject: isObject,
    filter: filter,
    contains: includes,
    without: without,
    delay: delay,
    find: find,
    isNull: isNull,
    isArray: isArray,
};

import './code-editor-config';

import { registerBlocks } from "./blocks";
import './store';

import { EditorProvider } from "@wordpress/editor";
import Layout from "./components/layout";
import { subscribe, select } from "@wordpress/data";
import { rawHandler, serialize } from "@wordpress/blocks";

import { setConfig } from './config';

import "./style.scss";

let blocksRegistered = false;

jQuery.entwine('ss', ($) => {
    $('.js-injector-boot textarea.gutenbergeditor').entwine({
        Component: null,

        Container: null,

        Field: null,

        Config: null,

        onmatch() {
            this._super();

            // Grab the entire field
            const field = this.parents('div.gutenbergeditor');

            // Set the global config
            setConfig(this.data('gutenberg'));
            // this.setConfig(this.data('gutenberg') || {});

            // Store field for future
            this.setField(field);

            // Register blocks if not registered
            if (!blocksRegistered) {
                registerBlocks();

                blocksRegistered = true;
            }

            // Start the instance of gutenberg
            this.startGutenberg();
        },

        onunmatch() {
            this._super();

            // Stop the instance of gutenberg
            this.stopGutenberg();
        },

        startGutenberg() {
            // Grab current value
            let originalValue = this.val();

            // Check if we have wordpress content to ensure that
            // we can provide raw content as editable content
            if (originalValue.length && originalValue.indexOf('wp:') === -1) {
                // Turn raw html into blocks
                let blocks = rawHandler({
                    HTML: originalValue,
                    mode: 'BLOCKS',
                });

                // Turn into text for usage!
                originalValue = serialize(blocks);
            }

            // Content to object which wordpress expects since
            // we only store the raw value
            let currentContent = originalValue || '';

            // Listen for changes
            subscribe(debounce(() => {
                const content = select('core/editor').getEditedPostContent();

                if (isEqual(currentContent, content)) {
                    return false;
                }

                currentContent = content;

                // Using the textarea...
                this
                    // ...update the value
                    .val(content)
                    // ...and trigger the change
                    .trigger('change');
            }, 100));

             // Grab the holder & container
            let container = this.getField().siblings('.gutenberg__editor');
            let newContainer = null;

            // If no container is present, make a container
            if (!container.length) {
                newContainer = document.createElement('div');
                newContainer.setAttribute('class', 'gutenberg__editor');

                container = newContainer;
            }

            // @todo rework entwine so that react has control of holder
            ReactDOM.render(
                <EditorProvider post={ { content: { raw: originalValue || '' } } } settings={{bodyPlaceholder: 'Begin adding your content&hellip;'}}>
                    <Layout />
                </EditorProvider>,
                container
            );

            this.setContainer(container);

            if (newContainer) {
                this.getField().append(container);
            }

            // Tell field we're ready to hide everything
            this.getField().addClass('gutenbergeditor--loaded');
        },

        stopGutenberg() {
            // Remove gutenberg
            ReactDOM.unmountComponentAtNode(
                this.getContainer()
            );
        }
    });
});
