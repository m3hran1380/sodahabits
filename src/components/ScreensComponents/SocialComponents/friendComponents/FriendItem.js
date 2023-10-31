import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { availableScreenWidth2 } from '../../../../styles/generalStyle';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
    Canvas,
    Rect,
    Circle,
    RadialGradient,
    Skia,
    Shader,
    vec,
    Group,
    Shadow
} from "@shopify/react-native-skia";
   


const defaultPFP = require('../../../../../assets/images/profilePictures/default-pfp.png');

const FriendItem = ({ userData }) => {

    const user = useSelector(state => state.user.currentUser);

    console.log(userData);

    return ( 
        <View>
            <View style={styles.pfpContainer}>
                {userData?.type && 
                    <Canvas style={styles.glowCanvas}>
                        <Circle cx={(availableScreenWidth2/3) * 0.5} cy={(availableScreenWidth2/3) * 0.5} r={(availableScreenWidth2/3) * 0.5}>
                            <RadialGradient
                                c={vec((availableScreenWidth2/3) * 0.5, (availableScreenWidth2/3) * 0.5)}
                                r={(availableScreenWidth2/3) * 0.5}
                                colors={['#55D5E7', '#55D5E7', '#55D5E7', 'transparent']}
                            />
                        </Circle>
                    </Canvas>
                }
                <View style={styles.imageContainer}>
                    { userData?.pfpurl ? 
                        <Image resizeMode='contain' source={{ uri: userData.pfpurl }} style={styles.pfpImage} />
                        :
                        <Image resizeMode='contain' source={defaultPFP} style={styles.pfpImage} />
                    }
                </View>
            </View>
            <Text style={styles.text}>{userData.username}</Text>
        </View>
    )
}

export default FriendItem;


const styles = StyleSheet.create({
    pfpContainer: {
        width: availableScreenWidth2/3,
        height: availableScreenWidth2/3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: (availableScreenWidth2/3) * 0.65,
        width: (availableScreenWidth2/3) * 0.65,
        borderRadius: (availableScreenWidth2/3) * 0.35,
        overflow: 'hidden',
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    glowCanvas: {
        width: availableScreenWidth2/3, 
        height: availableScreenWidth2/3,
        position: 'absolute',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        top: -(availableScreenWidth2/3) * 0.08,
    },
})