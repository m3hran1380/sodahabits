import { StyleSheet, Text, View } from 'react-native'
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';
import Animated, {FadeOut} from 'react-native-reanimated';
import { calculateAdjustedDimensions } from '../../../businessLogic/utilityFunctions';
import OptionScreenOptions from './OptionScreenOptions';

// dimensions of the menu can lottie file
let [adjustedWidth, adjustedHeight] = calculateAdjustedDimensions(961, 1925);
adjustedWidth *= 0.8
adjustedHeight *= 0.8


const OptionScreen = ({ setSpecificOptionSelected, setLoggingOut }) => {
    const animationRef = useRef();
    
    useEffect(() => {
        animationRef.current.play(0,14);
    }, []);


    return (
        <Animated.View exiting={FadeOut.duration(500)} style={styles.container}>
            <LottieView
                autoPlay={false}
                loop={false}
                source={require('../../../../assets/lottie/menu/optionCan.json')}
                ref={animationRef}
                style={styles.lottie}
            />
            <OptionScreenOptions 
                setSpecificOptionSelected={setSpecificOptionSelected}
                adjustedWidth={adjustedWidth} 
                adjustedHeight={adjustedHeight} 
                setLoggingOut={setLoggingOut}   
            />
        </Animated.View>
    )
}

export default OptionScreen;

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    lottie: {
        width: adjustedWidth,
        height: adjustedHeight,
    }
})