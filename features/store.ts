import {configureStore} from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import modalReducer from "./modalStore";

export const store = configureStore({
    reducer: {
        app: appReducer, // Register profile slice
        modal: modalReducer,
    },
});

// Define types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
