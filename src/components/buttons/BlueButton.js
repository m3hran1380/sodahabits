import { Pressable, StyleSheet, Text, View } from 'react-native';
import { textStyle } from '../../styles/generalStyle';
import React from 'react'

const BlueButton = ({label, onPress, style, disabled}) => {
    return (
        <Pressable disabled={disabled} onPress={onPress} style={({pressed}) => {return [styles.container, style, pressed && {backgroundColor: 'black'}, disabled && {backgroundColor: '#878787'}]}}>
            <Text style={[styles.text, disabled && {color: '#4c4c4c'}]}>{label}</Text>
        </Pressable>
    )
}


export default BlueButton;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#59B9FF',
        borderRadius: 10,
        paddingVertical: 3,
        paddingHorizontal: 5,
    },
    text: {
        color: 'white',
        ...textStyle.allTextBold,
        textAlign: 'center',
        fontSize: 18,
    }
})