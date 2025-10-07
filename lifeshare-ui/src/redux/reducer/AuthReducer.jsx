import {LOGIN, LOGOUT, PUBLIC_KEY} from "@/redux/action/AuthAction";
import { PURGE } from "redux-persist";

const initialize = {
    isLogin : false,
    user : null,
    publicKey : null
};

export const auth = (state = initialize, action) => {
    switch(action.type) {
        case LOGIN:
            return {
                ...state,
                isLogin : true,
                user : {...action.payload}
            };
        case LOGOUT:
            return {
                isLogin : false,
                user : null,
                publicKey: null
            };
        case PUBLIC_KEY:
            return {
                ...state,
                publicKey: action.payload
            }
        case PURGE:
            return initialize;
        default:
            return state;
    }
};