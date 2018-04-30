import { select } from '@wordpress/data';

export default {
    NOTIFY_OF_CHANGE(action, store) {
        const {
            getCurrentPost,
            getPostEdits,
            getEditedPostContent
        } = select('core/editor');

        const { getState, dispatch } = store;

        const state = getState();
        const edits = getPostEdits( state );
        const toSend = {
            ...edits,
            content: getEditedPostContent( state ),
        };

        window.dispatchEvent(new CustomEvent('gutenberg:content', {
            detail: toSend.content
        }));
    }
}
