import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../../../styles/generalStyle';
import { actualScreenHeight, colors } from '../../../../styles/generalStyle';
import InviteButton from '../InviteButton';
import RequestInboxButton from './friendRequestComponents/RequestInboxButton';



const FriendsMenu = ({ openAddFriendModal, openRequestInboxModal }) => {
    return (
        <View style={styles.container}>
            <Text style={generalStyles.h2}>Friends</Text>
            <View style={styles.friendBox}>
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
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    addBtn: {
        marginBottom: 10,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})