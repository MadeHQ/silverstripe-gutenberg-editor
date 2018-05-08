import { Component, compose } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

export class ChangesMonitor extends Component {
    constructor(props) {
        super(props);

        this.pendingNotification = null;
    }

    componentDidUpdate() {
        if (this.pendingNotification) {
            clearTimeout(this.pendingNotification);
        }

        console.log(this.props.edits);

        this.pendingNotification = setTimeout(
            () => this.props.notifyOfChange(),
            500
        );
    }

    componentWillUnmount() {
        if (this.pendingNotification) {
            clearTimeout(this.pendingNotification);
        }
    }

    render() {
        return null;
    }
}

export default compose([
    withSelect(select => ({
        content: select('core/editor').getEditedPostContent(),
        typing: select('core/editor').isTyping(),
        edits: select('core/editor').getPostEdits(),
    })),

    withDispatch(dispatch => ({
        notifyOfChange: dispatch('standalone-gutenberg').notifyOfChange,
    })),
])(ChangesMonitor);
