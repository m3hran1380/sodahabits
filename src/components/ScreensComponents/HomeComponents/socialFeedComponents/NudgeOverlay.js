import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native'
import { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle'
import Nudge from '../../../../../assets/svgs/Icons/socialFeedIcons/nudge.svg';
import { nudgeUser } from '../../../../businessLogic/firestoreFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { setNudgeOpen } from '../../../../features/appSlice';


const NudgeOverlay = ({ userData }) => {
    
    const user = useSelector(state => state.user.currentUser);
    const {nudgeOpen} = useSelector(state => state.app);

    const dispatch = useDispatch();
    const [nudgeMessage, setNudgeMessage] = useState(null);

    const handleInput = (userInput) => {
        setNudgeMessage(userInput);
    }

    const handleNudge = async () => {
        dispatch(setNudgeOpen(null));
        const nudgeText = nudgeMessage ? nudgeMessage : `Complete your habit: '${nudgeOpen.habitData.name}'`;
        await nudgeUser(user.uid, userData.id, nudgeText, nudgeOpen.habitData.name, nudgeMessage ? false : true);
        setNudgeMessage(null);
    }

    return (
        <Pressable style={styles.container}>
            <Text style={styles.text}>send a nudge message</Text>
            <TextInput 
                multiline={true}
                placeholder='Enter message'
                placeholderTextColor={'#838383'}
                value={nudgeMessage}
                style={styles.textInput}
                onChangeText={handleInput}
            />
            <View style={styles.nudgeContainer}>
                <Pressable onPress={handleNudge} style={styles.nudge}>
                    <Nudge width='100%' height='100%' />
                </Pressable>
            </View>
        </Pressable>
    )
}

export default NudgeOverlay

const styles = StyleSheet.create({
    container: {
        width: availableScreenWidth2 * 0.7,
        minHeight: availableScreenWidth2 * 0.3,
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
        backgroundColor: 'rgba(34,55,80,0.95)',
        position: 'absolute',
        justifyContent: 'space-around',
    },
    text: {
        ...textStyle.allText,
        color: 'white',
        textAlign: 'center',
        marginVertical: 2,
    },
    textInput: {
        backgroundColor: '#383838',
        color: 'white',
        paddingHorizontal: '3%', 
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        padding: 2,
    },
    nudge: {
        width: availableScreenWidth2 * 0.7 * 0.15,
        height: availableScreenWidth2 * 0.7 * 0.06405,
    },
    nudgeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
    }
})