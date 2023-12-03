import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const GroupInfoBox = ({ children, style }) => {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    )
}

export default GroupInfoBox

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
    }
})