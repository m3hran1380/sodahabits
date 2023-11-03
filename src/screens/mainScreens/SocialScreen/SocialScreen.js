import { ScrollView, StyleSheet, Text, View } from 'react-native';
import generalStyles, { actualScreenHeight, availableScreenWidth2, colors } from '../../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsMenu from '../../../components/ScreensComponents/SocialComponents/friendComponents/FriendsMenu';
import GroupsMenu from '../../../components/ScreensComponents/SocialComponents/groupComponents/GroupMenu';

const SocialScreen = () => {
    
    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                <ScrollView>
                    <GroupsMenu style={styles.groupsMenu}/>
                    <FriendsMenu />               
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default SocialScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 60,
        paddingBottom: 70,
    },
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary,
    },
    groupsMenu: {
        height: actualScreenHeight - (availableScreenWidth2 + 55 + 60 + 95),
    }
})