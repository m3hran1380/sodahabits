import { createSlice } from "@reduxjs/toolkit";


// friendList contains the user's friends data

const initialState = {
    incomingRequests: [],
    outgoingRequests: [],
    friendsList: [],
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
        },
        setFriends: (state, action) => {
            state.friendsList = action.payload;
        },
    }
});


export const { setIncomingRequests, setOutgoingRequests, setFriends } = friendSlice.actions;

export default friendSlice.reducer;