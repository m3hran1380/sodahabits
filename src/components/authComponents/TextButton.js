import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react'

const TextButton = ({ children, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <Text style={styles.text}>{children}</Text>
        </Pressable>
    )
}

export default TextButton

const styles = StyleSheet.create({
    text: {
        color: 'blue',
        borderBottomColor: 'blue',
        borderBottomWidth: 1,
    }
})