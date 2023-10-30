import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import CanIcon from '../../../../assets/svgs/Icons/cameraIcons/canEdited.svg';
import generalStyles, { actualScreenWidth, colors } from '../../../styles/generalStyle';
import Animated, { useAnimatedStyle, withRepeat, withTiming, withDelay, withSequence } from 'react-native-reanimated';


const canWidth = 75 * (actualScreenWidth / 130);
const canHeight = actualScreenWidth;


const CanProgressionBar = ({ progress }) => {

    const progressionBarStyle = useAnimatedStyle(() => {
        return {
            height: withTiming((canHeight * 0.9) * (progress / 100)),
        }
    })

    const firstDotStyle = useAnimatedStyle(() => {
        return {
            opacity: withDelay(0, withRepeat(withSequence(withTiming(0, {duration: 400}), withTiming(1, {duration: 400})), -1))
        }
    })
    const secondDotStyle = useAnimatedStyle(() => {
        return {
            opacity: withDelay(100, withRepeat(withSequence(withTiming(0, {duration: 400}), withTiming(1, {duration: 400})), -1))
        }
    })
    const thirdDotStyle = useAnimatedStyle(() => {
        return {
            opacity: withDelay(200, withRepeat(withSequence(withTiming(0, {duration: 400}), withTiming(1, {duration: 400})), -1))
        }
    })

    return (
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                <Text style={generalStyles.h3}>Uploading</Text>
                <Animated.Text style={[generalStyles.h3, firstDotStyle]}> .</Animated.Text>
                <Animated.Text style={[generalStyles.h3, secondDotStyle]}>.</Animated.Text>
                <Animated.Text style={[generalStyles.h3, thirdDotStyle]}>.</Animated.Text>
            </View>
            <Animated.View style={[styles.progressBar, progressionBarStyle]} />
            <CanIcon width={canWidth} height={canHeight} />
        </View>
    )
}

export default CanProgressionBar

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    progressBar: {
        position: 'absolute',
        zIndex: -100,
        backgroundColor: colors.backgroundColorSecondary,
        width: canWidth * 0.93,
        borderRadius: canWidth/8,
        bottom: 5,
    },
    text: {
        color: 'white',
        opacity: 0,
    },
    textWrapper: {
        flexDirection: 'row',
    },
    can: {
        position: 'absolute',
        zIndex: 100,  
    }
})