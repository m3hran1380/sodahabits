import { StyleSheet, Text, View, Image } from 'react-native';
import { useState } from 'react';
import generalStyles, { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { formatDate } from '../../../../businessLogic/utilityFunctions';
import SocialPostHabitItem from './SocialPostHabitItem';
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import HabitCompletionStatusDot from './HabitCompletionStatusDot';
import ExpandedHabitOverlay from './ExpandedHabitOverlay';
import { convertToLocaleTime } from '../../../../businessLogic/firestoreFunctions';


const SocialPost = ({ userData, habitsData, style }) => {

    const [expandedHabit, setExpandedHabit] = useState(null);

    const primaryHabitsData = Object.keys(habitsData.habits.primary).map(key => habitsData.habits.primary[key]);

    // sort the habits first according to status and then according to completionTime.
    primaryHabitsData.sort((a, b) => {
        if (a.status === 'complete' && b.status !== 'complete') return -1;
        else if (b.status === 'complete' && a.status !== 'complete') return 1;
        else if (a.status === 'complete' && b.status === 'complete') {
            // compare their completion times:
            const aCompletionTime = convertToLocaleTime(a.completionTime);
            const bCompletionTime = convertToLocaleTime(b.completionTime);
            return aCompletionTime - bCompletionTime;
        }
        // if statuses are both not "complete" then maintain the order
        else return 0;
    })


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
                {expandedHabit && <ExpandedHabitOverlay setExpandedHabit={setExpandedHabit} habitData={expandedHabit} />}
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
    }
})