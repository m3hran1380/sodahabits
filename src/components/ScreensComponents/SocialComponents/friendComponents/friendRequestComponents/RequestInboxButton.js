import { StyleSheet, Pressable, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons/';
import { colors } from '../../../../../styles/generalStyle';
import { useSelector } from 'react-redux';


const RequestInboxButton = ({handlePress, style}) => {
    const {incomingRequests} = useSelector(state => state.friends);

    return (
        <Pressable style={style} onPress={handlePress}>
            {({ pressed }) => (
                <>
                    <View style={styles.container}>
                        <View style={[styles.innerContainer, pressed ? {bottom: 0} : {bottom: 3}]}>
                            <Ionicons name='mail-outline' size={20} />
                        </View> 
                    </View>
                    <View style={[styles.numberContainer, pressed ? {top: -5} : {top: -8}]}>
                        <Text style={styles.number}>{incomingRequests.length}</Text>
                    </View>
                </>
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
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
        backgroundColor: 'white',
    },
    numberContainer: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: colors.colorRejet,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        right: -5,
    },
    number: {
        color: 'white'
    },
})