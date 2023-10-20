import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../styles/generalStyle';
import { actualScreenHeight, colors } from '../../styles/generalStyle';
import InviteButton from './InviteButton';


const FriendsMenu = () => {
    return (
        <View style={styles.container}>
            <Text style={generalStyles.h2}>Friends</Text>
            <View style={styles.friendBox}>
                <InviteButton title='Add friends' />
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
        justifyContent: 'center',
        alignItems: 'center'
    }
})