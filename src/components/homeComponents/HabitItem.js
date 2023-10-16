import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../styles/generalStyle';
import { colors } from '../../styles/generalStyle';

const HabitItem = ({ habitName }) => {
  return (
    <View style={styles.container}>
      <Text style={[generalStyles.normalText, {color: 'white', textAlign: 'left'}]}>{habitName}</Text>
    </View>
  )
}

export default HabitItem

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: colors.habitColorPrimary,
        padding: 10,
        paddingLeft: 20,
        marginVertical: 5,
    }
})