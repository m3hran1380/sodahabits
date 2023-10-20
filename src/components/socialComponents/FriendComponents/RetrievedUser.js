import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import generalStyles, { colors } from '../../../styles/generalStyle';
import { Ionicons } from '@expo/vector-icons/';


const defaultPFP = require('../../../../assets/images/profilePictures/default-pfp.png');

const RetrievedUser = ({ userData }) => {
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
            <Pressable style={({pressed}) => [styles.addIconContainer, pressed && {backgroundColor: 'black'}]}>
                {({pressed}) => {
                    return <Ionicons name='person-add' size={20} style={[styles.addIcon, pressed && {color: 'white'}]} />
                }}
            </Pressable>
        </View>
    )
}

export default RetrievedUser

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColorPrimary,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 2,
        alignItems: 'center',
        flexDirection: 'row'
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
    addIconContainer: {
        height: 30,
        width:30,
        borderRadius: 10,
        backgroundColor: colors.colorSuccess,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    addIcon: {
        color: 'black',
    }
})