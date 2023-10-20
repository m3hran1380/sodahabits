import { StyleSheet, Text, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { actualScreenWidth } from '../../styles/generalStyle';

const InviteButton = ({title}) => {
    return (
        <Pressable>
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
        width: actualScreenWidth * 0.30,
        borderRadius: 5,
        backgroundColor: 'black',
    },
    innerContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        backgroundColor: 'white',
    },
})