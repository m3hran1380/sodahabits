import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { actualScreenWidth, availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import LockedIcon from '../../../../../assets/svgs/Icons/groupJourneyIcons/locked.svg';
import { useNavigation } from '@react-navigation/native';
import JourneyCreationScreens from './JourneyCreationScreens';
import { useState } from 'react';
import { useSelector } from 'react-redux';


const JourneyEpisode = ({ groupId, episodeNumber, episodeName, unlocked, index, children }) => {
    
    const [startJourney, setStartJourney] = useState(false);
    const navigation = useNavigation();
    const userCurrentJourney = useSelector(state => state.groups.currentJourney)[groupId];

    const handleEpisodeInteraction = () => {
        if (userCurrentJourney && userCurrentJourney.members.length > 2) {
            navigation.navigate('journey challenge screen')
        }
        else if (episodeNumber === 'EP.1' && !userCurrentJourney) {
            setStartJourney(true);
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.innerContainer, (index%2 === 1) && {alignSelf: 'flex-end'}]}>
                <Pressable onPress={handleEpisodeInteraction} style={styles.imageContainer}>
                    {children}
                    {!unlocked &&
                        <View style={styles.unlockedContainer}>
                            <LockedIcon width='80%' height='80%' />
                        </View>
                    }
                </Pressable>
                <Text style={styles.text}>{episodeNumber}</Text>
                <Text style={[styles.text, {top: -6}]}>{episodeName}</Text>
            </View>
            
            {(userCurrentJourney && userCurrentJourney?.members?.length < 3 && index === 0) &&
                <View style={[styles.waitingContainer, (index%2 === 1) && {left: 0}]}>
                    <Text style={styles.textNormal}>waiting for others to join</Text>
                </View>
            }


            {startJourney && <JourneyCreationScreens groupId={groupId} setStartJourney={setStartJourney} />}
        </View>
    )
}

export default JourneyEpisode

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    }, 
    innerContainer: {
        width: availableScreenWidth2 / 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        height: availableScreenWidth2 / 3,
        width: availableScreenWidth2 / 3,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden'
    },
    text: {
        color: 'white',
        ...textStyle.allTextBold,
        fontSize: 18,
        textAlign: 'center'
    },
    textNormal: {
        color: 'white',
        ...textStyle.allText,
        fontSize: 12,
        textAlign: 'center'
    },
    unlockedContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        width: '100%',
        height: '100%'
    },
    waitingContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
        backgroundColor: '#24292B',
        position: 'absolute',
        top: availableScreenWidth2 / 10,
        maxWidth: (actualScreenWidth * 0.7) - ((availableScreenWidth2 / 3) + 5),
        right: 0,
    },
})