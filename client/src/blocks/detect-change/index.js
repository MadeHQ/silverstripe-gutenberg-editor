/**
 * WordPress dependencies
 */
import { Component, compose } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

export class DetectChange extends Component {
    componentWillReceiveProps() {
        this.props.detectChange();
    }

    render() {
        return null;
    }
}

export default compose([
    withSelect(select => ({
        changes: select('standalone-gutenberg').getChanges(),
    })),

    withDispatch(dispatch => ({
        detectChange: dispatch('standalone-gutenberg').detectChange,
    })),
])(DetectChange);
