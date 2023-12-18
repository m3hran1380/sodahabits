import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import LockedIcon from '../../../../../assets/svgs/Icons/groupJourneyIcons/locked.svg';
import { useNavigation } from '@react-navigation/native';


const JourneyEpisode = ({ episodeNumber, episodeName, unlocked, index, children }) => {
    
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={[styles.innerContainer, (index%2 === 1) && {alignSelf: 'flex-end'}]}>
                <Pressable onPress={() => {navigation.navigate('journey challenge screen')}} style={styles.imageContainer}>
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
    unlockedContainer: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 100,
        width: '100%',
        height: '100%'
    }
})