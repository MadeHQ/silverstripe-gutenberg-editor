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
