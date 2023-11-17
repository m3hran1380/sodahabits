import { StyleSheet, Text, View, Image } from 'react-native'
import { actualScreenWidth, availableScreenWidth2, textStyle } from '../../../../styles/generalStyle'
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { memo } from 'react';


const NotificationElement = memo(({ data, listOffsetValue, index }) => {

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
    })

    if (!data?.dummy) {
        return (
            <Animated.View style={[styles.container, animatedStyle]}>   
                <View style={styles.imageContainer}>
                    <Canvas style={styles.glowCanvas}>
                        <Circle cx={(availableScreenWidth2/12)} cy={(availableScreenWidth2/12)} r={(availableScreenWidth2/12)}>
                            <RadialGradient
                                c={vec((availableScreenWidth2/12), (availableScreenWidth2/12))}
                                r={(availableScreenWidth2/12)}
                                colors={['black', 'black', 'black', 'black', 'transparent']}
                            />
                        </Circle>
                    </Canvas>
                    { data?.userData?.pfpUrl ? 
                        <Image resizeMode='contain' source={{ uri: data.userData.pfpUrl }} style={styles.pfpImage} />
                        :
                        <DefaultPFP width='100%' height='100%' style={styles.pfpImage} />
                    }
                </View>
                <View style={styles.notificationTextContainer}>
                    <Text style={styles.boldText}>{data.userData.username} nudged you to '{data.notificationData.habitName}'</Text>
                    <Text style={styles.text}>{data.notificationData.message}</Text>
                </View>
            </Animated.View>
        )
    }
    else return (
        <View style={[styles.container, {marginRight: 20, opacity: 0}]} />
    )
},
(r1, r2) => {
    // prevent unnecessary re-render when flatlist data changes.
    const { listOffsetValue: offset1, ...r1Data } = r1;
    const { listOffsetValue: offset2, ...r2Data } = r2;
    const r1DataString = JSON.stringify(r1Data);
    const r2DataString = JSON.stringify(r2Data);
    if (r1DataString.localeCompare(r2DataString) === 0) return true;
    else return false;
}
)

export default NotificationElement

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: 'rgba(0,0,0,0.7)',
        width: availableScreenWidth2,
        height: '100%',
        marginLeft: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    glowCanvas: {
        width: availableScreenWidth2/5, 
        height: availableScreenWidth2/5,
        position: 'absolute',
        top: '10%',
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
    }
})