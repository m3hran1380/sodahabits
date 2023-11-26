import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { actualScreenWidth, availableScreenWidth2, textStyle } from '../../../../styles/generalStyle'
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { respondToGroupInvite } from '../../../../businessLogic/firestoreFunctions';


const NudgeNotificationElement = ({ listOffsetValue, flatListRef, index, viewableNotification }) => {
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const [replied, setReplied] = useState(false);
    const [showReplyMenu, setShowReplyMenu] = useState(false);

    const data = useSelector(state => state.notifications.unreadNotificationsData)[index];

    useEffect(() => {
        if (replied) {
            setShowReplyMenu(false);
            flatListRef.current.scrollToIndex({ index: viewableNotification + 1, animated: true });
        }
    }, [replied])


    const animatedStyle = useAnimatedStyle(() => {
        const marginLeftValue = interpolate(
            listOffsetValue.value,
            [(index - 1) * (actualScreenWidth - 20), (index) * (actualScreenWidth - 20)],
            [10, 20],
            Extrapolate.CLAMP
        );
        const opacityValue = interpolate(listOffsetValue.value,
            [(index - 1) * (actualScreenWidth - 20), index * (actualScreenWidth - 20), (index + 1) * (actualScreenWidth - 20)],
            [1, 1, 0],
            Extrapolate.CLAMP,
        )
        return {opacity: opacityValue, marginLeft: marginLeftValue}
    });


    const handleNotificationPressed = () => {
        if (!data.notificationData?.reply && !replied) {
            setShowReplyMenu(val => !val); 
        }
    }

    const handleAccept = async () => {
        await respondToGroupInvite(data.notificationData.id, 'accepted');
        setReplied(true);
    }

    const handleReject = async () => {
        await respondToGroupInvite(data.notificationData.id, 'rejected');
        setReplied(true);
    }

    return (
        <AnimatedPressable onPress={handleNotificationPressed} style={[styles.container, animatedStyle]}>
            <View style={styles.notificationContainer}>   
                <View style={styles.imageContainer}>
                    { data?.userData?.pfpUrl ? 
                        <Image resizeMode='contain' source={{ uri: data.userData.pfpUrl }} style={styles.pfpImage} />
                        :
                        <DefaultPFP width='100%' height='100%' style={styles.pfpImage} />
                    }
                </View>
                <View style={styles.notificationTextContainer}>
                    <Text style={styles.boldText}>{data.userData.username} invited you to the '{data.notificationData.groupName}' group</Text>
                </View>
            </View>
            {showReplyMenu &&
                <View style={styles.replyContainer}>
                    <Pressable onPress={handleAccept} style={styles.replyBtn}>
                        <Text style={[styles.text, {color: 'green'}]}>Accept</Text>
                    </Pressable>
                    <Pressable onPress={handleReject} style={styles.replyBtn}>
                        <Text style={[styles.text, {color: 'red'}]}>Reject</Text>
                    </Pressable>
                </View>
            }
        </AnimatedPressable>
    )
}


export default NudgeNotificationElement

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'rgba(0,0,0,0.65)',
        width: availableScreenWidth2,
        minHeight: availableScreenWidth2/5 + 15,
        marginLeft: 10,
        paddingHorizontal: 7.5,
        paddingVertical: 7.5,
        justifyContent: 'center',
    },
    notificationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: (availableScreenWidth2/5),
        width: (availableScreenWidth2/5),
        borderRadius: (availableScreenWidth2/10),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        borderWidth: 2,
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    notificationTextContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    boldText: {
        color: 'white',
        ...textStyle.h1,
        ...textStyle.normalText,
    },
    text: {
        color: 'white',
        ...textStyle.allText,
    },
    replyContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    replyBtn: {
        marginHorizontal: 5,
    },
    emojiContainer: {
        flexDirection: 'row',
        marginLeft: 5,
        paddingHorizontal: 3,
        paddingVertical: 2,
        backgroundColor: 'black',
        borderRadius: 50,
    },
    emoji: {
        paddingHorizontal: 2,
    },
})