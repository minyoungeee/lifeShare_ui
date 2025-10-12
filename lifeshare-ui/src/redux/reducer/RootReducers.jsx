import {combineReducers} from 'redux';
import {persistReducer} from "redux-persist";
import storage from 'redux-persist/lib/storage/session';
import {auth} from '@/redux/reducer/AuthReducer';
import {popup} from "@/redux/reducer/PopupReducer";
import {admCode} from "@/redux/reducer/AdmCodeReducer";
import {event} from "@/redux/reducer/EventReducer";


const persistConfig = {
    key: 'root@rd2',
    storage,
    whiteList : [auth]
};

const rootReducer = combineReducers({
    auth,
    popup,
    admCode,
    event,
});

export default persistReducer(persistConfig, rootReducer);
