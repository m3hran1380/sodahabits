import { StyleSheet, Text, View, Keyboard, Pressable } from 'react-native';
import generalStyles, { colors } from '../../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsMenu from '../../../components/ScreensComponents/SocialComponents/friendComponents/FriendsMenu';
import AddFriendsModal from '../../../components/ScreensComponents/SocialComponents/friendComponents/addFriendsComponents/AddFriendsModal';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState } from 'react';
import RequestInboxModal from '../../../components/ScreensComponents/SocialComponents/friendComponents/friendRequestComponents/RequestInboxModal';



const SocialScreen = () => {
    const friendModalOpen = useSharedValue(false);
    const requestModalOpen = useSharedValue(false);
    const [friendModalStatus, setFriendModalStatus] = useState(false);
    const [requestInboxModalStatus, setRequestInboxModalStatus] = useState(false);


    // -------- code related to add friend modal --------- //
    const closeAddFriendModal = () => {
        Keyboard.dismiss();
        setFriendModalStatus(false);
        friendModalOpen.value = false;
    }

    const openAddFriendModal = () => {
        setFriendModalStatus(true);
        friendModalOpen.value = true;
        // only one modal should be open at any one time
        closeRequestInboxModel();
    }
    // -------- end --------- //


    // -------- code related to freind request inbox modal --------- //
    const closeRequestInboxModel = () => {
        Keyboard.dismiss();
        setRequestInboxModalStatus(false);
        requestModalOpen.value = false;
    }

    const openRequestInboxModal = () => {
        setRequestInboxModalStatus(true);
        requestModalOpen.value = true;
        // only one modal should be open at any one time
        closeAddFriendModal();
    }
    // -------- end --------- //

    const friendModalStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {scale: friendModalOpen.value ? withSpring(1) : withSpring(0)}
            ]
        }
    })
    const requestInboxModalStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {scale: requestModalOpen.value ? withSpring(1) : withSpring(0)}
            ]
        }
    })

    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                {/* the following pressable component closes the modal when user clicks outside of it */}
                <Pressable onPress={() => {closeAddFriendModal(); closeRequestInboxModel(); Keyboard.dismiss()}} style={styles.modalOverlay} />
                <Text style={[generalStyles.h1, {color: 'white'}]}>Soda Community</Text>
                
                <FriendsMenu openAddFriendModal={openAddFriendModal} openRequestInboxModal={openRequestInboxModal}/>
                <AddFriendsModal status={friendModalStatus} closeModal={closeAddFriendModal} style={friendModalStyle}/>
                <RequestInboxModal status={requestInboxModalStatus} closeModal={closeRequestInboxModel} style={requestInboxModalStyle} />

            </SafeAreaView>
        </View>
    )
}

export default SocialScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
    },
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary
    },
    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
})