import { StyleSheet, Text, View, Modal, Pressable, TextInput } from 'react-native';
import generalStyles, { textStyle } from '../../../../styles/generalStyle';
import { useState } from 'react';
import { addNotesToHabit } from '../../../../businessLogic/firestoreFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../../features/userSlice';


const HabitNotesOverlay = ({ setShowHabitNotesOverlay, habitIndex, habitType }) => {
    const user = useSelector(state => state.user.currentUser);
    const [note, setNote] = useState(user.todayHabits.habits[habitType][habitIndex].notes);

    const dispatch = useDispatch();

    const handleInput = (userInput) => {
        setNote(userInput);
    }

    const addNote = async () => {
        await addNotesToHabit(user.uid, habitIndex, habitType, note);
        const todayHabitDoc = JSON.parse(JSON.stringify(user.todayHabits));
        todayHabitDoc.habits[habitType][habitIndex].notes = note;
        dispatch(setUser({ todayHabits: todayHabitDoc }));
        setShowHabitNotesOverlay(false);
    }

    return (
        <Modal transparent={true}>
            <View style={styles.container}>
                <Text style={[styles.text, generalStyles.h2, {marginBottom: '10%', textAlign: 'center'}]}>
                    {user.todayHabits.habits[habitType][habitIndex].notes ? 'Change' : `Add note for '${user.todayHabits.habits[habitType][habitIndex].name}'`}
                </Text>
                
                <View style={styles.textInputContainer}>
                    <TextInput 
                        multiline={true}
                        style={styles.textInput} 
                        placeholder='Add your notes'
                        placeholderTextColor={'#838383'}
                        value={note}
                        onChangeText={handleInput}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <Pressable onPress={addNote} style={styles.confirmButton}>
                        {({pressed}) =>
                            <Text style={[textStyle.allText, styles.text, pressed && {color: 'black'}]}>
                                {user.todayHabits.habits[habitType][habitIndex].notes ? 'Change' : 'Add note'}
                            </Text>
                        }
                    </Pressable>   
                    <Pressable onPress={() => {setShowHabitNotesOverlay(false)}} style={({pressed}) => [styles.cancelButton, pressed && {backgroundColor: 'white'}]}>
                        {({pressed}) =>
                            <Text style={[textStyle.allText, styles.text, pressed && {color: 'black'}]}>Cancel</Text>
                        }
                    </Pressable>   
                </View>     
            </View>
        </Modal>
    )
}

export default HabitNotesOverlay

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.9)',
        paddingTop: '20%',
        padding: '10%'
    },
    text: {
        fontSize: 17,
        color: 'white', 
        textAlign: 'center',
    },
    confirmButton: {
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 5,
        backgroundColor: '#59B9FF',
        borderWidth: 1,
        borderColor: '#59B9FF',
        marginHorizontal: 5,
    },
    cancelButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        marginHorizontal: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '10%'
    },
    textInput: {
        backgroundColor: '#383838',
        color: 'white',
        paddingHorizontal: '3%', 
        fontSize: 20,
    },
    textInputContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 8,
        minimumHeight: 40,
        backgroundColor: '#383838',
        justifyContent: 'center',
    }      
})