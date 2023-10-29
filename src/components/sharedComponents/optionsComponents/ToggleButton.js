import { StyleSheet, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { useState } from 'react';


const ToggleButton = () => {
    const [toggled, setToggled] = useState(false);

    const toggleStyle = useAnimatedStyle(() => {
        return {
            left: withTiming(toggled ? 16 : 1, {duration: 100}),
            backgroundColor: toggled ? 'white' : 'rgba(0,0,0,0)'
        }
    })

    return (
        <Pressable onPress={() => setToggled(val => !val)} style={styles.container}>
            <Animated.View style={[styles.toggleBtn, toggleStyle]} />
        </Pressable>
    )
}

export default ToggleButton

const styles = StyleSheet.create({
    container: {
        width: 30,
        height: 15,
        borderRadius: 10, 
        borderWidth: 1.5,
        borderColor: 'white',
        justifyContent: 'center',
        overflow: 'hidden'
    },
    toggleBtn: {
        width: 10,
        height: 10,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: 'white',
        bottom: 0.1,
    }
})