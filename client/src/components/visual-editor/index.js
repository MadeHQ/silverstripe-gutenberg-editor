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

function VisualEditorBlockMenu( { children, onClose } ) {
    return (
        <Fragment>
            <BlockInspectorButton onClick={ onClose } role="menuitem" />
            { children }
        </Fragment>
    );
}

function VisualEditor( { hasFixedToolbar, isLargeViewport } ) {
    return (
        <BlockSelectionClearer className="edit-post-visual-editor">
            <EditorGlobalKeyboardShortcuts />
            <CopyHandler />
            <MultiSelectScrollIntoView />
            <WritingFlow>
                <ObserveTyping>
                    <BlockList showContextualToolbar={ !isLargeViewport || !hasFixedToolbar } renderBlockMenu={ VisualEditorBlockMenu } />
                </ObserveTyping>
            </WritingFlow>
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
