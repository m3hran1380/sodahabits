import { StyleSheet, TextInput, Pressable, Text } from 'react-native'
import Animated, { withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons/';
import { useState } from 'react';
import { availableScreenWidth } from '../../styles/generalStyle';

const AnimatedTextInput = ({ placeholder, style, setError, setValue, inputValue }) => {
    const [acceptInput, setAcceptInput] = useState(false);

    const handleInput = (input) => {
        setError(false);
        setValue(input);
    }

    const animatedInputStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(acceptInput ? availableScreenWidth : 50),
        }
    })

    const handlePress = () => {
        setAcceptInput(true);
    }

    return (
        <Animated.View style={[styles.container, animatedInputStyle, {...style}]}>            
            { !acceptInput && <Pressable onPress={handlePress}><AntDesign name='plus' size={45} style={style} /></Pressable> }
            { acceptInput && 
                <TextInput 
                    placeholder={placeholder} 
                    style={styles.textInput}
                    value={inputValue} 
                    onChangeText={handleInput}
                    maxLength={16}
                /> 
            }
        </Animated.View>
    )
}

export default AnimatedTextInput

const styles = StyleSheet.create({
    container: {
        borderWidth: 3,
        borderColor: 'black',
        borderRadius: 10,
        height: 50,
        marginVertical: 10,
    },
    textInput: {
        paddingHorizontal: 20,
        position: 'absolute',
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
})