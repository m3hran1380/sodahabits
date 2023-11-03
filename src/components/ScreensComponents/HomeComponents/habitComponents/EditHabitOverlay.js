import { StyleSheet, Text, View, Modal, Pressable } from 'react-native';
import generalStyles, { textStyle } from '../../../../styles/generalStyle';
import FormInput from '../../../sharedComponents/FormInput';
import { useState } from 'react';


const EditHabitOverlay = ({setEditable, setEditing, habitIndex, habitType}) => {
    const [newHabitName, setNewHabitName] = useState('');

    const handleInput = (userInput) => {
        setNewHabitName(userInput);
    }

    return (
        <Modal transparent={true}>
            <View style={styles.container}>
                <Text style={[generalStyles.h2, styles.text, {marginBottom: '10%'}]}>
                    Change {habitType} habit {habitIndex + 1}
                </Text>
                <FormInput
                    style={{paddingHorizontal: '3%'}}
                    placeholder='enter new habit name'
                    handleInput={handleInput}
                    value={newHabitName}
                    maxLength={16}
                />
                <Text style={[textStyle.allText, styles.paragraph]}>
                    Are you sure you want to do this, consistency in the same thing is important,
                     especially when it becomes difficult, this is where you grow.
                </Text>
                <Text style={[textStyle.allText, styles.paragraph]}>
                    Changing your habit will NOT alter your previous posts in the social feed.
                </Text>

                <View style={styles.buttonContainer}>
                    <Pressable style={styles.confirmButton}>
                        {({pressed}) =>
                            <Text style={[textStyle.allText, styles.text, pressed && {color: 'black'}]}>Confirm change</Text>
                        }
                    </Pressable>   
                    <Pressable onPress={() => {setEditing(false); setEditable(false)}} style={styles.cancelButton}>
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