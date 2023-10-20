import { StyleSheet, View, TextInput } from 'react-native'


const FormInput = ({ placeholder, handleInput, value }) => {

    return (
        <View style={styles.container}>
            <TextInput 
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
        margin: 10,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: 'white',
    },
    textInput: {
        backgroundColor: 'white',
    }
})