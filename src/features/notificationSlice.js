import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentNotificationIndex: null,
    unreadNotifications: [],
    unreadNotificationsData: [],
}

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        setNotificationIndex: (state, action) => {
            state.currentNotificationIndex = action.payload;
        },
        setUnreadNotifications: (state, action) => {
            state.unreadNotifications = action.payload;
        },
        setUnreadNotificationsData: (state, action) => {
            state.unreadNotificationsData = action.payload;
        }
    }
});


export const { setNotificationIndex, setUnreadNotifications, setUnreadNotificationsData } = notificationSlice.actions;

export default notificationSlice.reducer;