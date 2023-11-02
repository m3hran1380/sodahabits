import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import generalStyles, { availableScreenWidth2, colors, textStyle } from '../../../../styles/generalStyle';
import { Ionicons } from '@expo/vector-icons/';
import { useSelector } from 'react-redux';
import { sendFriendRequest, deleteFriendRequest } from '../../../../businessLogic/firestoreFunctions';
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';


const RetrievedUser = ({ userData }) => {

    const user = useSelector((state) => state.user.currentUser);
    const {outgoingRequests} = useSelector((state) => state.friends);
    
    // is the retrieved user a user to whom we've already sent a friend request?
    const isOutgoingRequest = outgoingRequests.map((request) => request.receiverId).includes(userData.uid); 

    const sendRequest = async () => {
        try {
            await sendFriendRequest(user.uid, userData.uid);
        }
        catch (error) {
            console.log("Error while sending out a friend request ", error);
        }
    }

    const cancelRequest = async () => {
        try {
            await deleteFriendRequest(user.uid, userData.uid);
        }
        catch (error) {
            console.log("Error while cancelling outgoing request ", error)
        }       
    }

    const actionButtonPressed = async () => {
        if (isOutgoingRequest) {
            await cancelRequest();
        }
        else {
            await sendRequest();
        }
    }

    return ( 
        <View style={styles.pfpContainer}>
            <View style={styles.imageContainer}>
                { userData?.pfpurl ? 
                    <Image resizeMode='contain' source={{ uri: userData.pfpurl }} style={styles.pfpImage} />
                    :
                    <DefaultPFP style={styles.pfpImage} />
                }
            </View>
            <Pressable onPress={actionButtonPressed} style={[styles.actionButton, {backgroundColor: isOutgoingRequest ? '#626262' : '#59B9FF'}]}>
                {({pressed}) => 
                    <Text style={[textStyle.allText, {color: pressed ? 'black' : 'white'}]}>{isOutgoingRequest ? 'Cancel request' : 'Add'}</Text>
                }
            </Pressable>
            <Text style={styles.text}>{userData.username}</Text>
        </View>
    )
}

export default RetrievedUser

const styles = StyleSheet.create({
    pfpContainer: {
        width: availableScreenWidth2/3,
        height: availableScreenWidth2/3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
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
        marginTop: (availableScreenWidth2/3) * 0.1,
    },
    actionButton: {
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        position: 'absolute',
        top: (availableScreenWidth2/3) * 0.6,
    }
})