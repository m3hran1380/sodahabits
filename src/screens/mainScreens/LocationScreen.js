import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../styles/generalStyle';
import { colors } from '../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';


const LocationScreen = () => {
  return (
    <View style={styles.parentContainer}>
        <SafeAreaView style={styles.container}>
            <Text>LocationScreen</Text>
        </SafeAreaView>
    </View>
)
}

export default LocationScreen;

const styles = StyleSheet.create({
  ...generalStyles,
  parentContainer: {
      flex: 1, 
      backgroundColor: colors.backgroundColorPrimary
  }
})