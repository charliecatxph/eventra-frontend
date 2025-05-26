import {configureStore} from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import ordReducer from "./ordinaryEventSlice"
import dashReducer from "./dashboardSlice"
import bizReducer from "./attendBizmatchSlice"
import bizDashReducer from './bizmatchEventSlice';

export const store = configureStore({
    reducer: {
        app: appReducer, // Register profile slice

        ordSlice: ordReducer,
        dashSlice: dashReducer,
        bizSlice: bizReducer,
        bizDataSlice: bizDashReducer
    },
});

// Define types for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
