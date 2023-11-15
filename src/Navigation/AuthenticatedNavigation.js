import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreenNavigator from '../screens/mainScreens/HomeScreen/HomeScreenNavigator';
import SocialScreenNavigator from '../screens/mainScreens/SocialScreen/SocialScreenNavigator';
import VendingMachineScreen from '../screens/mainScreens/VendingMachineScreen';
import LocationScreen from '../screens/mainScreens/LocationScreen';
import TabBarButton from '../components/navigationComponents/TabBarButton';
import React, { useEffect, useState, useCallback } from 'react';
import { AppState, View, Platform, PermissionsAndroid } from 'react-native';
import { initialiseApp } from '../businessLogic/initialisationFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';
import OptionScreen from '../components/sharedComponents/optionsComponents/OptionScreen';
import AppNavbar from '../components/sharedComponents/navbarComponents/AppNavbar';
import HamburgerIcon from '../components/sharedComponents/navbarComponents/HamburgerIcon';
import SplashScreen from '../components/loadingSpinners/SplashScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import { updateDeviceToken } from '../businessLogic/firestoreFunctions';



const barStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopWidth: 0,
    position: 'absolute',
    paddingBottom: 10,
    height: 50,
}

const Tab = createBottomTabNavigator();


const AuthenticatedNavigation = () => {
    const [appState, setAppState] = useState(AppState.currentState);
    // states used for the options menu
    const [showOptions, setShowOptions] = useState(false);
    const [specificOptionSelected, setSpecificOptionSelected] = useState(false);
    // state used to overlay the loading spinner on top of the page - we don't use the appwide loading state here
    // as it doesn't work nicely with the fadeout animation of the options component.
    const [loggingOut, setLoggingOut] = useState(false);
    const camera = useSelector(state => state.app.camera);

    const user = useSelector((state) => state.user.currentUser);

    const dispatch = useDispatch();

    // this section involves the timers that are set out to perform actions in specific times
    const executeAtMidnight = async () => {
        // reinitialise the app
        try {
            const updatedUserData = await initialiseApp(user.uid);
            dispatch(setUser(updatedUserData));
        }
        catch (error) {
            console.log("error at midnight", error);
        }
    };    
    const setMidnightTimer = useCallback(() => {
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1, 0, 0, 0);
        const msUntilMidnight = midnight.getTime() - now.getTime();
        return setTimeout(executeAtMidnight, msUntilMidnight);
    }, []);

    useEffect(() => {
        let timerId;
        // Set up a listener for app state changes
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (
                appState.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                timerId = setMidnightTimer(); // set a new timer when app comes to the foreground
            } else if (
                appState === 'active' &&
                nextAppState.match(/inactive|background/)
            ) {
                clearTimeout(timerId); // clear the existing timer when app goes to the background
            }

            // Update the appst ate
            setAppState(nextAppState);
        });
    
        // Set the initial timer
        timerId = setMidnightTimer();
    
        return () => {
            // Cleanup function
            subscription.remove();
            clearTimeout(timerId); // make sure to clear the timer when the component unmounts
        };
    }, [appState, setMidnightTimer]);


    const foregroundNotificationHandler = async (message) => {
        console.log("handling the notification on foreground. ", message)
    }

    const backgroundNotificationHandler = async (message) => {
        console.log("handling the notification on background. ", message)
    }


    useEffect(() => {
        (async () => {
            await messaging().registerDeviceForRemoteMessages();
            const token = await messaging().getToken();
            await updateDeviceToken(token, user.uid);
        })();
    }, []);


    return (
        <View style={{flex: 1}}>
            <Tab.Navigator 
                screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {...barStyle}, tabBarHideOnKeyboard: true}}
            >   
                <Tab.Screen name='home' component={HomeScreenNavigator} 
                    options={({ route }) => {
                        if (getFocusedRouteNameFromRoute(route) === 'camera screen') {
                            return {
                                tabBarStyle: { display: 'none' }
                            }
                        }
                        return {
                            tabBarButton: (props) => <TabBarButton screen='home' {...props} />
                        }
                    }}
                />
                <Tab.Screen name='social' component={SocialScreenNavigator} 
                    options={{
                        tabBarButton: (props) => <TabBarButton screen='social' {...props} />
                    }}
                />
                <Tab.Screen name='vending machine' component={VendingMachineScreen} 
                    options={{
                        tabBarButton: (props) => <TabBarButton screen='vending machine' {...props} />
                    }}
                />
                <Tab.Screen name='location' component={LocationScreen} 
                    options={{
                        tabBarButton: (props) => <TabBarButton screen='location' {...props} />
                    }}
                />
            </Tab.Navigator>
            
            {!camera &&
                <>
                <AppNavbar />
                <HamburgerIcon 
                    setSpecificOptionSelected={setSpecificOptionSelected} 
                    specificOptionSelected={specificOptionSelected} 
                    setShowOptions={setShowOptions} 
                />
                {showOptions && <OptionScreen 
                    specificOptionSelected={specificOptionSelected} 
                    setSpecificOptionSelected={setSpecificOptionSelected} 
                    setLoggingOut={setLoggingOut}
                />}
                </>
            }

            {loggingOut && <SplashScreen animated={true} />}
        </View>
    )
}

export default AuthenticatedNavigation