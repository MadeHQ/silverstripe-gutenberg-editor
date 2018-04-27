// import jQuery from 'jquery';
// import entwine from 'entwine';
import React from 'react';
import ReactDOM from 'react-dom';
// import { render } from "@wordpress/element";

import './store';

import { EditorProvider } from "@wordpress/editor";
import { registerCoreBlocks } from "@wordpress/blocks";
import { setDefaultBlockName, getDefaultBlockName } from "@wordpress/blocks/api";
import { select } from "@wordpress/data";

import Layout from "./components/layout";

import { isString, debounce, isEqual, extend, has } from "lodash";

import "./style.scss";

registerCoreBlocks();

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

            // Refresh the render
            this.refresh();
        },

        onunmatch() {
            this._super();

            // solves errors given by ReactDOM "no matched root found" error.
            // ReactDOM.unmountComponentAtNode(this.getContainer());
        },

        refresh() {
            const originalValue = this.val();
            const defautltContent = {
                content: {
                    raw: '<!-- wp:paragraph --><p></p><!-- /wp:paragraph -->'
                }
            };

            let post = null;

            try {
                post = JSON.parse(originalValue);
            } catch (error) {
                // @todo Figure out how to get old content in
                // if (originalValue.length) {
                //     post = {
                //         content: {
                //             rendered: originalValue
                //         }
                //     };
                // }
                post = defautltContent;
            }

            if (!has(post, 'content')) {
                post = defautltContent;
            }

            // Get a watcher going for content change every 1 second
            window.addEventListener('gutenberg:content', debounce(event => {
                // Merge old content with new content
                const newPost = extend(post, {
                    content: {
                        raw: event.detail.content
                    }
                });

                // No need to update if old and new content are the same
                if (isEqual(post.raw, newPost.raw)) {
                    return false;
                }

                // Using the textarea...
                this
                    // ...update the value
                    .val(JSON.stringify(newPost))
                    // ...and trigger the change
                    .trigger('change');
            }, 1000));

            // TODO: rework entwine so that react has control of holder
            ReactDOM.render(
                <EditorProvider post={post}>
                    <Layout />
                </EditorProvider>,
                this.getContainer().get(0)
            );
        },
    });
});
