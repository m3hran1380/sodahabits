import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    camera: false,
    nudgeOpen: null,
    unreadNotifications: [],
}


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAppLoading: (state, action) => {
            state.loading = action.payload;
        },
        toggleCamera: (state) => {
            state.camera = !state.camera;
        },
        setNudgeOpen: (state, action) => {
            state.nudgeOpen = action.payload;
        },
        setUnreadNotifications: (state, action) => {
            state.unreadNotifications = action.payload;
        },
    }
});


export const { setAppLoading, toggleCamera, setNudgeOpen, setUnreadNotifications } = appSlice.actions;

export default appSlice.reducer;