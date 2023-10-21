import { StyleSheet, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';

const RequestInboxButton = ({handlePress, style}) => {
    return (
        <Pressable style={style} onPress={handlePress}>
            {({ pressed }) => (
                <View style={styles.container}>
                    <View style={[styles.innerContainer, pressed ? {bottom: 0} : {bottom: 3}]}>
                        <Ionicons name='mail-outline' size={20} />
                    </View> 
                </View>
            )}
        </Pressable>
    )
}

export default RequestInboxButton

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: 40,
        borderRadius: 10,
        backgroundColor: 'black',
        marginLeft: 5,
    },
    innerContainer: {
        height: 40,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: 'white',
    },
})