import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friendsToInvite: [],
    groups: [],
    incomingInvitations: [],
    journeys: {},
    members: {},
    currentJourney: {}
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
        },
        setCurrentJourney: (state, action) => {
            state.currentJourney = {...state.currentJourney, [action.payload.groupId]: action.payload.currentJourney};
        }
    }
});


export const { setInvitation, setGroups, setIncomingInvitations, setGroupJourneys, setGroupMembersData, setCurrentJourney } = groupSlice.actions;

export default groupSlice.reducer;