import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import generalStyles, { colors } from '../../../../../styles/generalStyle';
import { Ionicons, Feather } from '@expo/vector-icons/';
import { acceptFriendRequest, deleteFriendRequest } from '../../../../../businessLogic/firestoreFunctions';
import { useSelector } from 'react-redux';


const defaultPFP = require('../../../../../../assets/images/profilePictures/default-pfp.png');

const RetrievedUserRequest = ({ userData, type }) => {

    const user = useSelector(state => state.user.currentUser);

    const acceptRequest = async () => {
        await acceptFriendRequest(userData.id, user.uid, 'accepted');
    }

    const rejectRequest = async () => {
        let senderId, receiverId;
        if (type === 'incoming') {
            receiverId = user.uid;
            senderId = userData.id;
        }
        else {
            receiverId = userData.id;
            senderId = user.uid;
        }
        await deleteFriendRequest(senderId, receiverId);
    }


    return ( 
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                { userData?.pfpurl ? 
                    <Image resizeMode='contain' source={{ uri: userData.pfpurl }} style={styles.pfpImage} />
                    :
                    <Image resizeMode='contain' source={defaultPFP} style={styles.pfpImage} />
                }
            </View>
            <View style={styles.textContainer}>
                <Text style={[generalStyles.normalText, styles.text]}>{userData.username}</Text>
            </View>
            <View style={styles.buttonContainer}>
                { type === 'incoming' ? 
                    <>
                        <Pressable onPress={rejectRequest} style={({pressed}) => [styles.rejectIconContainer, pressed && {backgroundColor: 'black'}]}>
                            {({pressed}) => {
                                return <Feather name='x' size={20} style={[styles.icon, pressed && {color: 'white'}]} />
                            }}
                        </Pressable>
                        <Pressable onPress={acceptRequest} style={({pressed}) => [styles.acceptIconContainer, pressed && {backgroundColor: 'black'}]}>
                            {({pressed}) => {
                                return <Ionicons name='checkmark' size={20} style={[styles.icon, pressed && {color: 'white'}]} />
                            }}
                        </Pressable>
                    </> 
                    :
                    <Pressable onPress={rejectRequest} style={({pressed}) => [styles.rejectIconContainer, pressed && {backgroundColor: 'black'}]}>
                        {({pressed}) => {
                            return <Feather name='x' size={20} style={[styles.icon, pressed && {color: 'white'}]} />
                        }}
                    </Pressable>
                }      
            </View>
        </View>
    )
}

export default RetrievedUserRequest

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColorPrimary,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 2,
        alignItems: 'center',
        flexDirection: 'row',
        paddingRight: 10,
    },
    text: {
        textAlign: 'left',
        color: 'white',
    },
    imageContainer: {
        height: 40,
        width: 40,
        borderRadius: 20,
        overflow: 'hidden',
        marginLeft: 10,
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    textContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    acceptIconContainer: {
        height: 30,
        width:30,
        borderRadius: 10,
        backgroundColor: colors.colorSuccess,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    rejectIconContainer: {
        height: 30,
        width:30,
        borderRadius: 10,
        backgroundColor: colors.colorFailure,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
    }
})