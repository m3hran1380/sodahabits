import { StyleSheet, Text, View } from 'react-native';
import generalStyles, { colors } from '../../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsMenu from '../../../components/ScreensComponents/SocialComponents/friendComponents/FriendsMenu';


const SocialScreen = () => {
    
    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                <Text style={[generalStyles.h2, styles.headerText]}>Soda Community</Text>
                <FriendsMenu />               
            </SafeAreaView>
        </View>
    )
}

export default SocialScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
    },
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary
    },
    headerText: {
        color: 'white',
        textAlign: 'left',
        marginVertical: 20,
    }
})