/* global jQuery */
import GutenbergEditor from './components/GutenbergEditor';
import React from 'react';
import ReactDOM from 'react-dom';

jQuery.entwine('ss', ($) => {
  $('textarea.gutenburg-editor').entwine({

    getContainer() {
      let container = this.closest('div.gutenburg-editor-holder')[0];
      if (!container) {
        const newContainer = $('<div class="gutenburg-editor-holder"></div>');
        this.parent().before(newContainer);
        container = newContainer[0];
      }
      return container;
    },

    onmatch() {
      const container = this.getContainer();
      const form = $(this).closest('form');

      const blocks = [
        {
          type: 'paragraph',
          data: 'Here is a paragraph thats hard coded'
        }
      ];

      const onChange = () => {
        setTimeout(() => {
          form.trigger('change');
        });
      };

      ReactDOM.render(
        <GutenbergEditor
          blocks={blocks}
          onChange={onChange}
        />,
        container
      );
    }
  });
});
