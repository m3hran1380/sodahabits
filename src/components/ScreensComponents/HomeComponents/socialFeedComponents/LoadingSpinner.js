import { StyleSheet, View } from 'react-native'
import LottieView from 'lottie-react-native';


const LoadingSpinner = () => {
    return (
        <View style={styles.container}>

            <LottieView 
                source={require('../../../../../assets/lottie/spinners/canSpinner.json')}
                loop={true}
                autoPlay={true}
            />
        </View>
    )
}

export default LoadingSpinner

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
    }
})