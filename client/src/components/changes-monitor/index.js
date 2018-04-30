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

        // console.log( this.props.content );

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

// export default connect(state => ({
//     changes: getEditedPostContent(state),
// }), {
//     notifyOfChange
// })(ChangesMonitor);

export default compose([
    withSelect(select => ({
        content: select('core/editor').getPostEdits(),
    })),

    withDispatch(dispatch => ({
        notifyOfChange: dispatch('standalone-gutenberg').notifyOfChange,
    })),
])(ChangesMonitor);
