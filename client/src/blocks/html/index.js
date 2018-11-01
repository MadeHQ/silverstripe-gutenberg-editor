import * as html from '@wordpress/blocks/library/html';

import { BlockControls } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { withState, SandBox, CodeEditor } from '@wordpress/components';

export const name = html.name;

export const settings = {
    ...html.settings,

    edit: withState( {
        preview: false,
    } )( ( { attributes, setAttributes, setState, isSelected, toggleSelection, preview } ) => (
            <div className="wp-block-html">
                { isSelected && (
                    <BlockControls>
                        <div className="components-toolbar">
                            <button
                                className={ `components-tab-button ${ ! preview ? 'is-active' : '' }` }
                                onClick={ () => setState( { preview: false } ) }
                            >
                                <span>HTML</span>
                            </button>
                            <button
                                className={ `components-tab-button ${ preview ? 'is-active' : '' }` }
                                onClick={ () => setState( { preview: true } ) }
                            >
                                <span>{ __( 'Preview' ) }</span>
                            </button>
                        </div>
                    </BlockControls>
                ) }
                { preview ? (
                    <SandBox html={ attributes.content } />
                ) : (
                    <CodeEditor
                        value={ attributes.content }
                        focus={ isSelected }
                        onFocus={ toggleSelection }
                        onChange={ content => setAttributes( { content } ) }
                    />
                ) }
            </div>
        )),
};
