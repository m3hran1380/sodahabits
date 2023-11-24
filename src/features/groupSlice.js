import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friendsToInvite: [],
    groups: [],
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
        }
    }
});


export const { setInvitation, setGroups } = groupSlice.actions;

export default groupSlice.reducer;