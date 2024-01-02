import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import MemberItem from './MemberItem';
import { textStyle, availableScreenWidth2 } from '../../../../styles/generalStyle';
import BlueButton from '../../../buttons/BlueButton';
import { startJourney } from '../../../../businessLogic/firestoreFunctions';


const JourneyFriendInvitationScreen = ({groupId}) => {
    const groupMembersData = useSelector(state => state.groups.members)[groupId];
    const groupJourneys = useSelector(state => state.groups.journeys)[groupId];
    const user = useSelector(state => state.user.currentUser);

    const [membersAvailableToInvite, setMembersAvailableToInvite] = useState([]);
    const [membersToInvite, setMembersToInvite] = useState([]);

    // find list of all group members that are not part of a journey already:
    useEffect(() => {
        let membersInJourneys = [];
        groupJourneys.forEach(journey => {
            membersInJourneys = [...membersInJourneys, ...journey.members];
        });
        // remove the current user and any user who is already in a journey from the list of users that can be invited to the journey.
        const membersAvailableToInvite = groupMembersData.filter(member => !membersInJourneys.includes(member.id) && member.id !== user.uid);
        setMembersAvailableToInvite(membersAvailableToInvite);
    }, [groupJourneys]);


    const handleSelect = (id) => {
        if (membersToInvite.includes(id)) {
            setMembersToInvite(members => members.filter(memberId => !(memberId === id)));
        }
        else {
            setMembersToInvite(members => [...members, id]);
        }
    }

    const handleJourneyStart = async () => {
        await startJourney(groupId, user.uid, membersToInvite);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}> 
                <Text style={styles.mainTitle}>Invite group members to join the journey</Text>
                <Text style={styles.subTitle}>minimum 2 members are required to start a journey sequence.</Text>
            </View>

            <View style={styles.listContainer}>
                <FlatList
                    data={membersAvailableToInvite}
                    numColumns={3}
                    renderItem={({item}) => <MemberItem userData={item} handleSelect={handleSelect} />} 
                    keyExtractor={(item) => item.id}
                />
            </View>

            <BlueButton onPress={handleJourneyStart} label='Invite friends' disabled={membersToInvite.length < 2}/>
        </View>
    )
}

export default JourneyFriendInvitationScreen

const styles = StyleSheet.create({
    mainTitle: {
        color: 'white',
        textAlign: 'center',
        ...textStyle.allTextBold,
        fontSize: 25,
    },
    subTitle: {
        color: '#979797',
        textAlign: 'center',
        ...textStyle.allText,
        fontSize: 14,
        marginVertical: 10,
    },
    listContainer: {
        height: ((availableScreenWidth2/3) * 3) + 20,
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        height: '100%',
        paddingTop: 60,
    }
})