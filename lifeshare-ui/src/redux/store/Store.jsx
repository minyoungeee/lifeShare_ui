import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "@/redux/reducer/RootReducers";

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
