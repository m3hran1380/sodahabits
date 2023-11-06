import { StyleSheet, Text, View, Pressable } from 'react-native';
import { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import { colors } from '../../../../styles/generalStyle';
import HabitTrackerDot from './HabitTrackerDot';
import { useSelector, useDispatch } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons/';
import { MaterialCommunityIcons } from '@expo/vector-icons/';
import { getTodayIndex, updateHabitStatus } from '../../../../businessLogic/firestoreFunctions';
import { setUser } from '../../../../features/userSlice';
import { useState } from 'react';
import CameraIcon from '../../../../../assets/svgs/Icons/habitItemIcons/camera.svg';
import CameraCheckedIcon from '../../../../../assets/svgs/Icons/habitItemIcons/cameraChecked.svg';
import NotesIcon from '../../../../../assets/svgs/Icons/habitItemIcons/notes.svg';
import NotesCheckedIcon from '../../../../../assets/svgs/Icons/habitItemIcons/notesAdded.svg';
import { useNavigation } from '@react-navigation/native';
import CameraOptions from './CameraOptions';
import * as Haptics from 'expo-haptics';
import EditHabitOverlay from './EditHabitOverlay';
import HabitNotesOveraly from './HabitNotesOverlay';


const HabitItem = ({ habitData, habitIndex, primary }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);
    // this state is for displaying the picture and note taking options.
    const [extraOptionsEnabled, setExtraOptionsEnabled] = useState(false); 
    const [extraCameraOptions, setExtraCameraOptions] = useState(false);
    // following state is activated on long press - it allows the user to edit the habit name
    const [editable, setEditable] = useState(false);
    const [editing, setEditing] = useState(false);
    // following states are for the habit notes
    const [showHabitNotesOverlay, setShowHabitNotesOverlay] = useState(false);


    const navigation = useNavigation();

    // change this later - currently it only retrieves latest tracker - this should be based on a prop so we can retrieve previous weeks as well.
    const currentTracker = user.weeklyTrackers[0].habitStatus;
    
    // retrieve the status strings for this week for this habit
    const currentHabitWeeklyStatus = primary ? 
        currentTracker.map(dayStatus => dayStatus.primaryStatus[habitIndex])
        :
        currentTracker.map(dayStatus => dayStatus.secondaryStatus[habitIndex]);


    // related to the swipe to action button
    const btnOffset = useSharedValue(0);

    const completeBtnStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: -availableScreenWidth2 + btnOffset.value}
            ]
        }
    });

    const rejectBtnStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: availableScreenWidth2 + btnOffset.value}
            ]
        }
    });

    const handleSwipe = (swipeType) => {
        const newStatus = swipeType === 'left' ? 'pending' : 'complete';
        const oldStatus = newStatus === 'pending' ? 'complete' : 'pending';

        const currentWeeklyTrackerList = JSON.parse(JSON.stringify(user.weeklyTrackers));
        const todayIndex = getTodayIndex();
        currentWeeklyTrackerList[0].habitStatus[todayIndex][`${primary ? 'primary' : 'secondary'}Status`][habitIndex] = newStatus;
        const todayHabitsCopy = JSON.parse(JSON.stringify(user.todayHabits));
        todayHabitsCopy.habits[`${primary ? 'primary' : 'secondary'}`][habitIndex].status = newStatus;
        const currentImageUrl = todayHabitsCopy.habits[`${primary ? 'primary' : 'secondary'}`][habitIndex].imageUrl;
        if (newStatus === 'pending') todayHabitsCopy.habits[`${primary ? 'primary' : 'secondary'}`][habitIndex].imageUrl = null;

        dispatch(setUser({weeklyTrackers: currentWeeklyTrackerList, todayHabits: todayHabitsCopy}));

        // update the firestore
        updateHabitStatus(user.uid, habitIndex, primary ? 'primary' : 'secondary' , newStatus)
            .catch(error => {
                console.log('Error while updating habit status ', error);
                const currentWeeklyTrackerList = JSON.parse(JSON.stringify(user.weeklyTrackers));
                currentWeeklyTrackerList[0].habitStatus[todayIndex][`${primary ? 'primary' : 'secondary'}Status`][habitIndex] = oldStatus;
                // update the todayHabits property of user state
                const todayHabitsCopy = JSON.parse(JSON.stringify(user.todayHabits));
                todayHabitsCopy.habits[`${primary ? 'primary' : 'secondary'}`][habitIndex].status = oldStatus;
                if (oldStatus === 'complete') todayHabitsCopy.habits[`${primary ? 'primary' : 'secondary'}`][habitIndex].imageUrl = currentImageUrl;
                dispatch(setUser({weeklyTrackers: currentWeeklyTrackerList, todayHabits: todayHabitsCopy}));
            })
    }

    const toggleEditState = () => {
        setEditable(val => !val);
    }

    const panGesture = Gesture.Pan()
        .onChange((event) => {
            if (extraOptionsEnabled) return;

            // if habit is completed, user shouldn't be able to swipte right to complete again
            // similarly if habit is incomplete, user shouldn't be able to swipe left to undo.
            if (habitData.habitStatus === 'complete' && (btnOffset.value + event.changeX > 0)) return;
            else if (habitData.habitStatus !== 'complete' && (btnOffset.value + event.changeX < 0)) return;

            btnOffset.value += event.changeX;
            btnOffset.value = btnOffset.value > availableScreenWidth2 ? availableScreenWidth2 : btnOffset.value;
            btnOffset.value = btnOffset.value < -availableScreenWidth2 ? -availableScreenWidth2 : btnOffset.value;
        })
        .onEnd(() => {
            if (extraOptionsEnabled) return;

            if (btnOffset.value > (availableScreenWidth2 / 2)) {
                btnOffset.value = withSequence(withTiming(availableScreenWidth2), withDelay(100, withTiming(0, {duration: 0})));
                runOnJS(handleSwipe)('right');
            }
            else if (btnOffset.value < -(availableScreenWidth2 / 2)) {
                btnOffset.value = withSequence(withTiming(-availableScreenWidth2), withDelay(100, withTiming(0, {duration: 0})));
                runOnJS(handleSwipe)('left');
            }
            else {
                btnOffset.value = withTiming(0);
            }
        })

    const longPressGesture = Gesture.LongPress()
        .onStart(() => {
            runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
            runOnJS(toggleEditState)();
    })

    // combine the pan and the longpress gestures into a composed gesture.
    const composedGesture = Gesture.Race(panGesture, longPressGesture);


    const handleHabitItemPressed = () => {
        if (editable) {
            setEditing(true);
        }
        else {
            // only display the additional options (to take picture + take notes) if the habit is complete
            if (habitData.habitStatus !== 'complete') return;
            setExtraOptionsEnabled(val => !val);
            if (extraOptionsEnabled) setExtraCameraOptions(false);
        }
    }

    
    return (
        <>
        <GestureDetector gesture={composedGesture}>
            <Pressable 
                onPress={handleHabitItemPressed}
                style={[styles.container, {backgroundColor: habitData.habitStatus === 'complete' ? colors.habitColorSuccess : colors.habitColorPrimary}]}
            >
                {editable ?
                <Text style={[textStyle.normalText, {color: 'white', textAlign: 'center'}]}>
                    Tap to edit {primary ? 'primary' : 'secondary'} habit {habitIndex + 1}
                </Text>
                :
                <>
                <Animated.View style={[styles.completeBtn, completeBtnStyle]}>
                    <AntDesign name='check' size={30} style={{color: 'white'}} />
                </Animated.View>

                <View style={styles.innerContainer}>
                    <Text style={[textStyle.normalText, {color: 'white', textAlign: 'left'}]}>{habitData.habitName}</Text>
                    <View style={styles.innerMostContainer}>
                    { !extraOptionsEnabled ?
                        currentHabitWeeklyStatus.map((dayStatus, index) => {
                            return <HabitTrackerDot status={dayStatus} key={index} />
                        })
                        :
                        <>{extraCameraOptions ? 
                            <CameraOptions 
                                habitIndex={habitIndex} 
                                habitType={primary ? 'primary' : 'secondary'} 
                                setExtraCameraOption={setExtraCameraOptions} 
                                setExtraOptionsEnabled={setExtraOptionsEnabled}
                            />
                        :
                        <>                            
                            {habitData.habitImageUrl ?
                                <Pressable style={styles.largeIconContainer} onPress={() => {setExtraCameraOptions(val => !val)}}>
                                    <CameraCheckedIcon width='100%' height='100%' />
                                </Pressable>
                                :
                                <Pressable style={styles.largeIconContainer} onPress={() => navigation.navigate('camera screen', { habitIndex: habitIndex, habitType: primary ? 'primary' : 'secondary' })}>
                                    <CameraIcon width='85%' height='85%' />
                                </Pressable>
                            }
                            <Pressable style={styles.smallIconContainer} onPress={() => setShowHabitNotesOverlay(true)}>
                                {habitData.habitNotes ? <NotesCheckedIcon width='100%' height='100%' /> : <NotesIcon width='92%' height='92%' />}
                            </Pressable>
                        </>
                        }</>
                    }
                    </View>
                </View> 
    
                <Animated.View style={[styles.rejectBtn, rejectBtnStyle]}>
                    <MaterialCommunityIcons name='undo-variant' size={30} style={{color: 'white'}} />
                </Animated.View>
                </>}
            </Pressable>
        </GestureDetector>
        {editing && <EditHabitOverlay setEditable={setEditable} setEditing={setEditing} habitIndex={habitIndex} habitType={primary ? 'primary' : 'secondary'}/>}
        {showHabitNotesOverlay && <HabitNotesOveraly setShowHabitNotesOverlay={setShowHabitNotesOverlay} habitIndex={habitIndex} habitType={primary ? 'primary' : 'secondary'}/>}
        </>
    )
}

export default HabitItem

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        height: 45,
        paddingHorizontal: 10,
        marginVertical: 5,
        justifyContent: 'center',
        overflow: 'hidden',
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    innerMostContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    completeBtn: {
        backgroundColor: colors.colorComplete,
        height: 45,
        width: availableScreenWidth2,
        position: 'absolute',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10,
        pointEvents: 'none',
    },
    rejectBtn: {
        backgroundColor: colors.colorRejet,
        height: 45,
        width: availableScreenWidth2,
        position: 'absolute',
        zIndex: 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10,
        pointEvents: 'none',
    },
    smallIconContainer: {
        width: availableScreenWidth2/10,
        paddingHorizontal: 2,
        alignItems: 'center',
        justifyContent: 'center'
    }, 
    largeIconContainer: {
        width: availableScreenWidth2/9,
        paddingHorizontal: 2,
        alignItems: 'flex-start',
        justifyContent: 'center'
    } 
})