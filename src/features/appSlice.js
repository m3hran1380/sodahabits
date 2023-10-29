import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    camera: false,
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
        }
    }
});


export const { setAppLoading, toggleCamera } = appSlice.actions;

export default appSlice.reducer;