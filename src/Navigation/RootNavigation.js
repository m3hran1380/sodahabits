import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import RegistrationScreen from "../screens/authScreens/RegistrationScreen";
import LoginScreen from "../screens/authScreens/LoginScreen";
import { setUser, clearUser } from "../features/userSlice";
import { auth } from "../firestore/firestoreConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import OnboardingScreen from "../screens/onboardingScreens/OnboardingScreen";
import { getUserData, getTodaysHabits } from "../firestore/firestoreFunctions";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import SplashScreen from "../components/loadingSpinners/SplashScreen";
import { setAppLoading } from "../features/appSlice";


const Stack = createStackNavigator();

const RootNavigation = () => {
  const dispatch = useDispatch();

  const loadingState = useSelector(state => state.app.loading);
  const userState = useSelector((state) => state.user.currentUser);

  // check for authentication status:
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        // don't go to home page till we have retrieved the necessary data.
        {!loadingState && dispatch(setAppLoading(true))}

        if (user) {
          const data = await getUserData(user.uid);
          if (data) {
            if (data.onboarding) {
              const todayHabits = await getTodaysHabits(user.uid);
              dispatch(setUser({uid: user.uid, ...data, todayHabits: todayHabits.habits}));
            }
            else {
              dispatch(setUser({uid: user.uid, ...data}));
            }
          }
          else {
            dispatch(setUser({uid: user.uid}));
          }
        }
        else {
          dispatch(clearUser())
        }
        dispatch(setAppLoading(false));
      }
      catch (error) {
        console.log("error inside root navigation", error);
      }
    });
    return unsub;
  }, [])


  if (userState === null || loadingState) {
    return (
      <SplashScreen />  
    )
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      { userState ? 
        <>
          { userState.onboarding ? 
            <Stack.Screen component={AuthenticatedNavigation} name='authenticated navigation' />
            :
            <Stack.Screen component={OnboardingScreen} name='onboarding screen' />
          }
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