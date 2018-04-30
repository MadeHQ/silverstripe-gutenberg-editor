import { combineReducers } from 'redux';

export function preferences(state = { sidebar: false }, action) {
    switch (action.type) {
        case 'TOGGLE_SIDEBAR':
            return {
                ...state,
                sidebar: !state.sidebar
            };
    }

    return state;
}

export function panel(state = 'block', action) {
    switch (action.type) {
        case 'SET_ACTIVE_PANEL':
            return action.panel;
    }

    return state;
}

export function features(state = { fixedToolbar: false }, action) {
    if (action.type === 'TOGGLE_FEATURE') {
        return {
            ...state,
            [action.feature]: !state[action.feature],
        };
    }

    return state;
}

export default combineReducers({
    preferences,
    panel,
    features,
});
