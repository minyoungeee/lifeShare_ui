import {ADMCODE_LIST} from "@/redux/action/AdmCodeAction";

const initialize = {
    admCodeInfo : null,
};

export const admCode = (state = initialize, action) => {
    switch(action.type) {
        case ADMCODE_LIST:
            return {
                admCodeInfo : {...action.payload}
            };
        default:
            return state;
    }
};