/**
 * WordPress dependencies
 */
import { Component, compose } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';

export class DetectChanges extends Component {
    componentWillReceiveProps() {
        this.props.detectChanges();
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
        detectChanges: dispatch('standalone-gutenberg').detectChanges,
    })),
])(DetectChanges);
