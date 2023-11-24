import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { availableScreenWidth2 } from '../../../../styles/generalStyle';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import CheckMark from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/invitationCheckmark.svg'


const GroupFriendItem = ({ userData, handleSelect }) => {
    const {friendsToInvite} = useSelector(state => state.groups);
    const [sendInvitation, setSendInvitation] = useState(friendsToInvite.includes(userData.id));

    const handleProfilePressed = () => {
        if (handleSelect) {
            setSendInvitation(val => !val);
            handleSelect(userData.id);
        }
    }

    return ( 
        <View style={styles.outermostContainer}>
            <Pressable onPress={handleProfilePressed} style={styles.pfpContainer}>                
                <View style={styles.imageContainer}>
                    { userData?.pfpUrl ? 
                        <Image resizeMode='contain' source={{ uri: userData.pfpUrl }} style={styles.pfpImage} />
                        :
                        <DefaultPFP style={styles.pfpImage} />
                    }
                </View>
                {sendInvitation &&
                    <View style={styles.checkMarkContainer}>
                        <CheckMark width='100%' height='100%' />
                    </View>
                }
            </Pressable>
            <View style={styles.usernameContainer}><Text style={styles.text}>{userData.username}</Text></View>
        </View>
    )
}

export default GroupFriendItem;


const styles = StyleSheet.create({
    outermostContainer: {
        marginBottom: 5,
    },
    pfpContainer: {
        width: availableScreenWidth2/3,
        height: availableScreenWidth2/3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: (availableScreenWidth2/3) * 0.7,
        width: (availableScreenWidth2/3) * 0.7,
        borderRadius: (availableScreenWidth2/3) * 0.35,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
    usernameContainer: {
        width: (availableScreenWidth2/3),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: (availableScreenWidth2/3) * 0.82,
    },
    checkMarkContainer: {
        width: availableScreenWidth2/3 * 0.15,
        height: availableScreenWidth2/3 * 0.15,
        position: 'absolute',
        bottom: (availableScreenWidth2/3) * 0.17,
        right: (availableScreenWidth2/3) * 0.17
    }
})