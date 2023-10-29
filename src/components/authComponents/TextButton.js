import { StyleSheet, Text, Pressable } from 'react-native'
import React from 'react'

const TextButton = ({ children, onPress, nounderline, style }) => {
    return (
        <Pressable onPress={onPress}>
            <Text style={[styles.text, style, nounderline && {borderBottomWidth: 0}]}>{children}</Text>
        </Pressable>
    )
}

export default TextButton

const styles = StyleSheet.create({
    text: {
        color: '#426078',
        borderBottomColor: '#426078',
        borderBottomWidth: 1,
    }
})