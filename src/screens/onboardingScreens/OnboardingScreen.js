import { StyleSheet, Text, View, Keyboard } from 'react-native'
import AnimatedTextInput from '../../components/onboardingComponents/AnimatedTextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import generalStyles from '../../styles/generalStyle';
import NextButton from '../../components/buttons/NextButton';
import { useState } from 'react';
import { db } from '../../firestore/firestoreConfig';
import { doc, writeBatch, collection } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../features/userSlice';
import { createHabits, getTodaysHabits } from '../../businessLogic/firestoreFunctions';
import { setAppLoading } from '../../features/appSlice';
import DismissKeyboard from '../../components/DismissKeyboard';
import { getMonday, getTodayIndex } from '../../businessLogic/firestoreFunctions';


const OnboardingScreen = () => {
    const [firstHabit, setFirstHabit] = useState('');
    const [secondHabit, setSecondHabit] = useState('');
    const [thirdHabit, setThirdHabit] = useState('');
    const [firstError, setFirstError] = useState(false);
    const [secondError, setSecondError] = useState(false);
    const [thirdError, setThirdError] = useState(false);

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);

    const handlePress = () => {
        Keyboard.dismiss();
        if (!firstHabit) {
            setFirstError(true);
        }
        if (!secondHabit) {
            setSecondError(true);
        }
        if (!thirdHabit) {
            setThirdError(true);
        }
        
        if (firstHabit && secondHabit && thirdHabit) {
            registerHabits();
        }
    }

    const registerHabits = async () => {    
        try {
            dispatch(setAppLoading(true));
            // create the habits and retrieve them from firestore
            await createHabits(user.uid, [firstHabit, secondHabit, thirdHabit])
            const todayHabits = await getTodaysHabits(user.uid);
            dispatch(setUser({todayHabits: todayHabits.habits}))

            // this list is going to have only one element for now as the user just signed up
            const weeklyTrackerList = [];
            
            // update the userDoc to tick off onboarding + create the WeeklyTracker
            try {
                // create weekly tracker document
                const currentWeekTracker = {
                    timestamp: getMonday(new Date()),
                    habitStatus: Array(7).fill(0).map(() => {return {primaryStatus: Array(3).fill('pending'), secondaryStatus: Array(3).fill('pending') }}),
                }


                // set the days prior to the registration day to null.
                const todayIndex = getTodayIndex();
                for (let i=0; i<todayIndex; i++) {
                    currentWeekTracker.habitStatus[i] = {
                        primaryStatus: Array(3).fill(null),
                        secondaryStatus: Array(3).fill(null),
                    }
                }

                // create weeklytrack document and update the user's onboarding status as a batch operation
                const batch = writeBatch(db);
                const weeklyTrackerDocRef = doc(collection(db, 'users', user.uid, 'weeklytrackers'));

                batch.set(weeklyTrackerDocRef, currentWeekTracker);
                // set onboarding to true
                batch.update(doc(db, 'users', user.uid), {
                    onboarding: true,
                });
                await batch.commit();

                // convert the timestamp to ISOSTRING timestamps so they can be stored in redux store;
                currentWeekTracker.timestamp = currentWeekTracker.timestamp.toISOString();
                currentWeekTracker.id = weeklyTrackerDocRef.id;
                weeklyTrackerList.push(currentWeekTracker);
            }
            catch (error) {
                console.log('Error while creating weekly tracker in onboarding');
                console.log(error);
            }
        
            dispatch(setUser({onboarding: true, weeklyTrackers: weeklyTrackerList}));
            dispatch(setAppLoading(false));
        }
        catch (error) {
            dispatch(setAppLoading(false));
            console.log(error)
        }
    }

    return (
        <DismissKeyboard>
            <SafeAreaView style={styles.container}>
                <View style={styles.innerContainer}>
                    <Text style={[styles.normalText, {textAlign: 'left', marginBottom: 15}]}>Enter your primary habits</Text>
                    <AnimatedTextInput 
                        placeholder='Enter a habit'
                        inputValue={firstHabit}
                        setValue={setFirstHabit} 
                        setError={setFirstError} 
                        style={firstError && {borderColor: 'red', color: 'red'}} 
                    />
                    <AnimatedTextInput 
                        placeholder='Enter a habit'
                        inputValue={secondHabit}
                        setValue={setSecondHabit}
                        setError={setSecondError} 
                        style={secondError && {borderColor: 'red', color: 'red'}} 
                    />
                    <AnimatedTextInput 
                        placeholder='Enter a habit'
                        inputValue={thirdHabit}
                        setValue={setThirdHabit}
                        setError={setThirdError} 
                        style={thirdError && {borderColor: 'red', color: 'red'}} 
                    />
                </View>
                <NextButton style={styles.button} onPress={handlePress} />
            </SafeAreaView>
        </DismissKeyboard>
    )
}

export default OnboardingScreen;

const styles = StyleSheet.create({
    ...generalStyles,
    innerContainer: {
      flex: 1,
    },
    button: {
      alignSelf: 'flex-end',
    }
});