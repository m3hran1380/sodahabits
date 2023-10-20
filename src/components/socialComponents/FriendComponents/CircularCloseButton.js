import { StyleSheet, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons/';
import { colors } from '../../../styles/generalStyle';
import { Pressable } from 'react-native';


const CircularCloseButton = ({ style, handlePress }) => {
    return (
        <Pressable onPress={handlePress} style={[styles.container, style]}>
            {({pressed}) => (
                <AntDesign name='close' size={30} style={pressed && {color: 'white'}}/>
            )}
        </Pressable>
    )
}

export default CircularCloseButton

const styles = StyleSheet.create({
    container: {
        height: 50,
        width: 50,
        borderRadius: 15,
        backgroundColor: colors.backgroundColorQuarternary,
        justifyContent: 'center',
        alignItems: 'center'
    }
})