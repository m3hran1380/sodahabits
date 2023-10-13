import { StyleSheet, Text, View, Keyboard } from 'react-native'
import AnimatedTextInput from '../../components/onboardingComponents/AnimatedTextInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import generalStyles from '../../styles/generalStyle';
import NextButton from '../../components/buttons/NextButton';
import { useState } from 'react';
import { db } from '../../firestore/firestoreConfig';
import { doc, collection, addDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';

const OnboardingScreen = () => {

  const [firstHabit, setFirstHabit] = useState('');
  const [secondHabit, setSecondHabit] = useState('');
  const [thirdHabit, setThirdHabit] = useState('');
  const [firstError, setFirstError] = useState(false);
  const [secondError, setSecondError] = useState(false);
  const [thirdError, setThirdError] = useState(false);

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
      registerHabits(firstHabit, secondHabit, thirdHabit);
    }
  }

  const registerHabits = async (firstHabit, secondHabit, thirdHabit) => {
    const dailyHabitRef = collection(db, 'users', user.uid, 'dailyhabits');
    await addDoc(dailyHabitRef, {
      name: "hi",
      country: {
        0: firstHabit,
        1: secondHabit,
        2: thirdHabit
      }
    })
  }

  return (
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