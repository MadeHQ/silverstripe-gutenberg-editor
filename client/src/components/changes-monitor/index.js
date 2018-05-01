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
    })),

    withDispatch(dispatch => ({
        notifyOfChange: dispatch('standalone-gutenberg').notifyOfChange,
    })),
])(ChangesMonitor);
