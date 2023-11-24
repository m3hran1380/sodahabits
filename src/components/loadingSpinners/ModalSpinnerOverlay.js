import { StyleSheet, Modal, View } from 'react-native'
import LottieView from 'lottie-react-native';

const ModalSpinnerOverlay = () => {
    return (
        <Modal transparent={true}>
            <View style={styles.container}>
                <LottieView
                    autoPlay
                    loop
                    source={require('../../../assets/lottie/spinners/spinner3.json')}
                    style={{width: 100, height: 100}}
                />
            </View>
        </Modal>
    )
}

export default ModalSpinnerOverlay

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
})