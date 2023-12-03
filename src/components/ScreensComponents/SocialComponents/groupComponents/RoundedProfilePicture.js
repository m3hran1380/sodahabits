import { StyleSheet, View, Image } from 'react-native'
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import { availableScreenWidth2 } from '../../../../styles/generalStyle';


const RoundedProfilePicture = ({ userData, radius }) => {
    return (
        <View>
            <Canvas style={[styles.shadow, {width: radius*1.2, height: radius*1.2}]}>
                <Circle cx={(radius/2)} cy={(radius/2)} r={(radius/2)}>
                    <RadialGradient
                        c={vec((radius/2), (radius/2))}
                        r={(radius/2)}
                        colors={['black', 'black', 'black', 'transparent']}
                    />
                </Circle>
            </Canvas>
            <View style={[styles.imageContainer, {width: radius, height: radius, borderRadius: radius/2}]}>
                { userData?.pfpUrl ? 
                    <Image resizeMode='contain' source={{ uri: userData.pfpUrl }} style={styles.pfpImage} />
                    :
                    <DefaultPFP width='100%' height='100%' style={styles.pfpImage} />
                }
            </View>
        </View>
    )
}

export default RoundedProfilePicture;

const styles = StyleSheet.create({
    shadow: {
        position: 'absolute',
        top: '10%',
    },
    imageContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
})