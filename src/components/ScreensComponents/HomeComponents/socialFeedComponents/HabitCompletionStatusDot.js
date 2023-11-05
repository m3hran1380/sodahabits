import { StyleSheet, View } from 'react-native';
import { availableScreenWidth2 } from '../../../../styles/generalStyle';
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";


const dotDimension = availableScreenWidth2/16;
const dotShadowDimension = (availableScreenWidth2/16) * 1.2;

const HabitCompletionStatusDot = ({ habitData }) => {
    return (
        <View style={styles.container}>
            <Canvas style={styles.glowCanvas}>
                <Circle cx={(dotShadowDimension/2)} cy={(dotShadowDimension/2)} r={(dotShadowDimension/2)}>
                    <RadialGradient
                        c={vec((dotShadowDimension/2), (dotShadowDimension/2))}
                        r={(dotShadowDimension/2)}
                        colors={['black', 'transparent']}
                    />
                </Circle>
            </Canvas>
            <View style={[styles.dot, habitData.status === 'complete' && {backgroundColor: '#72ED47'}]} />
        </View>
    )
}

export default HabitCompletionStatusDot

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: dotDimension,
        height: dotDimension,
    },
    dot: {
        borderColor: 'white',
        borderWidth: 2,
        backgroundColor: '#354A63',
        borderRadius: 20,
        height: '100%',
        width: '100%'
    },
    glowCanvas: {
        width: dotShadowDimension, 
        height: dotShadowDimension,
        position: 'absolute',
        top: '8%',
    }
})