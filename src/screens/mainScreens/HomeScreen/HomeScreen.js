import { StyleSheet, View } from 'react-native'
import generalStyles, { colors, actualScreenHeight } from '../../../styles/generalStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { actualScreenWidth } from '../../../styles/generalStyle';
import { useSelector } from 'react-redux';
import HabitItem from '../../../components/ScreensComponents/HomeComponents/habitComponents/HabitItem';
import DaysLabel from '../../../components/ScreensComponents/HomeComponents/habitComponents/DaysLabel';
import LottieView from 'lottie-react-native';
import { calculateAdjustedDimensions } from '../../../businessLogic/utilityFunctions';
import ArrowUpIcon from '../../../../assets/svgs/Icons/screenTransitionIcons/upArrow.svg';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, Extrapolation, withTiming, withDelay, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


const [lottieWidth, lottieHeight] = calculateAdjustedDimensions(1804, 1787);


const HomeScreen = ({ navigation }) => {
    const user = useSelector((state) => state.user.currentUser);
    const startingPosition = useSharedValue(0);
    const positionMovement = useSharedValue(0);

    const swipeUpGesture = Gesture.Pan()
        .onStart((event) => {
            if (event.absoluteY < (actualScreenHeight - (actualScreenHeight * 0.2))) startingPosition.value = 0;
            else startingPosition.value = event.absoluteY;
        }) 
        .onChange((event) => {
            positionMovement.value = (startingPosition.value - event.absoluteY) <= 0 ? 0 : (startingPosition.value - event.absoluteY);
        })
        .onEnd((event)=>{
            const distancePulled = startingPosition.value - event.absoluteY;
            if (distancePulled > actualScreenHeight * 0.2) {
                runOnJS(navigation.navigate)('social feed screen');
                positionMovement.value = withDelay(400, withTiming(0, {duration: 0}));
            }
            else positionMovement.value = withTiming(0);
        })

    const animatedArrowStyle = useAnimatedStyle(() => {
        const positionChange = interpolate(positionMovement.value,
                [0, actualScreenHeight * 0.2],
                [0, -50],
                {extrapolateRight: Extrapolation.CLAMP}
            )
        return {
            transform: [
                {translateY: positionChange}
            ]
        }
    })

    return (
        <GestureDetector gesture={swipeUpGesture}>
            <View style={styles.parentContainer}>
                <View style={styles.locationBackgroundContainer}>
                    <LottieView 
                        source={require('../../../../assets/lottie/properties/favelapropertyOptimisedLottie.json')}
                        width={lottieWidth}
                        height={lottieHeight}
                        loop={true}
                        autoPlay={true}
                    />
                    <LinearGradient 
                        start={{x:0, y:0.9}} 
                        end={{x:0, y:0}} 
                        colors={[colors.backgroundColorPrimary, 'transparent']} 
                        style={styles.fade} 
                    />
                </View>
                <View style={[styles.containerNoMargin, {paddingTop: 0}]}>
                    <DaysLabel />
                    {
                        // render the primary habits
                        Object.keys(user.todayHabits.habits.primary).map(key => {
                            return ({
                                habitName: user.todayHabits.habits.primary[key].name,
                                habitStatus: user.todayHabits.habits.primary[key].status,
                                habitNotes: user.todayHabits.habits.primary[key].notes,
                                habitImageUrl: user.todayHabits.habits.primary[key].imageUrl,
                            })
                        }).map((habitData, index) => {
                            return (
                                <HabitItem 
                                    key={index} 
                                    habitIndex={index} 
                                    habitData={habitData}
                                    primary={true} 
                                />
                            )
                        })
                    }
                </View>
                <Animated.View style={[styles.arrowContainer, animatedArrowStyle]}>
                    <ArrowUpIcon />
                </Animated.View>    
            </View>
        </GestureDetector>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    ...generalStyles,
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary
    },
    locationBackground: {
        width: actualScreenWidth,
        height: '100%',
    },
    locationBackgroundContainer: {
        height: '45%',
        overflow: 'hidden'
    },
    fade: {
        bottom: 0,
        height: 100,
        width: actualScreenWidth,
        position: 'absolute',
        zIndex: 2,
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        bottom: 50,
    }
})