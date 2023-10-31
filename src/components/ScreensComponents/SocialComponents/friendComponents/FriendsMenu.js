import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import generalStyles from '../../../../styles/generalStyle';
import { actualScreenHeight, colors } from '../../../../styles/generalStyle';
import InviteButton from '../InviteButton';
import RequestInboxButton from './friendRequestComponents/RequestInboxButton';
import { useSelector } from 'react-redux';
import FriendItem from './FriendItem';
import { getUsersById } from '../../../../businessLogic/firestoreFunctions';


const FriendsMenu = ({ openAddFriendModal, openRequestInboxModal }) => {

    const {friendsList, incomingRequests} = useSelector(state => state.friends);
    // the following is the data of friends + incoming requests.
    const [combinedData, setCombinedData] = useState();

    const sortedFriends = friendsList.slice().sort((a, b) => a.username.localeCompare(b.username));

    // retrieve the user profile informations - INCOMING:
    useEffect(() => {
        const incomingUserIds = incomingRequests.map((request) => request.senderId);
        (async () => {
            const retrievedData = await getUsersById(incomingUserIds);
            retrievedData.forEach((user) => user.type = 'request');
            // sort and then combine the data with the users friends:
            retrievedData.sort((a, b) => a.username.localeCompare(b.username));
            const dataCombined = [...retrievedData, ...sortedFriends];
            setCombinedData(dataCombined);
        })();
    }, [incomingRequests, setCombinedData]);
    
    console.log(combinedData);

    return (
        <View style={styles.container}>
            <Text style={generalStyles.h2}>Friends</Text>
            <View style={styles.friendContainer}>
                <FlatList
                    numColumns={3}
                    data={combinedData}
                    keyExtractor={friend => friend.id}
                    renderItem={({item}) => {
                        if (item?.type) return <FriendItem userData={item} />
                        else return <FriendItem userData={item} />
                    }}
                />
            </View>
        </View>
    )
}

export default FriendsMenu

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    friendContainer: {

    },
    // friendBox: {
    //     height: actualScreenHeight * 0.35,
    //     backgroundColor: colors.backgroundColorSecondary,
    //     borderRadius: 10,
    //     marginTop: 10,
    //     paddingTop: 10,
    //     justifyContent: 'flex-end',
    //     alignItems: 'center',
    // },
    friendList: {
        width: '100%',
    },
    // addBtn: {
    //     marginVertical: 10,
    // },
    // buttonsContainer: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    // }
})