import {TRIGGER_EVENT, RELOAD_EVENT} from "@/redux/action/EventAction";

const initialize = {
    timestamp : null,
    reload : null
};

export const event = (state = initialize, action) => {
    switch(action.type) {
        case TRIGGER_EVENT:
            return {
                ...state,
                timestamp : action.payload
            };
        case RELOAD_EVENT:
            return {
                ...state,
                reload: action.payload
            }
        default:
            return state;
    }
};
