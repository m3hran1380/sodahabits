import { StyleSheet, View } from 'react-native'
import { actualScreenWidth, availableScreenWidth2 } from '../../../../styles/generalStyle'
import { useLayoutEffect, useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import NudgeNotificationElement from './NudgeNotificationElement';
import InvitationNotificationElement from './InvitationNotificationElement';
import Animated, { useSharedValue, useAnimatedScrollHandler, runOnJS, FadeIn } from 'react-native-reanimated';
import { setNotificationsReadStatus } from '../../../../businessLogic/firestoreFunctions';
import notifee from '@notifee/react-native';
import { setUnreadNotificationsData } from '../../../../features/notificationSlice';


const NotificationsListOverlay = ({notifications}) => {
    const {friendsList} = useSelector(state => state.friends);
    const notificationsData = useSelector(state => state.notifications.unreadNotificationsData);
    const [updatingNotifications, setUpdatingNotifications] = useState(false);
    const [viewableNotification, setViewableNotification] = useState(0);

    const flatListRef = useRef(null);
    const listOffsetValue = useSharedValue(0);

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        // add the user data to the notifications
        let notificationsDataArray = [];
        if (!notificationsData.length) {
            notificationsDataArray = notifications.filter(notification => notification?.notificationId).map((notification, index) => {
                const userData = friendsList.find((friend) => friend.id === notification.senderId);
                return (
                    {
                        userData: userData,
                        notificationData: notification,
                    }
                )
            });
        }
        else {
            const newIDArray = notifications.filter(notification => notification?.notificationId).map(not => not.id);
            const oldIDArray = notificationsData.map(not => not.notificationData.id).slice(0, -1);;

            const difference = newIDArray.filter(id => !oldIDArray.includes(id));
            difference.forEach((id) => {
                const notificationData = notifications.filter(not => not.id === id)[0];
                const userData = friendsList.find(friend => friend.id === notificationData.senderId);
                notificationsDataArray = [...notificationsData.slice(0, -1), {
                    userData: userData,
                    notificationData: notificationData,
                }]
            })
        }
        if (notificationsDataArray.length) {
            notificationsDataArray.push({
                dummy: true,
                notificationData: {id: 'last-item'},
            });
        }
        // check see if the array has actually changed:
        const newArrayIDs = notificationsDataArray.map(item => item.notificationData.id);
        const oldArrayIDs = notificationsData.map(item => item.notificationData.id);
        if (newArrayIDs.length < oldArrayIDs.length) return;
        if (newArrayIDs.length === oldArrayIDs.length && newArrayIDs.every((element, index) => element === oldArrayIDs[index])) return;
        
        if (updatingNotifications) setUpdatingNotifications(false);
        dispatch(setUnreadNotificationsData(notificationsDataArray));

    }, [notifications]);

    // remove the associated notification from the users device as they scroll
    useEffect(() => {
        if (!viewableNotification) return;
        if (notifications[viewableNotification - 1]?.notificationId) {
            notifee.cancelNotification(notifications[viewableNotification - 1].notificationId);
        }
    }, [viewableNotification])

    const handleScroll = useAnimatedScrollHandler({
        onScroll: e => listOffsetValue.value = e.contentOffset.x,
    });

    const handleEndRached = () => {
        setUpdatingNotifications(true);
        dispatch(setUnreadNotificationsData([]));
        if (notifications[notifications.length - 1]?.notificationId) {
            notifee.cancelNotification(notifications[notifications.length - 1].notificationId);
        }
        const notificationsIdArray = notifications.map(not => not.id);
        setNotificationsReadStatus(notificationsIdArray)
    }

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 100,
    }

    const onViewableItemsChanged = ({ viewableItems }) => {
        if (!viewableItems.length) return;
        if (viewableItems[0].index !== null || viewableItems[0].index !== viewableNotification) {
            runOnJS(setViewableNotification)(viewableItems[0].index);
        }    
    }

    const viewabilityConfigCallbackPairs = useRef([
        { viewabilityConfig, onViewableItemsChanged }
    ]);

    const renderPost = ({item, index}) => {
        if (item.notificationData?.type === 'group-invitation') {
            return (
                <InvitationNotificationElement 
                    listLength={notificationsData.length} 
                    listOffsetValue={listOffsetValue} 
                    index={index}
                    flatListRef={flatListRef} 
                    viewableNotification={viewableNotification}
                />
            )
        }
        else {
            return (
                <NudgeNotificationElement 
                    listLength={notificationsData.length} 
                    listOffsetValue={listOffsetValue} 
                    index={index}
                    flatListRef={flatListRef} 
                    viewableNotification={viewableNotification}
                />
            )
        }
    }
 
    const keyExtractor = useCallback((item) => item.notificationData.id, []);

    if (!notificationsData.length) return <></>
    return (
        <View style={styles.container}>
            {!updatingNotifications &&
                <Animated.FlatList 
                    entering={FadeIn}
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