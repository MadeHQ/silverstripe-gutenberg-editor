// import jQuery from 'jquery';
// import entwine from 'entwine';
import React from 'react';
import ReactDOM from 'react-dom';
// import { render } from "@wordpress/element";

import './store';

import { EditorProvider } from "@wordpress/editor";
import { registerCoreBlocks } from "@wordpress/blocks";

import Layout from "./components/layout";

registerCoreBlocks();

jQuery.entwine('ss', ($) => {
  $('.js-injector-boot textarea.gutenburg-editor').entwine({
    Component: null,

    getContainer() {
      let container = this.siblings('.gutenburg-editor-holder')[0];
      if (!container) {
        const newContainer = $('<div class="gutenburg-editor-holder"></div>');
        this.before(newContainer);

        container = newContainer[0];
      }
      return container;
    },

    onunmatch() {
      this._super();
      // solves errors given by ReactDOM "no matched root found" error.
      ReactDOM.unmountComponentAtNode(this.siblings('.gutenburg-editor-holder')[0]);
    },

    onmatch() {
      const cmsContent = this.closest('.cms-content').attr('id');
      const context = (cmsContent)
        ? { context: cmsContent }
        : {};

      // const GutenburgEditorField = loadComponent('GutenburgEditorField', context);
      // this.setComponent(GutenburgEditorField);

      this._super();
      this.hide();
      this.refresh();
    },

    onclick(e) {
      // we don't want the native upload dialog to show up
      e.preventDefault();
    },

    refresh() {
      const form = $(this).closest('form');
      const settings = {
        bodyPlaceholder: 'Add page content here'
      };
      const post = {};
      try {
        post.content = JSON.parse(this.val());
      } catch (e) {
        post.content = {raw: ""};
      }

      // TODO: rework entwine so that react has control of holder
      const editor = ReactDOM.render(
        <EditorProvider settings={settings} post={post}>
         <Layout />
        </EditorProvider>,
        this.getContainer()
      );

      editor.store.subscribe(() => {
        const currentData = editor.store.getState().editor.present;
        const retData = [];

        currentData.blockOrder[''].map(uid => {
          retData.push(currentData.blocksByUid[uid]);
        });
        this.val(JSON.stringify(retData));
        form.trigger('change');
      });
    },
  });
});
