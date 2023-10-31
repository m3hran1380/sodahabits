import { StyleSheet, Text, View, Pressable } from 'react-native'
import { useState } from 'react';
import ImageChangeIcon from '../../../../../assets/svgs/Icons/habitItemIcons/imageChange.svg';
import ImageRemoveIcon from '../../../../../assets/svgs/Icons/habitItemIcons/imageRemove.svg';
import { colors } from '../../../../styles/generalStyle';
import BackArrowIcon from '../../../../../assets/svgs/Icons/habitItemIcons/leftArrow.svg';
import { removeHabitImage } from '../../../../businessLogic/firestoreFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setUser } from '../../../../features/userSlice';


const CameraOptions = ({ setExtraCameraOption, habitIndex, habitType, setExtraOptionsEnabled }) => {
    const [deleting, setDeleting] = useState(false);
    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const removeImage = async () => {
        const todayHabits = JSON.parse(JSON.stringify(user.todayHabits));
        todayHabits.habits[habitType][habitIndex].imageName = null;
        todayHabits.habits[habitType][habitIndex].imageUrl = null;
        dispatch(setUser({todayHabits: todayHabits}));
        setExtraOptionsEnabled(false);
        setExtraCameraOption(false);
        await removeHabitImage(user.uid, habitIndex, habitType);
    }

    const handleImageSwap = () => {
        setExtraCameraOption(false);
        navigation.navigate('camera screen', { habitIndex: habitIndex, habitType: habitType });
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={() => {setExtraCameraOption(false)}}>
                <BackArrowIcon height={20} />
            </Pressable>
            <View style={styles.innerContainer}>
                {deleting ? 
                <>
                    <Text style={[styles.confirmation, styles.text]}>Are you sure?</Text>
                    <Pressable style={[styles.confirmation, styles.btn]}><Text style={styles.text} onPress={removeImage}>Yes</Text></Pressable>
                    <Pressable style={[styles.confirmation, styles.btn]}><Text style={styles.text} onPress={() => {setDeleting(false)}}>No</Text></Pressable>
                </>
                : 
                <>
                <Pressable onPress={() => {setDeleting(true)}} style={styles.iconContainer}>
                    <ImageRemoveIcon />
                </Pressable>
                <Pressable style={styles.iconContainer}>
                    <ImageChangeIcon onPress={handleImageSwap} />
                </Pressable>
                </>}
            </View>
        </View>
    )
}

export default CameraOptions

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    innerContainer: {
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#002F00',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    iconContainer: {
        marginHorizontal: 2, 
    },
    confirmation: {
        marginHorizontal: 3,
    },
    text: {
        color: 'white',
    },
    btn: {
        backgroundColor: colors.habitColorSuccess,
        paddingHorizontal: 3,
        borderRadius: 3,
    }
})