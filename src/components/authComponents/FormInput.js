import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { AntDesign } from '@expo/vector-icons/';

const FormInput = ({ label, placeholder, setValue, inputValue, isPassword, style, inputStyle, resetInputState, state }) => {

    const [isSecure, setIsSecure] = useState(isPassword);

    const handleInput = (input) => {
        resetInputState({ status: true })
        setValue(input);
    }

    const handleEyePress = () => {
        setIsSecure((val) => !val);
    }
    
    return (
        <View style={[styles.container, {...style}]}>
            <View style={styles.innerContainer}>
                <Text style={styles.label}>{label}</Text>
                <View style={styles.passwordContainer}>
                    <TextInput 
                        value={inputValue} 
                        onChangeText={handleInput} 
                        placeholder={placeholder} 
                        secureTextEntry={isSecure}
                        style={[styles.input, {...inputStyle}, isPassword && {paddingRight: 50}]}
                    />
                    {isPassword && 
                        <Pressable style={styles.eye} onPress={handleEyePress}>
                            <AntDesign name='eye' size={25}/>
                        </Pressable>
                    }
                </View>
                { !state.status && 
                    <Text style={styles.error}>{state.error}</Text>
                }
            </View>
        </View>
    )
}

export default FormInput;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    innerContainer: {
        width: '100%',
    },
    input: {
        backgroundColor: 'white',
        height: 47,
        width: '100%',
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: 'black',
        paddingHorizontal: 20,
    },
    label: {
        marginBottom: 2,
    },
    eye: {
        position: 'absolute',
        right: 10,
    },
    passwordContainer: {
        justifyContent: 'center',
    },
    error: {
        color: 'red',
    }
});