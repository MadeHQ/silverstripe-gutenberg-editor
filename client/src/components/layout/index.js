import { Popover } from '@wordpress/components';
import { EditorNotices, PreserveScrollInReorder } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';

import Header from '../header';
import ChangesMonitor from '../changes-monitor';
import VisualEditor from '../visual-editor';
import Sidebar from '../sidebar';

function Layout({showSidebar, pageContent}) {
    return (
        <div className="edit-post-layout">
            <Header />
            <ChangesMonitor />
            <div
                className="edit-post-layout__content"
                role="region"
                aria-label={__('Editor content')}
                tabIndex="-1"
            >
                <EditorNotices />
                <PreserveScrollInReorder />
                <VisualEditor />
            </div>
            {showSidebar && <Sidebar />}
            <Popover.Slot />
        </div>
    );
}

export default withSelect(select => ({
    showSidebar: select('standalone-gutenberg').isSidebarOpened(),
}))(Layout);
