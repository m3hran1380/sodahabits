import { useCallback, useEffect } from 'react';
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
import { replyToNudge, addNotificationID } from './src/businessLogic/firestoreFunctions';


notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
        await replyToNudge(notification.data.notificationData, detail.input, false);
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
    const notificationData = JSON.parse(notification.data.notificationData);

    const notificationTitle = notificationData?.reply ? `${notificationSenderData.username} replied to you!` : `${notificationSenderData.username} nudged you!`;

    const createdNotificationId = await notifee.displayNotification({
        title: notificationTitle,
        body: `${notification.data.message}!`,
        data: {notificationData: notificationData},
        android: {
            channelId,
            largeIcon: notificationSenderData.pfpUrl,
            pressAction: {
                id: 'default',
            },
            actions: [
                {
                    title: 'Reply',
                    pressAction: { id: 'reply' },
                    input: true,
                }
            ]
        },
    });

    await addNotificationID(createdNotificationId, notification.data.id);
}

// register notification handlers
messaging().setBackgroundMessageHandler(handleNotification);
messaging().onMessage(handleNotification);

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

    useEffect(() => {
        return notifee.onForegroundEvent(({ type, detail }) => {
            const { notification, pressAction } = detail;

            if (type === EventType.ACTION_PRESS && pressAction.id === 'reply') {
                replyToNudge(notification.data.notificationData, detail.input, false);
                notifee.cancelNotification(notification.id);
            }
        })
    })

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
