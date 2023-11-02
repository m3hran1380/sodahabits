import { StyleSheet, View, TextInput } from 'react-native'


const FormInput = ({ placeholder, handleInput, value, style }) => {

    return (
        <View style={[styles.container, style]}>
            <TextInput 
                placeholderTextColor={'#838383'}
                value={value} 
                onChangeText={handleInput} 
                style={styles.textInput} 
                placeholder={placeholder} 
            />
        </View>
    )
}

export default FormInput

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingHorizontal: 8,
        height: 40,
        backgroundColor: '#383838',
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#383838',
        color: 'white'
    }
})