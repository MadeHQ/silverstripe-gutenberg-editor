import ReactDOM from 'react-dom';
import React from 'react';

import GutenbergEditor from './components/GutenbergEditor';
import BlockManagement from './utils/BlockManagement';

export * from './utils/BlockTypeInjector';

function renderEditor(element) {
    const blockManager = BlockManagement();

    const el = ReactDOM.render(
        <GutenbergEditor
            blockManager={blockManager}
        />,
        element
    );

    return {
        getBlockManager: () => {
            return blockManager;
        }
        // setBlockData: data => {
        //
        // },
        // getBlockData: () => {
        //
        // },
        // setBlockOrder: order => {
        //
        // },
        // getBlockOrder: () => {
        //
        // },
        // addBlock: () => {}
    }
}

window.renderEditor = renderEditor;

export default renderEditor;
