import Animated, { useAnimatedStyle, withTiming, interpolate, Extrapolate } from 'react-native-reanimated';
import { StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

const HamburgerIcon = ({ setShowOptions, setSpecificOptionSelected, specificOptionSelected }) => {
    const [collapsed, setCollapsed] = useState(false);

    const handlePress = () => {
        if (specificOptionSelected) {
            setSpecificOptionSelected(false);
        }
        else {
            setShowOptions(val => !val);
            setCollapsed(val => !val);
        }
    };

    
    const topBarStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            !collapsed ? 0 : specificOptionSelected ? -1 : 1,
            [-1, 0, 1],
            [-45, 0, 45], 
            Extrapolate.CLAMP
        );
        const width = withTiming(specificOptionSelected ? 20 : 35);

        return {
            transform: [
                { translateY: !collapsed ? withTiming(0) : specificOptionSelected ? withTiming(4) : withTiming(10) },
                { translateX : specificOptionSelected ? withTiming(-2.5) : withTiming(0) }, 
                { rotate: collapsed ? withTiming(`${rotate}deg`) : withTiming('0deg') },
            ],
            width: width,
        };
    });


    const middleBarStyle = useAnimatedStyle(() => {
        return {
            opacity: specificOptionSelected ? withTiming(1) : !collapsed ? withTiming(1) : withTiming(0),
        };
    });
    

    const bottomBarStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            !collapsed ? 0 : specificOptionSelected ? -1 : 1,
            [-1, 0, 1],
            [45, 0, -45], // Rotating -45 degrees to form the other half of the "X"
            Extrapolate.CLAMP
        );
        const width = withTiming(specificOptionSelected ? 20 : 35);

        return {
            transform: [
                { translateY: !collapsed ? withTiming(0) : specificOptionSelected ? withTiming(-4) : withTiming(-10) }, 
                { translateX : specificOptionSelected ? withTiming(-2.5) : withTiming(0) }, 
                { rotate: collapsed ? withTiming(`${rotate}deg`) : withTiming('0deg') },
            ],
            width: width,
        };
    });

    // for the zIndex bug
    const zIndexValue = Math.floor(Math.random() * (3000 - 2000 + 1)) + 2000;

    return (
        <Animated.View style={[styles.parentContainer, {zIndex: zIndexValue}]}>
            <Pressable onPress={handlePress} style={styles.container}>
                <Animated.View style={[styles.hamburgerElement, topBarStyle, collapsed && {backgroundColor: 'grey'}]}/>
                <Animated.View style={[styles.hamburgerElement, middleBarStyle, collapsed && {backgroundColor: 'grey'}]}/>
                <Animated.View style={[styles.hamburgerElement, bottomBarStyle, collapsed && {backgroundColor: 'grey'}]}/>
            </Pressable>
        </Animated.View>
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
        position: 'absolute',
        height: 50,
        justifyContent: 'center',
    }
})