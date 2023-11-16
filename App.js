import { useCallback } from 'react';
import { View, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/ReduxStore';
import { Provider } from 'react-redux';
import RootNavigation from './src/Navigation/RootNavigation';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidColor, EventType } from '@notifee/react-native';
import { replyToNudge } from './src/businessLogic/firestoreFunctions';


notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
        await replyToNudge(notification.data.notificationId, detail.input);
        notifee.cancelNotification(notification.id);
    }
})

const handleNotification = async (notification) => {
    const channelId = await notifee.createChannel({
        id: 'normal2',
        name: 'normal notifications 2',
        lights: true,
        vibration: true,
        importance: AndroidImportance.HIGH,
        lightColor: AndroidColor.RED,
    })

    const notificationSenderData = JSON.parse(notification.data.senderData);

    console.log("hi ", notification.data.message);

    await notifee.displayNotification({
        title: `${notificationSenderData.username} nudged you!`,
        body: `${notification.data.message}!`,
        data: {notificationId: notification.data.id},
        android: {
            channelId,
            largeIcon: notificationSenderData.pfpUrl,
            actions: [
                {
                    title: 'Reply',
                    pressAction: { id: 'reply' },
                    input: true,
                }
            ]
        },
    });
}

// register notification handlers
messaging().setBackgroundMessageHandler(handleNotification);


SplashScreen.preventAutoHideAsync();

export default function App() {
    const [fontsLoaded] = useFonts({
        'elephant': require('./assets/fonts/ElephantRegular.ttf'),
        'inter': require('./assets/fonts/Inter-Regular.ttf'),
        'space-grotesk': require('./assets/fonts/SpaceGrotesk-Regular.ttf'),
        'space-grotesk-bold': require('./assets/fonts/SpaceGrotesk-Bold.ttf')
    });

    if (Platform.OS === 'android') {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }


    return (
        <SafeAreaProvider>
            <NavigationContainer theme={DarkTheme}>
                <Provider store={store}>
                    <View style={styles.container} onLayout={onLayoutRootView}>
                        <StatusBar translucent={false} style="light" />
                        <RootNavigation />
                    </View>
                </Provider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
