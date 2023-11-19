import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    camera: false,
    nudgeOpen: null,
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
    }
});


export const { setAppLoading, toggleCamera, setNudgeOpen } = appSlice.actions;

export default appSlice.reducer;