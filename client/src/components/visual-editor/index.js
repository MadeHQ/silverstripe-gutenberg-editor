/**
 * WordPress dependencies
 */
import {
    BlockList,
    CopyHandler,
    WritingFlow,
    ObserveTyping,
    EditorGlobalKeyboardShortcuts,
    BlockSelectionClearer,
    MultiSelectScrollIntoView,
} from '@wordpress/editor';
import { Fragment, compose } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { withViewportMatch } from '@wordpress/viewport';

/**
 * Internal dependencies
 */
import './style.scss';
import BlockInspectorButton from './block-inspector-button';

function VisualEditor( { hasFixedToolbar, isLargeViewport } ) {
    return (
        <BlockSelectionClearer className="edit-post-visual-editor">
            <EditorGlobalKeyboardShortcuts />
            <CopyHandler />
            <MultiSelectScrollIntoView />
            <ObserveTyping>
                <WritingFlow>
                    <BlockList
                        showContextualToolbar={ ! isLargeViewport || ! hasFixedToolbar }
                        renderBlockMenu={ ( { children, onClose } ) => (
                            <Fragment>
                                <BlockInspectorButton onClick={ onClose } />
                                { children }
                            </Fragment>
                        ) }
                    />
                </WritingFlow>
            </ObserveTyping>
        </BlockSelectionClearer>
    );
}

export default compose([
    withSelect(select => ({
        hasFixedToolbar: select('standalone-gutenberg').isFeatureActive('fixedToolbar'),
    })),

    withViewportMatch({
        isLargeViewport: 'medium',
    }),
])(VisualEditor);
