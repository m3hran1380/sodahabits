import { StyleSheet, Text, Pressable } from 'react-native';
import { colors } from '../../styles/generalStyle';

const SubmitButton = ({ text, onPress, style }) => {

    return (
        <Pressable 
            style={({ pressed }) => {return {...styles.buttonContainer, ...style, backgroundColor: pressed ? 'black' : colors.primaryColor}}}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{text}</Text>
        </Pressable>
    )
}

export default SubmitButton

const styles = StyleSheet.create({
    buttonText: {
        color: 'white',
        fontFamily: 'inter',
        fontSize: 15,
    },
    buttonContainer: {
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
})