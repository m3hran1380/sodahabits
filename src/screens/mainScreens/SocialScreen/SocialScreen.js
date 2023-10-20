import { StyleSheet, Text, View, Keyboard, Pressable } from 'react-native';
import generalStyles from '../../../styles/generalStyle';
import { colors } from '../../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsMenu from '../../../components/socialComponents/FriendComponents/FriendsMenu';
import DismissKeyboard from '../../../components/DismissKeyboard';
import AddFriendsModal from '../../../components/socialComponents/FriendComponents/AddFriendsModal';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useState } from 'react';



const SocialScreen = () => {
    const friendModalOpen = useSharedValue(false);
    const [modalStatus, setModalStatus] = useState(false);

    const closeModal = () => {
        Keyboard.dismiss();
        setModalStatus(false);
        friendModalOpen.value = false;
    }

    const openModal = () => {
        setModalStatus(true);
        friendModalOpen.value = true;
    }

    const friendModalStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {scale: friendModalOpen.value ? withSpring(1) : withSpring(0)}
            ]
        }
    })

    return (
        <DismissKeyboard>
            <View style={styles.parentContainer}>
                <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                    {/* the following pressable component closes the modal when user clicks outside of it */}
                    <Pressable onPress={() => {closeModal(); Keyboard.dismiss()}} style={styles.modalOverlay} />
                    <Text style={[generalStyles.h1, {color: 'white'}]}>Soda Community</Text>
                    <FriendsMenu openModal={openModal} />
                    <AddFriendsModal status={modalStatus} closeModal={closeModal} style={friendModalStyle}/>
                </SafeAreaView>
            </View>
        </DismissKeyboard>
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