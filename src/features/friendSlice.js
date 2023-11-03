import { createSlice } from "@reduxjs/toolkit";


// friendList contains the user's friends data

const initialState = {
    incomingRequests: [],
    outgoingRequests: [],
    friendsList: [],
    incomingRequestsData: [],
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
        setIncomingRequestsData: (state, action) => {
            state.incomingRequestsData = action.payload;
        }
    }
});


export const { setIncomingRequests, setOutgoingRequests, setFriends, setIncomingRequestsData } = friendSlice.actions;

export default friendSlice.reducer;