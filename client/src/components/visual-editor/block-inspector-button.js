/**
 * External dependencies
 */
import { flow, noop } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { IconButton, withSpokenMessages } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/element';

export function BlockInspectorButton( {
    areAdvancedSettingsOpened,
    closeSidebar,
    openEditorSidebar,
    onClick = noop,
    small = false,
    speak,
} ) {
    const speakMessage = () => {
        if ( areAdvancedSettingsOpened ) {
            speak( __( 'Additional settings are now available in the Editor advanced settings sidebar' ) );
        } else {
            speak( __( 'Advanced settings closed' ) );
        }
    };

    const label = areAdvancedSettingsOpened ? __( 'Hide Advanced Settings' ) : __( 'Show Advanced Settings' );

    return (
        <IconButton
            className="editor-block-settings-menu__control"
            onClick={ flow( areAdvancedSettingsOpened ? closeSidebar : openEditorSidebar, speakMessage, onClick ) }
            icon="admin-generic"
            label={ small ? label : undefined }
        >
            { ! small && label }
        </IconButton>
    );
}

export default compose(
    withSelect(select => ({
        areAdvancedSettingsOpened: select('standalone-gutenberg').getActiveGeneralSidebarName() === 'standalone-gutenberg',
    })),

    withDispatch(dispatch => ({
        openEditorSidebar: () => dispatch('standalone-gutenberg').openGeneralSidebar('standalone-gutenberg'),
        closeSidebar: dispatch('standalone-gutenberg').closeGeneralSidebar,
    })),

    withSpokenMessages,
)(BlockInspectorButton);
