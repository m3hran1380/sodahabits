import { StyleSheet, Text, View } from 'react-native';
import generalStyles, { availableScreenWidth } from '../../../../styles/generalStyle';
import { colors } from '../../../../styles/generalStyle';
import HabitTrackerDot from './HabitTrackerDot';
import { useSelector, useDispatch } from 'react-redux';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence, withDelay, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons/';
import { MaterialCommunityIcons } from '@expo/vector-icons/';
import { getTodayIndex, updateHabitStatus } from '../../../../businessLogic/firestoreFunctions';
import { setUser } from '../../../../features/userSlice';


const HabitItem = ({ habitName, habitIndex, primary, habitStatus }) => {
    
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);

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
                {translateX:  -availableScreenWidth + btnOffset.value}
            ]
        }
    });

    const rejectBtnStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {translateX: availableScreenWidth + btnOffset.value}
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
                dispatch(setUser({weeklyTrackers: currentWeeklyTrackerList, todayHabits: todayHabitsCopy}));
            })
    }

    const panGesture = Gesture.Pan()
        .onChange((event) => {
            btnOffset.value += event.changeX;
            btnOffset.value = btnOffset.value > availableScreenWidth ? availableScreenWidth : btnOffset.value;
            btnOffset.value = btnOffset.value < -availableScreenWidth ? -availableScreenWidth : btnOffset.value;
        })
        .onEnd(() => {
            if (btnOffset.value > (availableScreenWidth / 2)) {
                btnOffset.value = withSequence(withTiming(availableScreenWidth), withDelay(100, withTiming(0, {duration: 0})));
                runOnJS(handleSwipe)('right');
            }
            else if (btnOffset.value < -(availableScreenWidth / 2)) {
                btnOffset.value = withSequence(withTiming(-availableScreenWidth), withDelay(100, withTiming(0, {duration: 0})));
                runOnJS(handleSwipe)('left');
            }
            else {
                btnOffset.value = withTiming(0);
            }
        })

    
    return (
        <GestureDetector gesture={panGesture}>
            <View style={[styles.container, {backgroundColor: habitStatus === 'complete' ? colors.habitColorSuccess : colors.habitColorPrimary}]}>
                <Animated.View style={[styles.completeBtn, completeBtnStyle]}>
                    <AntDesign name='check' size={30} style={{color: 'white'}} />
                </Animated.View>

                <View style={styles.innerContainer}>
                    <Text style={[generalStyles.normalText, {color: 'white', textAlign: 'left'}]}>{habitName}</Text>
                    <View style={styles.trackerDotsContainer}>
                    {
                        currentHabitWeeklyStatus.map((dayStatus, index) => {
                            return <HabitTrackerDot status={dayStatus} key={index} />
                        })
                    }
                    </View>
                </View> 
    
                <Animated.View style={[styles.rejectBtn, rejectBtnStyle]}>
                    <MaterialCommunityIcons name='undo-variant' size={30} style={{color: 'white'}} />
                </Animated.View>
            </View>
        </GestureDetector>

    )
}

export default HabitItem

const styles = StyleSheet.create({
  container: {
      borderRadius: 10,
      height: 45,
      paddingHorizontal: 15,
      marginVertical: 5,
      justifyContent: 'center',
      overflow: 'hidden'
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackerDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completeBtn: {
    backgroundColor: colors.colorComplete,
    height: 45,
    width: availableScreenWidth,
    position: 'absolute',
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    pointEvents: 'none',
    // transform: [{translateX: availableScreenWidth}]
  },
  rejectBtn: {
    backgroundColor: colors.colorRejet,
    height: 45,
    width: availableScreenWidth,
    position: 'absolute',
    zIndex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
    pointEvents: 'none',
    // transform: [{translateX: -availableScreenWidth}]
  } 
})