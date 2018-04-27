import { select } from '@wordpress/data';

export default {
    DETECT_CHANGE(action, store) {
        const {
            getCurrentPost,
            getPostEdits,
            getEditedPostContent,
            isEditedPostSaveable,
            isEditedPostNew,
            isEditedPostDirty,
            isCurrentPostPublished,
        } = select('core/editor');

        const { getState, dispatch } = store;
        const state = getState();

        const edits = getPostEdits(state);

        window.dispatchEvent(new CustomEvent('gutenberg:content', {
            detail: {
                ...edits,
                content: getEditedPostContent(state),
            }
        }));
    }
}
