import { StyleSheet, Text, Pressable } from 'react-native';
import { colors } from '../../styles/generalStyle';
import LottieView from 'lottie-react-native';

const SubmitButton = ({ text, onPress, style, loading }) => {

    return (
        <Pressable 
            style={({ pressed }) => {return {...styles.buttonContainer, ...style, backgroundColor: pressed ? 'black' : colors.primaryColor}}}
            onPress={onPress}
            disabled={loading}
        >
            {!loading ? 
                <Text style={styles.buttonText}>{text}</Text>
                :
                <LottieView
                    autoPlay
                    loop
                    source={require('../../../assets/lottie/spinners/dot-spinner4.json')}
                    style={{width: 200, height: 200}}
                />
            }
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