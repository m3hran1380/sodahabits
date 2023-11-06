import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import generalStyles, { textStyle } from '../../../../styles/generalStyle';
import FormInput from '../../../sharedComponents/FormInput';
import { useState } from 'react';
import { updateHabitName } from '../../../../businessLogic/firestoreFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../../features/userSlice';


const EditHabitOverlay = ({setEditable, setEditing, habitIndex, habitType}) => {
    const [newHabitName, setNewHabitName] = useState('');
    const [emptyHabit, setEmptyHabit] = useState(false);
    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();

    const handleInput = (userInput) => {
        setEmptyHabit(false);
        setNewHabitName(userInput);
    }

    const handleConfirmAction = async () => {
        if (!newHabitName) setEmptyHabit(true);
        else {
            await updateHabitName(user.uid, habitIndex, habitType, newHabitName).then((updatedTodayHabitDoc) => {
                delete updatedTodayHabitDoc.timestamp;
                dispatch(setUser({todayHabits: updatedTodayHabitDoc}));
                setEditable(false);
                setEditing(false);
            }).catch(error => console.log(error));
        }
    }

    return (
        <Modal transparent={true}>
            <View style={styles.container}>
                <Text style={[styles.text, generalStyles.h2, {marginBottom: '10%', textAlign: 'center'}]}>
                    Change {habitType} habit {habitIndex + 1}
                </Text>
                <FormInput
                    style={{paddingHorizontal: '3%', borderColor: emptyHabit ? 'red' : 'black'}}
                    placeholder='Enter new habit name'
                    handleInput={handleInput}
                    value={newHabitName}
                    maxLength={16}
                    centered={true}
                    inputStyle={{fontSize: 20}}
                />
                <Text style={[textStyle.allText, styles.paragraph]}>
                    Are you sure you want to do this, consistency in the same thing is important,
                     especially when it becomes difficult, this is where you grow.
                </Text>
                <Text style={[textStyle.allText, styles.paragraph]}>
                    Changing your habit will NOT alter your previous posts in the social feed.
                </Text>

                <View style={styles.buttonContainer}>
                    <Pressable onPress={handleConfirmAction} style={styles.confirmButton}>
                        {({pressed}) =>
                            <Text style={[textStyle.allText, styles.text, pressed && {color: 'black'}]}>Confirm change</Text>
                        }
                    </Pressable>   
                    <Pressable onPress={() => {setEditing(false); setEditable(false)}} style={({pressed}) => [styles.cancelButton, pressed && {backgroundColor: 'white'}]} >
                        {({pressed}) =>
                            <Text style={[textStyle.allText, styles.text, pressed && {color: 'black'}]}>Cancel</Text>
                        }
                    </Pressable>   
                </View>     
            </View>
        </Modal>
    )
}

export default EditHabitOverlay

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
    paragraph: {
        marginTop: '10%',
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
    }
})