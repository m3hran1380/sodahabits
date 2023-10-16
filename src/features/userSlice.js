import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    currentUser: null,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser = {...state.currentUser, ...action.payload};
        },
        clearUser: (state) => {
            state.currentUser = null;
        },
    }
});


export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;