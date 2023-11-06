import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useState } from 'react';
import { textStyle } from '../../../../styles/generalStyle';
import CloseHabitIcon from '../../../../../assets/svgs/Icons/socialFeedIcons/closeHabit.svg';
import DefaultHabitImage from '../../../../../assets/svgs/defaultHabit/defaultHabitImage.svg';
import NotesIcon from '../../../../../assets/svgs/Icons/habitItemIcons/notes.svg';


const ExpandedHabitOverlay = ({ habitData, setExpandedHabit }) => {

    const [showNotes, setShowNotes] = useState(false);

    return (
        <Pressable onPress={() => setShowNotes(false)} style={styles.container}>
            <View style={styles.habitImageContainer}>
                { habitData.imageUrl ? 
                    <Image style={styles.habitImage} source={{uri: habitData.imageUrl}} />
                    :
                    <DefaultHabitImage width='100%' height='100%' />
                }
                <Pressable style={styles.notesIcon} onPress={() => setShowNotes(true)}>
                    <NotesIcon width='100%' height='100%' />
                </Pressable>
                {showNotes &&
                <View style={styles.notesOverlay}>
                    <Text style={styles.text}>{habitData.notes ? habitData.notes : 'No notes recorded against this habit.'}</Text>
                </View>}
            </View>
            <Pressable onPress={() => {setExpandedHabit(null)}}  style={styles.closeBtnContainer}><CloseHabitIcon height='100%' /></Pressable>
        </Pressable>
    )
}

export default ExpandedHabitOverlay

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeBtnContainer: {
        position: 'absolute',
        height: '8%',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        bottom: '3.5%'
    },
    habitImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    habitImageContainer: {
        width: '75%',
        height: '75%',
        position: 'absolute',
        zIndex: 100,
        top: '10%',
        left: '12.5%'
    },
    notesIcon: {
        position: 'absolute',
        bottom: '3%',
        right: '1%',
        zIndex: 100,
        width: '10%',
        height: '10%'
    },
    text: {
        ...textStyle.allText,
        color: 'white',
        textAlign: 'left',
    },
    notesOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 200,
        justifyContent: 'center',
        alignItems: 'center'
    }
})