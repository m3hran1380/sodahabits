import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import DefaultHabitPicture from '../../../../../assets/svgs/defaultHabit.svg';
import HabitDoneCheck from '../../../../../assets/svgs/Icons/socialFeedIcons/habitDone.svg';
import Nudge from '../../../../../assets/svgs/Icons/socialFeedIcons/nudge.svg';
import { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { convertToLocaleTime } from '../../../../businessLogic/firestoreFunctions';
import { getTime } from '../../../../businessLogic/utilityFunctions';
import { useDispatch, useSelector } from 'react-redux';
import { setNudgeOpen } from '../../../../features/appSlice';


const SocialPostHabitItem = ({ habitData, style, setExpandedHabit, isPostOwner, postIndex, flashListRef }) => {
    const dispatch = useDispatch();

    const { nudgeOpen } = useSelector(state => state.app);

    // following are used for the hovering effect:
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const targetX = useSharedValue(0);
    const targetY = useSharedValue(0);

    const initialSequence = useSharedValue(true);

    const interval = 2000;
    const amplitude = 5;

    useEffect(() => {
        if (initialSequence.value) {
            targetX.value = (Math.random() - 0.5) * amplitude * 2;
            targetY.value = (Math.random() - 0.5) * amplitude * 2;
        }
        const timer = setInterval(() => {
            if (initialSequence.value) initialSequence.value = false;
            targetX.value = (Math.random() - 0.5) * amplitude * 2;
            targetY.value = (Math.random() - 0.5) * amplitude * 2;
        }, interval)

        return () => clearInterval(timer);
    }, []);

    const animatedHoverStyle = useAnimatedStyle(() => {
        translateX.value = withTiming(targetX.value, {duration: interval});
        translateY.value = withTiming(targetY.value, {duration: interval});
    
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
            ],
        };
    })

    const handleHabitPressed = () => {
        if (habitData?.status === 'complete') {
            setExpandedHabit(habitData);
        }
    }

    const handleNudge = async () => {        
        if (nudgeOpen?.index === postIndex) dispatch(setNudgeOpen(null));
        else dispatch(setNudgeOpen({index: postIndex, habitData: habitData}));

        flashListRef.current.scrollToIndex({ animated: true, index: postIndex })
    }


    return (
        <Animated.View style={[styles.container, style, animatedHoverStyle]}>
            {habitData?.completionTime && <Text style={styles.smallText}>{getTime(convertToLocaleTime(habitData.completionTime))}</Text>}
            
            <Pressable onPress={handleHabitPressed} style={styles.imageContainer}>
                { habitData?.imageUrl ? 
                    <Image resizeMode='contain' source={{ uri: habitData.imageUrl }} style={styles.habitImage} />
                    :
                    <DefaultHabitPicture width='100%' height='100%'/>
                }
                {habitData.status === 'complete' && 
                    <View style={styles.habitDoneCheckmark}>
                        <HabitDoneCheck width='100%' height='100%' />
                    </View>
                }
                {(habitData.status === 'pending' && !isPostOwner) && 
                    <Pressable onPress={handleNudge} style={styles.nudge}>
                        <Nudge width='100%' height='100%' />
                    </Pressable>
                }
            </Pressable>

            <Text style={styles.text}>
                {habitData.name}
            </Text>
        </Animated.View>
    )
}

export default SocialPostHabitItem

const styles = StyleSheet.create({
    container: {
        width: availableScreenWidth2/3.5,
        position: 'absolute',
    },
    imageContainer: {
        height: availableScreenWidth2/3.3,
        width: availableScreenWidth2/3.3,
        borderRadius: (availableScreenWidth2/6),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1.5,
    },
    habitImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    text: {
        ...textStyle.allText,
        color: 'white',
        textAlign: 'center',
    },
    smallText: {
        ...textStyle.allText,
        color: 'white',
        textAlign: 'center',
        fontSize: 10,
        marginBottom: 2
    },
    habitDoneCheckmark: {
        width: '20%',
        height: '20%',
        position: 'absolute',
        bottom: '5%',
    },
    nudge: {
        width: '30%',
        height: '13%',
        position: 'absolute',
        bottom: '7%',
    },
})