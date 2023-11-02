import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';

const InviteButton = ({title, handlePress, style}) => {
    return (
        <Pressable style={style} onPress={handlePress}>
            {({ pressed }) => (
                <View style={styles.container}>
                    <View style={[styles.innerContainer, pressed ? {bottom: 0} : {bottom: 3}]}>
                        <Ionicons name='person-add-outline' size={15} />
                        <Text>{title}</Text>
                    </View> 
                </View>
            )}
        </Pressable>
    )
}

export default InviteButton

const styles = StyleSheet.create({
    container: {
        width: 130,
        height: 40,
        borderRadius: 10,
        backgroundColor: 'black',
    },
    innerContainer: {
        height: 40,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: 'white',
    },
})