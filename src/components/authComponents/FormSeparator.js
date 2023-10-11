import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const FormSeparator = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>{text}</Text>
            <View style={styles.line} />
        </View>
    )
}

export default FormSeparator

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        borderBottomWidth: 0.7,
        borderBottomColor: 'grey',
    },
    text: {
        paddingHorizontal: 10,
        bottom: -9,

    }
})