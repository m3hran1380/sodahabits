import { StyleSheet, View } from 'react-native';
import { colors } from '../../../styles/generalStyle';


const HabitTrackerDot = ({ status }) => {

    let dotStyles;

    switch (status) {
        case 'complete':
            dotStyles = {
                backgroundColor: colors.colorSuccess, 
            }
            break;
        case 'not-complete':
            dotStyles = {
                backgroundColor: colors.colorFailure,
            }
            break;
        case 'pending':
            dotStyles = {
                borderWidth: 1,
                borderColor: 'white',
            }
            break;
        case null:
            dotStyles = {
                backgroundColor: colors.colorNull,
            }
    }


    return (
        <View style={[styles.container, dotStyles]} />
    )
}

export default HabitTrackerDot

const styles = StyleSheet.create({
    container: {
        height: 16,
        width: 16,
        borderRadius: 8,
        marginHorizontal: 2,
    }
})