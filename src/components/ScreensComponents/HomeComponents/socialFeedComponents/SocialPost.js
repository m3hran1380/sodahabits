import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { useState, memo, useEffect } from 'react';
import generalStyles, { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { formatDate } from '../../../../businessLogic/utilityFunctions';
import SocialPostHabitItem from './SocialPostHabitItem';
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import HabitCompletionStatusDot from './HabitCompletionStatusDot';
import ExpandedHabitOverlay from './ExpandedHabitOverlay';
import { convertToLocaleTime } from '../../../../businessLogic/firestoreFunctions';
import { useSelector } from 'react-redux';
import UnheartedIcon from '../../../../../assets/svgs/Icons/socialFeedIcons/unhearted.svg';
import HeartedIcon from '../../../../../assets/svgs/Icons/socialFeedIcons/hearted.svg';
import UserHeartIcon from '../../../../../assets/svgs/Icons/socialFeedIcons/blueHeart.svg';
import EmptyUserHeartIcon from '../../../../../assets/svgs/Icons/socialFeedIcons/blueHeartEmpty.svg';
import { toggleLikeStatus } from '../../../../businessLogic/firestoreFunctions';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import PostLikesOverlay from './PostLikesOverlay';
import { useLayoutEffect } from 'react';


const SocialPost = memo(({ userData, habitsData, isPostOwner, style }) => {
    const user = useSelector(state => state.user.currentUser);
    const [expandedHabit, setExpandedHabit] = useState(null);
    const [liked, setLiked] = useState(null);
    const [showLikesOverlay, setShowLikesOverlay] = useState(false);

    const primaryHabitsData = Object.keys(habitsData.habits.primary).map(key => habitsData.habits.primary[key]);

    useLayoutEffect(() => {
        if (habitsData?.likes?.includes(user.uid)) {
            setLiked(true);
        }
        else {
            setLiked(false);
        }
    }, [habitsData]);


    // sort the habits first according to status and then according to completionTime.
    primaryHabitsData.sort((a, b) => {
        if (a.status === 'complete' && b.status !== 'complete') return -1;
        else if (b.status === 'complete' && a.status !== 'complete') return 1;
        else if (a.status === 'complete' && b.status === 'complete') {
            // compare their completion times:
            if (a.completionTime && b.completionTime) {
                const aCompletionTime = convertToLocaleTime(a.completionTime);
                const bCompletionTime = convertToLocaleTime(b.completionTime);
                return aCompletionTime - bCompletionTime;
            }
        }
        // if statuses are both not "complete" then maintain the order
        else return 0;
    })


    const toggleHeartStatus = async () => {
        try {
            setLiked(val => !val);
            await toggleLikeStatus(habitsData.id, user.uid);
        }
        catch (error) {
            console.log("error while updating the like status of a post ", error);
            setLiked(val => !val);
        }
    }

    const userHeartPressed = () => {
        // this function handles the situation where the heart on the user's own posts is pressed
        setShowLikesOverlay(true);
    }

    const doubleTapGesture = Gesture.Tap().numberOfTaps(2).onEnd((_, success) => {
        if (success && !isPostOwner) {
            runOnJS(toggleHeartStatus)();
        }
    })

    return (
        <View style={styles.overallContainer}>
            <GestureDetector gesture={doubleTapGesture}>
                <View style={styles.postContainer}>
                    <View style={styles.postHeaderContainer}>
                        <View style={styles.userInfoContainer}>
                            <View>
                                <Canvas style={styles.glowCanvas}>
                                    <Circle cx={(availableScreenWidth2/12)} cy={(availableScreenWidth2/12)} r={(availableScreenWidth2/12)}>
                                        <RadialGradient
                                            c={vec((availableScreenWidth2/12), (availableScreenWidth2/12))}
                                            r={(availableScreenWidth2/12)}
                                            colors={['black', 'black', 'black', 'black', 'transparent']}
                                        />
                                    </Circle>
                                </Canvas>
                                <View style={styles.imageContainer}>
                                    { userData?.pfpUrl ? 
                                        <Image resizeMode='contain' source={{ uri: userData.pfpUrl }} style={styles.pfpImage} />
                                        :
                                        <DefaultPFP width='100%' height='100%' style={styles.pfpImage} />
                                    }
                                </View>
                            </View>
                            <View style={styles.userTextInfoContainer}>
                                <Text style={[styles.text, generalStyles.h3]}>{userData.username}{isPostOwner && ' (You)'}</Text>
                                <Text style={styles.text}>{formatDate(habitsData.timestamp)}</Text>
                            </View>
                        </View>
                        <View style={styles.dotTrackerContainer}>
                            {primaryHabitsData.map((habitData, index) => <HabitCompletionStatusDot key={index} habitData={habitData} />)}
                        </View>
                    </View>
                    <View style={styles.habitsContainer}>
                        {
                            primaryHabitsData.map((habitData, index) => 
                                <SocialPostHabitItem 
                                    key={index} 
                                    style={style[index]} 
                                    habitData={habitData} 
                                    setExpandedHabit={setExpandedHabit}
                                />
                            )
                        }
                    </View>
                    <View style={styles.heartIconContainer}>
                    {
                        isPostOwner ?
                        // this is shown when the post is the user's post themselves and not their friends.
                        <>
                        {habitsData?.likes?.length ? 
                        <Pressable onPress={userHeartPressed} style={styles.heartIcon}><UserHeartIcon width='100%' height='100%' /></Pressable>
                        :
                        <Pressable onPress={userHeartPressed} style={styles.heartIcon}><EmptyUserHeartIcon width='100%' height='100%' /></Pressable>
                        }</>
                        :
                        <>
                        {liked ? 
                        <Pressable onPress={toggleHeartStatus} style={styles.heartIcon}><HeartedIcon width='100%' height='100%' /></Pressable>
                        :
                        <Pressable onPress={toggleHeartStatus} style={styles.heartIcon}><UnheartedIcon width='100%' height='100%' /></Pressable>}</>
                    }
                    </View>
                    {expandedHabit && <ExpandedHabitOverlay setExpandedHabit={setExpandedHabit} habitData={expandedHabit} />}
                </View> 
            </GestureDetector>

            {showLikesOverlay && <PostLikesOverlay likesUserIds={habitsData?.likes ? habitsData?.likes : []} setShowLikesOverlay={setShowLikesOverlay} />}
        </View>
    )
},
(r1, r2) => {
    // prevent unnecessary re-render when flatlist data changes.
    const r1Data = JSON.stringify(r1);
    const r2Data = JSON.stringify(r2);
    if (r1Data.localeCompare(r2Data) === 0) return true;
    else return false;
}
)

export default SocialPost

const styles = StyleSheet.create({
    overallContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    postContainer: {
        width: availableScreenWidth2,
        height: availableScreenWidth2,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        backgroundColor: '#354A63',
        overflow: 'hidden'
    },
    postHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        height: (availableScreenWidth2/6),
        width: (availableScreenWidth2/6),
        borderRadius: (availableScreenWidth2/12),
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
    text: {
        ...textStyle.allText,
        color: 'white',
        textAlign: 'left'
    },
    userTextInfoContainer: {
        marginHorizontal: 8,
        justifyContent: 'center',
    },
    habitsContainer: {
        flex: 1,
        padding: 10,
    },
    glowCanvas: {
        width: availableScreenWidth2/5, 
        height: availableScreenWidth2/5,
        position: 'absolute',
        top: '10%',
    },
    dotTrackerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: availableScreenWidth2/4.5,
        height: availableScreenWidth2/16,
    },
    heartIconContainer: {
        position: 'absolute',
        bottom: '2%',
        right: '3%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: availableScreenWidth2/16,
        zIndex: 1,

    },
    heartIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: availableScreenWidth2/14,
        height: availableScreenWidth2/14,
    }
})