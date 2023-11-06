import { StyleSheet, Text, View, Modal, Pressable, Image } from 'react-native'
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { availableScreenWidth2 } from '../../../../styles/generalStyle';
import { textStyle } from '../../../../styles/generalStyle';
import { deleteFriendRequest, acceptFriendRequest } from '../../../../businessLogic/firestoreFunctions';
import { useSelector } from 'react-redux';


const FriendRequestOverlay = ({ userData, setFriendRequestOverlay }) => {

    const user = useSelector(state => state.user.currentUser);
    
    const handleFriendAccept = async () => {
        setFriendRequestOverlay(false);
        await acceptFriendRequest(userData.id, user.uid);
    }
    const handleFriendReject = async () => {
        setFriendRequestOverlay(false);
        await deleteFriendRequest(userData.id, user.uid);
    }

    return (
        <Modal transparent={true}>
            <View style={styles.container}>
                <Pressable style={styles.innerOverlay} onPress={() => setFriendRequestOverlay(false)} />
                <View style={styles.innerContainer}>
                    <View style={styles.imageContainer}>
                        { userData?.pfpUrl ? 
                            <Image resizeMode='contain' source={{ uri: userData.pfpUrl }} style={styles.pfpImage} />
                            :
                            <DefaultPFP width='100%' height='100%' />
                        }
                    </View>
                    <Text style={styles.bigText}>{userData.username} wants to be friends!</Text>
                    <View style={styles.buttonContainer}>
                        <Pressable onPress={handleFriendReject} style={[styles.button, {backgroundColor: '#626262'}]}>
                            {({pressed}) => (
                                <Text style={[styles.text, pressed && {color: 'black'}]}>Decline</Text>
                            )}
                        </Pressable>
                        <Pressable onPress={handleFriendAccept} style={[styles.button, {backgroundColor: '#59B9FF'}]}>
                            {({pressed}) => (
                                <Text style={[styles.text, pressed && {color: 'black'}]}>Accept</Text>
                            )}
                        </Pressable>
                    </View>
                </View> 
            </View>
        </Modal>
    )
}

export default FriendRequestOverlay

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        top: '-7%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: (availableScreenWidth2/2.5),
        width: (availableScreenWidth2/2.5),
        borderRadius: (availableScreenWidth2/4),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    bigText: {
        color: 'white',
        ...textStyle.allText,
        ...textStyle.h1,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginHorizontal: '3%',
    },
    text: {
        color: 'white',
        ...textStyle.allText,
        ...textStyle.h1,
        textAlign: 'center',
        fontSize: 18,
    },
    innerOverlay: {
        ...StyleSheet.absoluteFillObject,
    }
})