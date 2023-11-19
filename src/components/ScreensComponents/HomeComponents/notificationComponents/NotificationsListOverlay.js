import { StyleSheet, View } from 'react-native'
import { actualScreenWidth, availableScreenWidth2 } from '../../../../styles/generalStyle'
import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NotificationElement from './NotificationElement';
import Animated, { useSharedValue, useAnimatedScrollHandler, runOnJS } from 'react-native-reanimated';
import { setNotificationsReadStatus } from '../../../../businessLogic/firestoreFunctions';
import notifee from '@notifee/react-native';
import { setNotificationIndex } from '../../../../features/notificationSlice';


const NotificationsListOverlay = ({notifications}) => {
    const {friendsList} = useSelector(state => state.friends);
    const [notificationsData, setNotificationsData] = useState([]);
    const [updatingNotifications, setUpdatingNotifications] = useState(false);
    const [viewableNotification, setViewableNotification] = useState(null);
    const flatListRef = useRef(null);
    const listOffsetValue = useSharedValue(0);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        // add the user data to the notifications
        const notificationsDataArray = notifications.filter(notification => notification?.notificationId).map((notification) => {
            const userData = friendsList.find((friend) => friend.id === notification.senderId);
            return (
                {
                    userData: userData,
                    notificationData: notification,
                }
            )
        });
        notificationsDataArray.push({
            dummy: true,
        })
        setNotificationsData(notificationsDataArray);   
    }, [notifications]);


    // scroll to start of the notifications list when new notification appears.
    useEffect(() => {
        if (!notificationsData.length) return;
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
    }, 
    [notificationsData]);

    // remove the associated notification from the users device as they scroll
    useEffect(() => {
        if (!viewableNotification) return;
        notifee.cancelNotification(notifications[viewableNotification - 1].notificationId);
    }, [viewableNotification])
    
    const handleScroll = useAnimatedScrollHandler({
        onScroll: e => listOffsetValue.value = e.contentOffset.x,
    });

    const handleEndRached = async () => {
        notifee.cancelNotification(notifications[notifications.length - 1].notificationId);
        const notificationsIdArray = notifications.map(not => not.id);
        setUpdatingNotifications(true);
        await setNotificationsReadStatus(notificationsIdArray);
        setUpdatingNotifications(false);
    }

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 100,
    }

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (!viewableItems.length) return;
        if (viewableItems[0].index !== null) {
            runOnJS(setViewableNotification)(viewableItems[0].index);
            runOnJS(dispatch)(setNotificationIndex(viewableItems[0].index));
        }    
    }

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged }
    ]);

    const renderPost = useCallback(({item, index}) =>
        <NotificationElement 
            listLength={notificationsData.length} 
            listOffsetValue={listOffsetValue} 
            data={item} 
            index={index} 
            flatListRef={flatListRef} 
        />
    ,[notificationsData])

    const keyExtractor = useCallback((item) => item?.notificationData?.id ? item.notificationData.id : Math.floor(Math.random() * 1000), []);

    return (
        <View style={styles.container}>
            {!updatingNotifications &&
                <Animated.FlatList 
                    decelerationRate={0.50}
                    onScroll={handleScroll}
                    disableIntervalMomentum
                    data={notificationsData}
                    renderItem={renderPost}
                    keyExtractor={keyExtractor}
                    horizontal={true}
                    snapToInterval={actualScreenWidth - 20}
                    showsHorizontalScrollIndicator={false}
                    onEndReached={handleEndRached}
                    ref={flatListRef}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    keyboardShouldPersistTaps='always'
                />
            }
        </View>
    )
}

export default NotificationsListOverlay

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
        position: 'absolute',
        width: '100%',
        minHeight: availableScreenWidth2/5 + 15,
        top: availableScreenWidth2/5,
    },
})