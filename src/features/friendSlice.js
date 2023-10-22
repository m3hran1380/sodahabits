import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    incomingRequests: [],
    outgoingRequests: [],
}


const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        setIncomingRequests: (state, action) => {
            state.incomingRequests = action.payload;
        },
        setOutgoingRequests: (state, action) => {
            state.outgoingRequests = action.payload;
        }
    }
});


export const { setIncomingRequests, setOutgoingRequests } = friendSlice.actions;

export default friendSlice.reducer;