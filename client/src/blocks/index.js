import '../hooks';

import { registerBlockType, setDefaultBlockName, unregisterBlockType } from '@wordpress/blocks';

import * as paragraph from './paragraph';
import * as embed from './embed';
// import * as list from './list';
import * as heading from './heading';
import * as image from './image';
import * as gallery from './gallery';
// import * as review from './review';
import * as button from './button';
import * as image2 from './image2';
// import * as rows from './rows';

// import * as paragraph from '@wordpress/blocks/library/paragraph';
// import * as heading from '@wordpress/blocks/library/heading';
// import * as subhead from '@wordpress/blocks/library/subhead';
import * as list from '@wordpress/blocks/library/list';
import * as quote from '@wordpress/blocks/library/quote';
import * as pullquote from '@wordpress/blocks/library/pullquote';
import * as code from '@wordpress/blocks/library/code';
// import * as embed from '@wordpress/blocks/library/embed';
import * as html from '@wordpress/blocks/library/html';
import * as separator from '@wordpress/blocks/library/separator';
import * as table from '@wordpress/blocks/library/table';
// import * as freeform from '@wordpress/blocks/library/freeform';
// import * as columns from '@wordpress/blocks/library/columns';

const blocks = [
    paragraph, embed, list,
    heading, quote, pullquote,
    image, gallery, image2,
    // review,
    code, html, separator, table,
    // freeform,
    button,
    // columns,
    // rows,
];

export const registerBlocks = () => {
    blocks.forEach(({ name, settings }) => {
        registerBlockType(name, settings);
    });

    setDefaultBlockName(paragraph.name);
    // setUnknownTypeHandlerName(freeform.name);
};

export const unregisterBlocks = () => {
    blocks.forEach(({ name, settings }) => {
        unregisterBlockType(name);
    });
}
