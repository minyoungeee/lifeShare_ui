import {STAGE_CHANGE, SET_MULTI_POPUP} from "@/redux/action/PopupAction";
import { PURGE } from "redux-persist";

const initialize = {
    state : "DEFAULT",
    popup : null
};

export const popup = (state = initialize, action) => {
    switch(action.type) {
        case STAGE_CHANGE:
            return {
                ...state,
                state : action.payload
            };
        case SET_MULTI_POPUP:
            return {
                ...state,
                popup : action.payload
            }
        case PURGE:
            return initialize;
        default:
            return state;
    }
};
