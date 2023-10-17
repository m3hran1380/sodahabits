import { StyleSheet, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors } from '../../styles/generalStyle';


const SplashScreen = () => {
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
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
})