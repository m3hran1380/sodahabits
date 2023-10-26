import Animated, { useAnimatedStyle, withTiming, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import { StyleSheet, Pressable, View } from 'react-native';
import { useState } from 'react';


const HamburgerIcon = ({ setToggleOptions }) => {
    const active = useSharedValue(false);
    const [collapsed, setCollapsed] = useState(false);

    const handlePress = () => {
        setToggleOptions(val => !val);
        active.value = !active.value;
        setCollapsed(val => !val);
    };

    
    const topBarStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            active.value ? 1 : 0,
            [0, 1],
            [0, 45], 
            Extrapolate.CLAMP
        );
        return {
            transform: [
                { translateY: active.value ? withTiming(10) : withTiming(0) }, // Moving down to meet the middle
                { rotate: active.value ? withTiming(`${rotate}deg`) : withTiming('0deg') },
            ],
        };
    });


    const middleBarStyle = useAnimatedStyle(() => {
        return {
            opacity: active.value ? withTiming(0) : withTiming(1), // Fading out the middle bar
        };
    });
    

    const bottomBarStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            active.value ? 1 : 0,
            [0, 1],
            [0, -45], // Rotating -45 degrees to form the other half of the "X"
            Extrapolate.CLAMP
        );
        return {
            transform: [
                { translateY: active.value ? withTiming(-10) : withTiming(0) }, // Moving up to meet the middle
                { rotate: active.value ? withTiming(`${rotate}deg`) : withTiming('0deg') },
            ],
        };
    });


    return (
        <View style={styles.parentContainer}>
            <Pressable onPress={handlePress} style={styles.container}>
                <Animated.View style={[styles.hamburgerElement, topBarStyle, collapsed && {backgroundColor: 'grey'}]}/>
                <Animated.View style={[styles.hamburgerElement, middleBarStyle, collapsed && {backgroundColor: 'grey'}]}/>
                <Animated.View style={[styles.hamburgerElement, bottomBarStyle, collapsed && {backgroundColor: 'grey'}]}/>
            </Pressable>
        </View>
    )
}

export default HamburgerIcon

const styles = StyleSheet.create({
    container: {
        height: 30,
        justifyContent: 'space-around',
        marginLeft: 10,
    },
    hamburgerElement: {
        backgroundColor: 'white',
        height: 4,
        width: 35,
        borderRadius: 2,
    },
    parentContainer: {
        zIndex: 2000,
        position: 'absolute',
        height: 50,
        justifyContent: 'center',
    }
})