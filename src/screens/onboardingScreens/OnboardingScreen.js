import { StyleSheet, Text, View, Keyboard } from 'react-native'
import AnimatedTextInput from '../../components/onboardingComponents/AnimatedTextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import generalStyles from '../../styles/generalStyle';
import NextButton from '../../components/buttons/NextButton';
import { useState } from 'react';
import { db } from '../../firestore/firestoreConfig';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinnerOverlay from '../../components/loadingSpinners/LoadingSpinnerOverlay';
import { setUser } from '../../features/userSlice';
import { createHabits } from '../../firestore/firestoreFunctions';


const OnboardingScreen = () => {

  const [firstHabit, setFirstHabit] = useState('');
  const [secondHabit, setSecondHabit] = useState('');
  const [thirdHabit, setThirdHabit] = useState('');
  const [firstError, setFirstError] = useState(false);
  const [secondError, setSecondError] = useState(false);
  const [thirdError, setThirdError] = useState(false);

  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await createHabits(user.uid, [firstHabit, secondHabit, thirdHabit])

      // update the userDoc to tick off onboarding
      await updateDoc(doc(db, 'users', user.uid), {
        onboarding: true,
      });
      dispatch(setUser({onboarding: true}));
    }
    catch (error) {
      setLoading(false);
      console.log(error)
    }
  }

  return (
    <>
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

      { loading && <LoadingSpinnerOverlay/> }
    </>
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