export function toggleSidebar() {
  return {
    type: "TOGGLE_SIDEBAR"
  };
}

export function setActivePanel(panel) {
  return {
    type: "SET_ACTIVE_PANEL",
    panel
  };
}

export function detectChanges() {
    return {
        type: 'DETECT_CHANGES',
    };
}

export function openGeneralSidebar(name) {
    return {
        type: 'OPEN_GENERAL_SIDEBAR',
        name,
    };
}

export function closeGeneralSidebar() {
    return {
        type: 'CLOSE_GENERAL_SIDEBAR',
    };
}
