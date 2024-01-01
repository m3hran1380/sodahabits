import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friendsToInvite: [],
    groups: [],
    incomingInvitations: [],
    journeys: {},
    members: {},
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
        },
        setGroupJourneys: (state, action) => {
            state.journeys = {...state.journeys, [action.payload.groupId]: action.payload.journeysData}
        },
        setGroupMembersData: (state, action) => {
            state.members = {...state.members, [action.payload.groupId]: action.payload.membersData}
        }
    }
});


export const { setInvitation, setGroups, setIncomingInvitations, setGroupJourneys, setGroupMembersData } = groupSlice.actions;

export default groupSlice.reducer;