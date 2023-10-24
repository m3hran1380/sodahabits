import { FlatList, StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../../../styles/generalStyle';
import { actualScreenHeight, colors } from '../../../../styles/generalStyle';
import InviteButton from '../InviteButton';
import RequestInboxButton from './friendRequestComponents/RequestInboxButton';
import { useSelector } from 'react-redux';
import FriendItem from './FriendItem';


const FriendsMenu = ({ openAddFriendModal, openRequestInboxModal }) => {

    const userFriends = useSelector(state => state.friends.friendsList);
    const sortedFriends = userFriends.slice().sort((a, b) => a.username.localeCompare(b.username));

    return (
        <View style={styles.container}>
            <Text style={generalStyles.h2}>Friends</Text>
            <View style={styles.friendBox}>
                <FlatList 
                    data={sortedFriends}
                    keyExtractor={friend => friend.id}
                    renderItem={(friendData) => {
                        return <FriendItem userData={friendData.item} />
                    }}
                    style={styles.friendList}
                />
                <View style={styles.buttonsContainer}>
                    <InviteButton style={styles.addBtn} handlePress={openAddFriendModal} title='Add friends' />
                    <RequestInboxButton style={styles.addBtn} handlePress={openRequestInboxModal} />
                </View>
            </View>
        </View>
    )
}

export default FriendsMenu

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
    friendBox: {
        height: actualScreenHeight * 0.35,
        backgroundColor: colors.backgroundColorSecondary,
        borderRadius: 10,
        marginTop: 10,
        paddingTop: 10,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    friendList: {
        width: '100%',
    },
    addBtn: {
        marginVertical: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})