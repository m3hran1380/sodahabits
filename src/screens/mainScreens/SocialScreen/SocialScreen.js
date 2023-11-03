import { StyleSheet, Text, View } from 'react-native';
import generalStyles, { availableScreenWidth2, colors } from '../../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsMenu from '../../../components/ScreensComponents/SocialComponents/friendComponents/FriendsMenu';
import GroupsMenu from '../../../components/ScreensComponents/SocialComponents/groupComponents/GroupMenu';

const SocialScreen = () => {
    
    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                <Text style={[generalStyles.h2, styles.headerText]}>Soda Community</Text>
                <GroupsMenu style={styles.groupsMenu}/>
                <FriendsMenu style={styles.friendsMenu} />               
            </SafeAreaView>
        </View>
    )
}

export default SocialScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingBottom: 70,
    },
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary,
    },
    headerText: {
        color: 'white',
        textAlign: 'left',
        marginVertical: 20,
    },
    friendsMenu: {
        height: availableScreenWidth2 + 55,
    },
    groupsMenu: {
        flex: 1,
    }
})