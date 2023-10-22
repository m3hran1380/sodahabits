import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userSlice';
import appReducer from './features/appSlice';
import friendSlice from "./features/friendSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer,
        friends: friendSlice,
    }
})