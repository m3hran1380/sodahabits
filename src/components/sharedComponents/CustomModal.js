import { StyleSheet } from 'react-native';
import { actualScreenHeight, availableScreenWidth, colors } from '../../styles/generalStyle';
import CircularCloseButton from './CircularCloseButton';
import Animated from 'react-native-reanimated';


const CustomModal = ({ closeModal, style, status, children }) => {
    return (
        <Animated.View pointerEvents={status ? 'auto' : 'none'} style={[styles.container, style]}>
            {children}
            <CircularCloseButton handlePress={closeModal} style={styles.closeBtn}/>
        </Animated.View>
    ) 
}

export default CustomModal

const styles = StyleSheet.create({
    container: {
        height: 0.6 * actualScreenHeight,
        width: availableScreenWidth,
        borderRadius: 10,
        position: 'absolute',
        backgroundColor: colors.backgroundColorTertiary,  
        top: (actualScreenHeight/2) - 0.3 * actualScreenHeight,      
        alignSelf: 'center',
        paddingBottom: 130,
    },
    closeBtn: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        marginBottom: 10,
    },
})