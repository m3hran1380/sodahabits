import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friendsToInvite: [],
    groups: [],
    incomingInvitations: [],
}

const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        setInvitation: (state, action) => {
            state.friendsToInvite = action.payload;
        },
        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setIncomingInvitations: (state, action) => {
            state.incomingInvitations = action.payload;
        }
    }
});


export const { setInvitation, setGroups, setIncomingInvitations } = groupSlice.actions;

export default groupSlice.reducer;