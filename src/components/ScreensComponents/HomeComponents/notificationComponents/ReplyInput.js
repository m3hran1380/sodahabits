import { StyleSheet, TextInput, Pressable, View } from 'react-native'
import SendButton from '../../../../../assets/svgs/Icons/notificationIcons/sendButton.svg';
import { useState } from 'react';
import { availableScreenWidth2 } from '../../../../styles/generalStyle';
import { replyToNudge } from '../../../../businessLogic/firestoreFunctions';


const ReplyInput = ({ notificationData, setReplied }) => {
    const [replyText, setReplyText] = useState('');

    const handleReply = async () => {
        setReplied(true);
        await replyToNudge(notificationData, replyText, false);
    }

    return (
        <View style={styles.replyInputContainer}>
            <TextInput 
                multiline={true}
                placeholder='Enter your reply message'
                placeholderTextColor={'#838383'}
                onChangeText={setReplyText}
                value={replyText}
                style={styles.textInput}
            />
            <Pressable onPress={handleReply} style={styles.sendButtonContainer}>
                <SendButton width='100%' height='100%' />
            </Pressable>
        </View> 
    )
}

export default ReplyInput

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        color: 'white',
    },
    replyInputContainer: {
        flexDirection: 'row',
        backgroundColor: '#383838',
        color: 'white',
        paddingHorizontal: '3%', 
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        marginHorizontal: 5,
        marginTop: 5,
        padding: 2,
        alignItems: 'center',
    },
    sendButtonContainer: {
        height: availableScreenWidth2/15,
        width: availableScreenWidth2/15,
        marginHorizontal: 3,
    }
})