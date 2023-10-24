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
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firestore/firestoreConfig";
import { getUsersById } from "../businessLogic/firestoreFunctions";
import { setFriends } from "../features/friendSlice";


const Stack = createStackNavigator();

const RootNavigation = () => {
    const dispatch = useDispatch();

    const loadingState = useSelector(state => state.app.loading);
    const userState = useSelector((state) => state.user.currentUser);

    // check for authentication status:
    useEffect(() => {
        let snapshotUnsub = () => {pass}
        const unsub = onAuthStateChanged(auth, async (user) => {
            try {
                // don't go to home page till we have retrieved the necessary data.
                {!loadingState && dispatch(setAppLoading(true))}
                if (user) {
                    const userData = await initialiseApp(user.uid);
                    // retrieve user's friends data:
                    const friendsData = await getUsersById(userData.friends ? userData.friends : []);
                    dispatch(setUser(userData));
                    dispatch(setFriends(friendsData));

                    // set up a live listener on the userprivate document:
                    snapshotUnsub = onSnapshot(doc(db, 'usersprivate', user.uid), (snapshot) => {
                        dispatch(setUser(snapshot.data()));
                    }, (error) => console.log('error in user snapshot: ', error))
                    // ---------------- end ------------------------- //
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
        return () => {
            unsub();
            snapshotUnsub();
        }
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