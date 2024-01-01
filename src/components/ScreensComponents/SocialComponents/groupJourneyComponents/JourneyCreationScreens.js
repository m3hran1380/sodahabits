import { StyleSheet, View, Modal, Pressable } from 'react-native';
import React, { useState } from 'react';
import JourneyDescriptionScreen from './JourneyDescriptionScreen';
import JourneyFriendInvitationScreen from './JourneyFriendInvitationScreen';

// this screen is pre-populated with EP.1 details as a journey can only be started from episode 1
const JourneyCreationScreens = ({setStartJourney, groupId}) => {

    const [showInviteScreen, setShowInviteScreen] = useState(false);

    return (
        <Modal transparent={true}>
            <View style={styles.container}>
                <Pressable style={styles.dismissLayer} onPress={() => setStartJourney(false)} />
                {!showInviteScreen ? 
                    <JourneyDescriptionScreen setShowInviteScreen={setShowInviteScreen} />
                    :
                    <JourneyFriendInvitationScreen groupId={groupId} />
                }
            </View>
        </Modal>
    )
}

export default JourneyCreationScreens

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dismissLayer: {
        ...StyleSheet.absoluteFillObject,
    },
})