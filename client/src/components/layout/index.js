import { Popover } from "@wordpress/components";
import { BlockList, EditorNotices } from "@wordpress/editor";
import { __ } from "@wordpress/i18n";
import { withSelect } from "@wordpress/data";

import Header from "../header";
import Sidebar from "../sidebar";

import { DetectChanges } from "../../blocks";

function Layout({showSidebar, pageContent}) {
    return (
        <div className="edit-post-layout">
            <Header />
            <DetectChanges />
            <div
                className="edit-post-layout__content"
                role="region"
                aria-label={__("Editor content")}
                tabIndex="-1"
            >
                <EditorNotices />
                <div className="edit-post-layout__editor">
                    <div className="edit-post-visual-editor">
                        <BlockList showContextualToolbar={true} />
                    </div>
                </div>
            </div>
            {showSidebar && <Sidebar />}
            <Popover.Slot />
        </div>
    );
}

export default withSelect(select => ({
    showSidebar: select("standalone-gutenberg").isSidebarOpened(),
}))(Layout);
