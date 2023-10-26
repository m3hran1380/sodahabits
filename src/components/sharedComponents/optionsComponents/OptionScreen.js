import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';
import Animated, { withTiming, useSharedValue, runOnJS, useAnimatedStyle, Easing } from 'react-native-reanimated';
import { calculateAdjustedDimensions } from '../../../businessLogic/utilityFunctions';
import OptionScreenOptions from './OptionScreenOptions';

// dimensions of the menu can lottie file
let [adjustedWidth, adjustedHeight] = calculateAdjustedDimensions(961, 1925);
adjustedWidth *= 0.8
adjustedHeight *= 0.8


const OptionScreen = ({ toggleOptions, setShowOptions }) => {
    const animationRef = useRef();
    const opacity = useSharedValue(1);
    
    useEffect(() => {
        animationRef.current.play(0,14);
    }, []);

    
    useEffect(() => {
        if (!toggleOptions) {
            opacity.value = withTiming(0, {
                duration: 500,
                easing: Easing.ease,
              }, (isFinished) => {
                if (isFinished) {
                    runOnJS(setShowOptions)(false);
                }
              })
        }   
    }, [toggleOptions])


    const optionsStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        }
    })

    return (
        <Animated.View style={[styles.container, optionsStyle]}>
            <LottieView
                autoPlay={false}
                loop={false}
                source={require('../../../../assets/lottie/menu/optionCan.json')}
                ref={animationRef}
                style={styles.lottie}
            />
            <OptionScreenOptions adjustedWidth={adjustedWidth} adjustedHeight={adjustedHeight} />
        </Animated.View>
    )
}

export default OptionScreen;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    lottie: {
        width: adjustedWidth,
        height: adjustedHeight,
    }
})