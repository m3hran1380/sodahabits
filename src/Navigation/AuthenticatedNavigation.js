import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/mainScreens/HomeScreen';
import SocialScreen from '../screens/mainScreens/SocialScreen';
import VendingMachineScreen from '../screens/mainScreens/VendingMachineScreen';
import LocationScreen from '../screens/mainScreens/LocationScreen';
import TabBarButton from '../components/navigationComponents/TabBarButton';
import React, { useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';


const Tab = createBottomTabNavigator();

const AuthenticatedNavigation = () => {

    const barStyle = {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        elevation: 0,
        borderTopWidth: 0,
        position: 'absolute',
        paddingBottom: 10,
    }

    const [appState, setAppState] = useState(AppState.currentState);

    // this senction involves the timers that are set out to perform actions in specific times
    const executeAtMidnight = () => {
        console.log('It is now midnight!');
        // Perform your actions here
    };    
    const setMidnightTimer = useCallback(() => {
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 46, 0);
        const msUntilMidnight = midnight.getTime() - now.getTime();
    
        // Set a new timer
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
            console.log('App has come to the foreground!');
            timerId = setMidnightTimer(); // set a new timer when app comes to the foreground
          } else if (
            appState === 'active' &&
            nextAppState.match(/inactive|background/)
          ) {
            console.log('App is going to the background!');
            clearTimeout(timerId); // clear the existing timer when app goes to the background
          }
    
          // Update the app state
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
        <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {...barStyle}}}>
            <Tab.Screen name='home' component={HomeScreen} 
                options={{
                    tabBarButton: (props) => <TabBarButton screen='home' {...props} />
                }}
            />
            <Tab.Screen name='social' component={SocialScreen} 
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
    )
}

export default AuthenticatedNavigation