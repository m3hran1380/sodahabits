import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/mainScreens/HomeScreen';
import SocialScreenNavigator from '../screens/mainScreens/SocialScreen/SocialScreenNavigator';
import VendingMachineScreen from '../screens/mainScreens/VendingMachineScreen';
import LocationScreen from '../screens/mainScreens/LocationScreen';
import TabBarButton from '../components/navigationComponents/TabBarButton';
import React, { useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';
import { initialiseApp } from '../businessLogic/initialisationFunctions';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../features/userSlice';


const barStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    elevation: 0,
    borderTopWidth: 0,
    position: 'absolute',
    paddingBottom: 10,
}

const Tab = createBottomTabNavigator();


const AuthenticatedNavigation = () => {
    const [appState, setAppState] = useState(AppState.currentState);
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



    return (
        <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {...barStyle}, tabBarHideOnKeyboard: true}}>
            <Tab.Screen name='social' component={SocialScreenNavigator} 
                options={{
                    tabBarButton: (props) => <TabBarButton screen='social' {...props} />
                }}
            />
            <Tab.Screen name='home' component={HomeScreen} 
                options={{
                    tabBarButton: (props) => <TabBarButton screen='home' {...props} />
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
    )
}

export default AuthenticatedNavigation