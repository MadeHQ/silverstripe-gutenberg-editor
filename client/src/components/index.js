import * as RichText from './rich-text';

export { default as ChangesMonitor } from './changes-monitor';
export { default as Header } from './header';
export { default as Layout } from './layout';
export { default as Sidebar } from './sidebar';
export { default as VisualEditor } from './visual-editor';
export { default as Personalisation } from './personalisation';



export { RichText };

window.wp = window.wp || {};
window.wp.components2 = RichText;
