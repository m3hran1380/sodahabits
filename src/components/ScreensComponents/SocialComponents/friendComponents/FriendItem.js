import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import generalStyles, { colors } from '../../../../styles/generalStyle';
import { Ionicons, AntDesign } from '@expo/vector-icons/';
import { removeFriend } from '../../../../businessLogic/firestoreFunctions';
import { useSelector } from 'react-redux';
import { useState } from 'react';


const defaultPFP = require('../../../../../assets/images/profilePictures/default-pfp.png');

const FriendItem = ({ userData }) => {

    const user = useSelector(state => state.user.currentUser);
    const [removePopup, setRemovePopup] = useState(false);

    const handleFriendRemoval = async () => {
        await removeFriend(user.uid, userData.id);
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
                <Pressable style={styles.iconContainer}>
                    {({pressed}) => {
                        return <AntDesign name='message1' size={20} style={[styles.icon, pressed && {color: 'green'}]} />
                    }}
                </Pressable>
                <Pressable style={styles.iconContainer} onPress={() => setRemovePopup(true)}>
                    {({pressed}) => {
                        return <Ionicons name='person-remove' size={20} style={[styles.icon, pressed && {color: 'red'}]} />
                    }}
                </Pressable>
            </View>
            
            {removePopup &&
                <View style={styles.removeFriendContainer}>
                    <Pressable onPress={handleFriendRemoval} style={({pressed}) => [styles.removeBtn, {backgroundColor: pressed ? 'white' : 'green'}]}>
                        {({pressed}) => {
                            return <Text style={{color: pressed ? 'black' : 'white'}}>Confirm</Text>
                        }} 
                    </Pressable>
                    <Pressable onPress={() => setRemovePopup(false)} style={({pressed}) => [styles.removeBtn, {backgroundColor: pressed ? 'white' : 'red'}]}>
                        {({pressed}) => {
                            return <Text style={{color: pressed ? 'black' : 'white'}}>Cancel</Text>
                        }} 
                    </Pressable>
                </View>
            }
        </View>
    )
}

export default FriendItem

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
        overflow: 'hidden'
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
    iconContainer: {
        height: 30,
        width:30,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        color: 'white',
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    removeFriendContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeBtn: {
        borderRadius: 10,
        padding: 5,
        marginHorizontal: 5,
    }

})