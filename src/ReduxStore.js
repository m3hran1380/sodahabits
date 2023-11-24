import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userSlice';
import appReducer from './features/appSlice';
import friendSlice from "./features/friendSlice";
import notificationSlice from "./features/notificationSlice";
import groupSlice from "./features/groupSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer,
        friends: friendSlice,
        notifications: notificationSlice,
        groups: groupSlice,
    }
})