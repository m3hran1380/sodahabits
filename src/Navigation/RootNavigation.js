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


const Stack = createStackNavigator();

const RootNavigation = () => {
    const dispatch = useDispatch();

    // check for authentication status:
    useEffect(() => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        try {
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
        }
        catch (error) {
          console.log("error inside root navigation", error);
        }
      });
      return unsub;
    }, [])

    const user = useSelector((state) => state.user.currentUser);

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            { user ? 
                <>
                  { user.onboarding ? 
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