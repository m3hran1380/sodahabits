import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../styles/generalStyle';
import { colors } from '../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';


const VendingMachineScreen = () => {
  return (
    <View style={styles.parentContainer}>
        <SafeAreaView style={styles.container}>
            <Text>VendingMachineScreen</Text>
        </SafeAreaView>
    </View>
)
}

export default VendingMachineScreen;

const styles = StyleSheet.create({
  ...generalStyles,
  parentContainer: {
      flex: 1, 
      backgroundColor: colors.backgroundColorPrimary
  }
})