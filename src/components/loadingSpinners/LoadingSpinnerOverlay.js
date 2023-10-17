import { StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';


const LoadingSpinnerOverlay = ({ label }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{label}</Text>
            <LottieView
                autoPlay
                loop
                source={require('../../../assets/lottie/spinners/spinner.json')}
                style={{width: 100, height: 100}}
            />
        </View>
    )
}

export default LoadingSpinnerOverlay

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: 'white',
        marginBottom: 10,
    }
})