import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentNotificationIndex: null,
    unreadNotifications: [],
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
    }
});


export const { setNotificationIndex, setUnreadNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;