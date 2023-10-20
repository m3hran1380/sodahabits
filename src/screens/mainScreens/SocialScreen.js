import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../styles/generalStyle';
import { colors } from '../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FriendsMenu from '../../components/socialComponents/FriendsMenu';


const SocialScreen = () => {
  return (
    <View style={styles.parentContainer}>
        <SafeAreaView style={styles.container}>
            <Text style={[styles.h1, {color: 'white'}]}>Soda Community</Text>
            <FriendsMenu />
        </SafeAreaView>
    </View>
)
}

export default SocialScreen

const styles = StyleSheet.create({
  ...generalStyles,
  parentContainer: {
      flex: 1, 
      backgroundColor: colors.backgroundColorPrimary
  }
})