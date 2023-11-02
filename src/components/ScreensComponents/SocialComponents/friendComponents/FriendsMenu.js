import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import generalStyles from '../../../../styles/generalStyle';
import { useSelector } from 'react-redux';
import FriendItem from './FriendItem';
import { getUsersById } from '../../../../businessLogic/firestoreFunctions';
import AddFriendIcon from '../../../../../assets/svgs/Icons/socialIcons/friendIcons/addFriend.svg';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const FriendsMenu = ({ }) => {
    const {friendsList, incomingRequests} = useSelector(state => state.friends);
    // the following is the data of friends + incoming requests.
    const [combinedData, setCombinedData] = useState();    
    const navigation = useNavigation();


    // retrieve the user profile informations - INCOMING:
    useEffect(() => {
        const sortedFriends = friendsList.slice().sort((a, b) => a.username.localeCompare(b.username));
        const incomingUserIds = incomingRequests.map((request) => request.senderId);
        (async () => {
            const retrievedData = await getUsersById(incomingUserIds);
            retrievedData.forEach((user) => user.type = 'request');
            // sort and then combine the data with the users friends:
            retrievedData.sort((a, b) => a.username.localeCompare(b.username));
            const dataCombined = [...retrievedData, ...sortedFriends];
            setCombinedData(dataCombined);
        })();
    }, [incomingRequests, friendsList, setCombinedData]);
    

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={generalStyles.h2}>Friends</Text>
                <Pressable onPress={() => {navigation.navigate('social search screen')}} style={styles.addIconContainer}>
                    <AddFriendIcon width={27} height={27}/>
                </Pressable>
            </View>
            <FlatList
                numColumns={3}
                data={combinedData}
                keyExtractor={friend => friend.id}
                renderItem={({item}) => 
                    <FriendItem userData={item} />
                }
            />
        </View>
    )
}

export default FriendsMenu

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    friendList: {
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addIconContainer: {
        justifyContent: 'center',
        // alignItems: 'center',
    }
})