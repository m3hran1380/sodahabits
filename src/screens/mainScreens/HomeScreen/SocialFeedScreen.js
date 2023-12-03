import { StyleSheet, View } from 'react-native'
import { actualScreenHeight, colors } from '../../../styles/generalStyle'
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, runOnJS, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import ArrowDownIcon from '../../../../assets/svgs/Icons/screenTransitionIcons/downArrow.svg';
import { useSelector } from 'react-redux';
import SocialFeedPosts from '../../../components/sharedComponents/SocialFeedPosts';


const SocialFeedScreen = ({ navigation }) => {
    const {friendsList} = useSelector(state => state.friends);
    const startingPosition = useSharedValue(0);
    const positionMovement = useSharedValue(0);

    const swipeDownGesture = Gesture.Pan()
        .onStart((event) => {
            if (event.absoluteY > actualScreenHeight * 0.2) startingPosition.value = actualScreenHeight;
            else startingPosition.value = event.absoluteY;
        }) 
        .onChange((event) => {
            positionMovement.value = (event.absoluteY - startingPosition.value) <= 0 ? 0 : (event.absoluteY - startingPosition.value);
        })
        .onEnd((event)=>{
            const distancePulled = event.absoluteY - startingPosition.value;
            if (distancePulled > actualScreenHeight * 0.2) runOnJS(navigation.navigate)('home screen');
            else positionMovement.value = withTiming(0);
        })

    const animatedArrowStyle = useAnimatedStyle(() => {
        const positionChange = interpolate(positionMovement.value,
                [0, actualScreenHeight * 0.2],
                [0, 50],
                {extrapolateRight: Extrapolation.CLAMP}
            )
        return {
            transform: [
                {translateY: positionChange}
            ]
        }
    })

    return (
        <View style={styles.container}>
            <GestureDetector gesture={swipeDownGesture}>
                <Animated.View style={[styles.arrowContainer, animatedArrowStyle]}>
                    <ArrowDownIcon />
                </Animated.View>  
            </GestureDetector>
            <SocialFeedPosts userIds={friendsList.map(user => user.id)} />
        </View>
    )
}

export default SocialFeedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary,
        paddingBottom: 60,
    },
    arrowContainer: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 90,
        paddingTop: 15,
    },
})