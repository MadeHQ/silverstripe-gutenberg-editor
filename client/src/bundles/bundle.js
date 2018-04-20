/* Silverstripe Gutenberg Editor Bundle
===================================================================================================================== */

// Load Styles:

require('styles/bundle.scss');

// Load Scripts:
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

import { EditorProvider } from "@wordpress/editor";
import { registerCoreBlocks } from "@wordpress/blocks";

import Layout from "./components/layout";

registerCoreBlocks();

$.entwine('ss', function ($) {
  $('textarea.entwine-gutenberg-editor').entwine({
    Component: null,

    getContainer() {
      let container = this.siblings('.gutenberg-holder')[0];
      if (!container) {
        const newContainer = $('<div class="gutenberg-holder"></div>');
        this.before(newContainer);

        container = newContainer[0];
      }
      return container;
    },

    onunmatch() {
      this._super();
      // solves errors given by ReactDOM "no matched root found" error.
      ReactDOM.unmountComponentAtNode(this.siblings('.uploadfield-holder')[0]);
    },

    onmatch() {
      this._super();
      this.hide();
      this.refresh();
    },

    refresh() {
      const settings = {};
      const post = {
        id: 1,
        title: {
          raw: "something???"
        },
        content: {
          raw: "anything ????"
        }
      };
      ReactDOM.render(
        <EditorProvider settings={settings} post={post}>
          <Layout />
        </EditorProvider>,
        this.getContainer()
      );
    }
  });
});
