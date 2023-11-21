import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { actualScreenWidth, availableScreenWidth2, textStyle } from '../../../../styles/generalStyle'
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import ReplyInput from './ReplyInput';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { replyToNudge } from '../../../../businessLogic/firestoreFunctions';


const NotificationElement = ({ listOffsetValue, flatListRef, index, viewableNotification }) => {
    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    const [replied, setReplied] = useState(false);
    const [showReplyMenu, setShowReplyMenu] = useState(false);
    const [showReplyInput, setShowReplyInput] = useState(false);

    const data = useSelector(state => state.notifications.unreadNotificationsData)[index];

    useEffect(() => {
        if (replied) {
            setShowReplyMenu(false);
            setShowReplyInput(false);
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
            setShowReplyInput(false);
        }
    }

    const replyWithEmoji = async (emoji) => {
        setReplied(true);
        await replyToNudge(data.notificationData, emoji, false);
    }


    if (!data?.dummy) {
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
                        {data.notificationData?.reply ?
                        <Text style={styles.boldText}>{data.userData.username} replied to your '{data.notificationData.habitName}' nudge</Text>
                        :
                        <Text style={styles.boldText}>{data.userData.username} nudged you to '{data.notificationData.habitName}'</Text>
                        }
                        {data.notificationData?.defaultMessage ?
                            <Text style={styles.text}>Complete your habit!</Text>
                               :
                            <>{data.notificationData?.isEmoji ? 
                                <Text style={[styles.text, {fontSize: 20}]}>{String.fromCodePoint(data.notificationData.message)}</Text>
                                :
                                <Text style={styles.text}>{data.notificationData.message}</Text>
                            }</>
                        }
                    </View>
                </View>
                {showReplyMenu &&
                <>{!showReplyInput ?
                    <View style={styles.replyContainer}>
                        <Pressable onPress={() => {setShowReplyInput(true)}} style={styles.replyBtn}>
                            <Text style={styles.text}>Reply</Text>
                        </Pressable>
                        <Text style={styles.text}>or</Text>
                        <View style={styles.emojiContainer}>
                            <Pressable onPress={() => replyWithEmoji(String.fromCodePoint('0x1F44D'))} style={styles.emoji}>
                                <Text>{String.fromCodePoint('0x1F44D')}</Text>
                            </Pressable>
                            <Pressable onPress={() => replyWithEmoji(String.fromCodePoint('0x2764'))} style={styles.emoji}>
                                <Text>{String.fromCodePoint('0x2764')}</Text>
                            </Pressable>
                            <Pressable onPress={() => replyWithEmoji(String.fromCodePoint('0x1F64F'))} style={styles.emoji}>
                                <Text>{String.fromCodePoint('0x1F64F')}</Text>
                            </Pressable>
                        </View>
                    </View>
                    :
                    <ReplyInput setReplied={setReplied} notificationData={data.notificationData}/>
                }</>
                }
            </AnimatedPressable>
        )
    }
    else return (
        <View style={[styles.container, {marginRight: 20, opacity: 0}]} />
    )
}

export default NotificationElement

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