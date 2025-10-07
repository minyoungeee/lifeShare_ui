import {USER_LIST} from "@/redux/action/UserAction";

const initialize = {
    userInfo : null,
};

export const user = (state = initialize, action) => {
    switch(action.type) {
        case USER_LIST:
            return {
                userInfo : {...action.payload}
            };
        default:
            return state;
    }
};