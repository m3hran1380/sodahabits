import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../../styles/generalStyle';
import Animated, {FadeOut} from 'react-native-reanimated';


const SplashScreen = ({ animated }) => {
    // the animated option is only visible when logging out - this is to counteract the fadeout animation of the options menu
    // upon signing out.
    if (animated) {
        return (
            <Animated.View exiting={FadeOut} style={styles.container}>
                <LottieView
                    autoPlay
                    loop
                    source={require('../../../assets/lottie/splash/splashHamster.json')}
                    style={{width: 200, height: 200}}
                />
            </Animated.View>
        )
    }

    return (
        <View style={styles.container}>
            <LottieView
                autoPlay
                loop
                source={require('../../../assets/lottie/splash/splashHamster.json')}
                style={{width: 200, height: 200}}
            />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.backgroundColorPrimary,
        zIndex: 10000,
        justifyContent: 'center',
        alignItems: 'center',
    },
})