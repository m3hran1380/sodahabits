import { StyleSheet, Text, View, Pressable } from 'react-native';
import generalStyles, { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import BackButtonIcon from '../../../../../assets/svgs/Icons/socialIcons/friendIcons/backButton.svg';
import MembersIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/members.svg';
import GroupCansIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/groupCans.svg';
import GroupMilestoneIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/groupMilestone.svg';
import GroupJourneyIcons from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/groupJourney.svg';
import { useNavigation } from '@react-navigation/native';
import GroupInfoBox from './GroupInfoBox';
import RoundedProfilePicture from './RoundedProfilePicture';
import { useSelector } from 'react-redux';
import { useLayoutEffect, useState } from 'react';


const GroupScreenInfo = ({ groupData }) => {
    const navigation = useNavigation();
    const { friendsList } = useSelector(state => state.friends);
    const { currentUser } = useSelector(state => state.user);
    const [membersData, setMembersData] = useState([]);

    useLayoutEffect(() => {
        let membersData = friendsList.filter(friend => groupData.members.includes(friend.id));
        membersData=[currentUser, ...membersData];
        setMembersData(membersData);
    }, [friendsList]);

    console.log(membersData);

    return (
        <View style={{marginBottom: 10}}>
            <View style={styles.headerTextContainer}>
                <Pressable style={styles.groupHeaderBtns} onPress={() => {navigation.goBack()}}><BackButtonIcon width='100%' height='100%' /></Pressable>
                <Text style={[generalStyles.h2, styles.headerText]}>{groupData.name}</Text>
                <Pressable style={styles.groupHeaderBtns} onPress={() => {console.log("pressed")}}><MembersIcon width='100%' height='100%' /></Pressable>
            </View>
            <View style={[styles.headerTextContainer, styles.headerMargin]}>
                <Pressable style={styles.canIcon} onPress={() => {console.log("pressed")}}>
                    <GroupCansIcon width='57%' height='100%' />
                    <Text style={styles.canCount}>30</Text>
                </Pressable>
                <Pressable style={styles.milestoneIcon} onPress={() => {console.log("pressed")}}><GroupMilestoneIcon width='100%' height='100%' /></Pressable>
                <Pressable style={styles.journeyIcon} onPress={() => {console.log("pressed")}}><GroupJourneyIcons width='100%' height='100%' /></Pressable>
            </View>

            <GroupInfoBox style={styles.bestMemberContainer}>
                <RoundedProfilePicture userData={membersData[0]} radius={availableScreenWidth2/6} />
                <Text style={[styles.bigText, {textAlign: 'left', width: availableScreenWidth2 * 0.7}]}>{membersData[0]?.username} has taken the 'most disciplined' position</Text>
            </GroupInfoBox>

            <View style={styles.memberTitleContainer}>
                <GroupInfoBox style={[styles.memberInfoBox, {backgroundColor: '#32604F'}]}>
                    <Text style={styles.bigText}>{String.fromCodePoint('0x1f3c6')} Challenger</Text>
                    <RoundedProfilePicture userData={membersData[0]} radius={availableScreenWidth2/4} />
                    <Text style={styles.bigText}>{membersData[0]?.username}</Text>
                </GroupInfoBox>
                <GroupInfoBox style={[styles.memberInfoBox, {backgroundColor: '#32604F'}]}>
                    <Text style={styles.bigText}>{String.fromCodePoint('0x1f3c6')} Most Disciplined</Text>
                    <RoundedProfilePicture userData={membersData[0]} radius={availableScreenWidth2/4} />
                    <Text style={styles.bigText}>{membersData[0]?.username}</Text>
                </GroupInfoBox>
                <GroupInfoBox style={[styles.memberInfoBox, {backgroundColor: '#32604F'}]}>
                    <Text style={styles.bigText}>{String.fromCodePoint('0x1f3c6')} Best Motivator</Text>
                    <RoundedProfilePicture userData={membersData[1]} radius={availableScreenWidth2/4} />
                    <Text style={styles.bigText}>{membersData[1]?.username}</Text>
                </GroupInfoBox>
                <GroupInfoBox style={[styles.memberInfoBox, {backgroundColor: '#324760'}]}>
                    <Text style={styles.bigText}>Biggest Slacker</Text>
                    <RoundedProfilePicture userData={membersData[1]} radius={availableScreenWidth2/4} />    
                    <Text style={styles.bigText}>{membersData[1]?.username}</Text>
                </GroupInfoBox>
            </View>
        </View>
    )
}

export default GroupScreenInfo

const styles = StyleSheet.create({
    headerTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    headerMargin: {
        marginTop: 10,
    },
    headerText: {
        color: 'white',
        textAlign: 'left',
        bottom: 5,
    },
    groupHeaderBtns: {
        height: 30,
        width: 30,
    },
    canIcon: {
        width: availableScreenWidth2 / 5,
        height: availableScreenWidth2 / 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    milestoneIcon: {
        width: availableScreenWidth2 / 5,
        height: availableScreenWidth2 / 5,
    },
    journeyIcon: {
        width: availableScreenWidth2 / 5,
        height: availableScreenWidth2 / 5,
    },
    canCount: {
        color: 'white',
        fontSize: 40,
        right: -5,
    },
    bestMemberContainer: {
        backgroundColor: '#324760',
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memberInfoBox: {
        width: availableScreenWidth2/2 * 0.95,
        height: availableScreenWidth2/2 * 0.95,
        marginVertical: availableScreenWidth2/2 * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberTitleContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    bigText: {
        color: 'white',
        ...textStyle.allTextBold,
        fontSize: 15,
        textAlign: 'center'
    }
})