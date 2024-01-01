import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    camera: false,
    nudgeOpen: null,
    hideTabBar: false,
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
        toggleTabBar: (state) => {
            state.hideTabBar = !state.hideTabBar;
        },
        setTabBar: (state, action) => {
            state.hideTabBar = action.payload;
        }
    }
});


export const { setAppLoading, toggleCamera, setNudgeOpen, toggleTabBar, setTabBar } = appSlice.actions;

export default appSlice.reducer;