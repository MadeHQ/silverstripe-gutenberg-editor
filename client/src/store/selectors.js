import { get } from 'lodash';

export function getPreferences(state) {
  return state.preferences;
}

export function getPreference(state, preferenceKey, defaultValue) {
  const preferences = getPreferences(state);
  const value = preferences[preferenceKey];
  return value === undefined ? defaultValue : value;
}

export function isSidebarOpened(state) {
  return getPreference(state, "sidebar");
}

export function getActivePanel(state) {
  return state.panel;
}

export function getChanges(state) {
    return get(state, ['editor', 'present', 'edits'], {});
}

export function isFeatureActive(state, feature) {
    return !!getPreference(state, 'feature', [])[feature];
}

export function getActiveGeneralSidebarName(state) {
    return getPreference(state, 'activeGeneralSidebar', null);
}
