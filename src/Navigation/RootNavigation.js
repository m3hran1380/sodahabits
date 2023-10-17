import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import RegistrationScreen from "../screens/authScreens/RegistrationScreen";
import LoginScreen from "../screens/authScreens/LoginScreen";
import { clearUser, setUser } from "../features/userSlice";
import { auth } from "../firestore/firestoreConfig";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import OnboardingScreen from "../screens/onboardingScreens/OnboardingScreen";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import SplashScreen from "../components/loadingSpinners/SplashScreen";
import { setAppLoading } from "../features/appSlice";
import { initialiseApp } from "../businessLogic/initialisationFunctions";


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
          const userData = await initialiseApp(user.uid);
          dispatch(setUser(userData));
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