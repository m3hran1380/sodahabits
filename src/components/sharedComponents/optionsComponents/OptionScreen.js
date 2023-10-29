import { StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native';
import { useRef, useEffect, useState } from 'react';
import Animated, {FadeOut} from 'react-native-reanimated';
import { calculateAdjustedDimensions } from '../../../businessLogic/utilityFunctions';
import OptionScreenOptions from './OptionScreenOptions';
import AccountInfoScreen from './specificOptionsScreens/AccountInfoScreen';
import NotificationScreen from './specificOptionsScreens/NotificationScreen';
import BillingSubscriptionScreen from './specificOptionsScreens/BillingSubscriptionScreen';
import FAQScreen from './specificOptionsScreens/FAQScreen';
import FeedbackScreen from './specificOptionsScreens/FeedbackScreen';




// dimensions of the menu can lottie file
let [adjustedWidth, adjustedHeight] = calculateAdjustedDimensions(961, 1925);
adjustedWidth *= 0.8
adjustedHeight *= 0.8


const OptionScreen = ({ specificOptionSelected, setSpecificOptionSelected, setLoggingOut }) => {
    const animationRef = useRef();
    const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
    
    useEffect(() => {
        if (specificOptionSelected) {
            animationRef.current.play(15,30);
        }
        else {
            animationRef.current.play(0,14);
        }
    }, [specificOptionSelected]);


    const optionScreens = [<AccountInfoScreen />, <NotificationScreen />, <BillingSubscriptionScreen />, <FAQScreen />, <FeedbackScreen />];


    return (
        <Animated.View exiting={FadeOut.duration(500)} style={styles.container}>
            <LottieView
                autoPlay={false}
                loop={false}
                source={require('../../../../assets/lottie/menu/optionCanNoFade.json')}
                ref={animationRef}
                style={styles.lottie}
            />
            {specificOptionSelected ?

                <View style={styles.optionScreenContainer}>
                    {optionScreens[selectedScreenIndex]}
                </View>
                
                :
                <OptionScreenOptions 
                    setSpecificOptionSelected={setSpecificOptionSelected}
                    adjustedWidth={adjustedWidth} 
                    adjustedHeight={adjustedHeight} 
                    setLoggingOut={setLoggingOut}
                    setSelectedScreenIndex={setSelectedScreenIndex}   
                />
            }
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
    },
    optionScreenContainer: {
        position: 'absolute',
        width: adjustedWidth,
        height: adjustedHeight,
    }
})