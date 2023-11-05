import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import generalStyles, { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { formatDate } from '../../../../businessLogic/utilityFunctions';
import SocialPostHabitItem from './SocialPostHabitItem';
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";



const SocialPost = ({ userData, habitsData, style }) => {

    const primaryHabitsData = Object.keys(habitsData.habits.primary).map(key => habitsData.habits.primary[key]);

    return (
        <View style={styles.overallContainer}>
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
                            <Text style={[styles.text, generalStyles.h3]}>{userData.username}</Text>
                            <Text style={styles.text}>{formatDate(habitsData.timestamp)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.habitsContainer}>
                    {
                        primaryHabitsData.map((habitData, index) => 
                            <SocialPostHabitItem 
                                key={index} 
                                style={style[index]} 
                                habitData={habitData} 
                            />
                        )
                    }
                </View>
            </View>
        </View>
    )
}

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
        backgroundColor: '#354A63'
    },
    postHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
        top: 7,
    },
})