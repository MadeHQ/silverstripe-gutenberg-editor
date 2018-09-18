import * as FeaturePanel from './blocks/feature-panel';

const registerBlockType = window.wp.blocks.registerBlockType;

document.addEventListener('GutenbergConfigSet', event => {
    [
        FeaturePanel,
    ].forEach(block => {
        registerBlockType(block.name, block.settings);
    })
});
