import React from 'react';
import ReactDOM from 'react-dom';

import { registerBlocks } from "./blocks";
import './store';

import { EditorProvider } from "@wordpress/editor";
import Layout from "./components/layout";
import { subscribe, select } from "@wordpress/data";
import { rawHandler, serialize } from "@wordpress/blocks";

import { isString, debounce, isEqual, extend, has } from "lodash";

import "./style.scss";

let blocksRegistered = false;

jQuery.entwine('ss', ($) => {
    $('.js-injector-boot textarea.gutenbergeditor').entwine({
        Component: null,

        Container: null,

        Field: null,

        onmatch() {
            this._super();

            // Grab the entire field
            const field = this.parents('div.gutenbergeditor');

            // Grab the holder & container
            let container = field.siblings('.gutenberg__editor');

            // If no container is present, make a container
            if (!container.length) {
                const newContainer = $('<div class="gutenberg__editor"></div>');

                this.parent().before(newContainer);

                container = newContainer;
            }

            // Tell field we're ready to hide everything
            field.addClass('gutenbergeditor--loaded');

            // Store field & container for future
            this.setField(field);
            this.setContainer(container);

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
            let post = {
                content: {
                    raw: originalValue || '',
                }
            };

            // Listen for changes
            subscribe(debounce(() => {
                const content = select('core/editor').getEditedPostContent();

                if (isEqual(post.content.raw, content)) {
                    return false;
                }

                // Update post
                post = {
                    content: {
                        raw: content,
                    }
                };

                // Using the textarea...
                this
                    // ...update the value
                    .val(content)
                    // ...and trigger the change
                    .trigger('change');
            }, 250));

            // @todo rework entwine so that react has control of holder
            ReactDOM.render(
                <EditorProvider post={post}><Layout /></EditorProvider>,
                this.getContainer().get(0)
            );
        },

        stopGutenberg() {
            // Remove gutenberg
            ReactDOM.unmountComponentAtNode(
                this.getContainer().get(0)
            );
        }
    });
});
