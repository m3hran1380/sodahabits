import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import HomeScreen from "../screens/HomeScreen";
import RegistrationScreen from "../screens/authScreens/RegistrationScreen";
import LoginScreen from "../screens/authScreens/LoginScreen";
import { setUser, clearUser } from "../features/userSlice";
import { auth } from "../firestore/firestoreConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import OnboardingScreen from "../screens/onboardingScreens/OnboardingScreen";


const Stack = createStackNavigator();

const RootNavigation = () => {

    const dispatch = useDispatch();

    // check for authentication status:
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          dispatch(setUser({uid: user.uid}));
        }
        else {
          dispatch(clearUser())
        }
      });
      return unsub;
    }, [])

    const user = useSelector((state) => state.user.currentUser);

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            { user ? 
                <>
                  <Stack.Screen component={OnboardingScreen} name='onboarding screen' />
                  <Stack.Screen component={HomeScreen} name='home screen' />
                </>
                :
                <>
                  <Stack.Screen component={RegistrationScreen} name='registration screen' />
                  <Stack.Screen component={LoginScreen} name='login screen' />
                </>
            }
            
        </Stack.Navigator>
    )
}

export default RootNavigation