import { Pressable, StyleSheet, Text, View } from 'react-native';
import CloseHabitIcon from '../../../../../assets/svgs/Icons/socialFeedIcons/closeHabit.svg';

const ExpandedHabitOverlay = ({ habitData, setExpandedHabit }) => {

    return (
        <Pressable onPress={() => {setExpandedHabit(null)}} style={styles.container}>
            <View style={styles.closeBtnContainer}><CloseHabitIcon height='100%' /></View>
        </Pressable>
    )
}

export default ExpandedHabitOverlay

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.9)'
    },
    closeBtnContainer: {
        position: 'absolute',
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
    }
})