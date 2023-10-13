import { StyleSheet, Pressable } from 'react-native';
import { colors } from '../../styles/generalStyle';
import { MaterialCommunityIcons } from '@expo/vector-icons/';


const NextButton = ({ onPress, style }) => {
    return (
        <Pressable onPress={onPress} style={({pressed}) => {return [styles.container, style, pressed && {backgroundColor: 'black'}]}}>
            <MaterialCommunityIcons name='greater-than' color='white' size={30} />
        </Pressable>
    )
}

export default NextButton

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    }
})