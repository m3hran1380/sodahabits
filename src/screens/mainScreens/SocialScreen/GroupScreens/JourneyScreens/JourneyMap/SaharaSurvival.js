import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { actualScreenHeight, actualScreenWidth, availableScreenWidth2, textStyle } from '../../../../../../styles/generalStyle';
import PlaneCrashBackground from '../../../../../../../assets/svgs/backgrounds/journeyBackgrounds/planeCrash.svg';
import { LinearGradient } from 'expo-linear-gradient';
import JourneyEpisode from '../../../../../../components/ScreensComponents/SocialComponents/groupJourneyComponents/JourneyEpisode';


const SaharaSurvival = ({ groupData }) => {

    const episodesData = [
        {
            episodeNumber: 'EP.1',
            episodeName: 'Wreckage',
            episodeImage: 
                        <Image 
                            style={styles.episodeImage} 
                            source={require('../../../../../../../assets/svgs/backgrounds/journeyBackgrounds/episodes/ep1.png')} 
                            resizeMode='contain'
                        />,
            unlocked: true,
        },
        {
            episodeNumber: 'EP.2',
            episodeName: 'Soda Oasis',
            episodeImage: 
                        <Image 
                            style={styles.episodeImage} 
                            source={require('../../../../../../../assets/svgs/backgrounds/journeyBackgrounds/episodes/ep2.png')} 
                            resizeMode='contain'
                        />,
            unlocked: false,
        },
        {
            episodeNumber: 'EP.3',
            episodeName: 'Sandstorm',
            episodeImage: 
                        <Image 
                            style={styles.episodeImage} 
                            source={require('../../../../../../../assets/svgs/backgrounds/journeyBackgrounds/episodes/ep3.png')} 
                            resizeMode='contain'
                        />,
            unlocked: false,
        },
    ]


    return (
        <View style={styles.container}>
            <LinearGradient 
                start={{x:0, y:0.1}} 
                end={{x:0, y:0.9}} 
                colors={['#4F572F', 'transparent']} 
                style={styles.fade} 
            />
            <View style={styles.episodesContainer}>
                <FlatList 
                    data={episodesData}
                    renderItem={({ item, index }) => 
                        <JourneyEpisode index={index} groupId={groupData.id} episodeNumber={item.episodeNumber} episodeName={item.episodeName} unlocked={item.unlocked}>
                            {item.episodeImage}
                        </JourneyEpisode> 
                    }
                    keyExtractor={(_, index) => index}
                    inverted={true}
                    showsVerticalScrollIndicator={false}
                />
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.title}>Season 1</Text>
                <Text style={styles.title}>Sahara survival</Text>
            </View>
            <PlaneCrashBackground style={styles.planeCrash} />
        </View>
    )
}

export default SaharaSurvival

const styles = StyleSheet.create({
    container: {
        width: actualScreenWidth,
        height: actualScreenHeight,
        backgroundColor: '#B4CDD6',
        alignItems: 'center'
    },
    planeCrash: {
        position: 'absolute',
        bottom: 0,
    },
    fade: {
        height: '20%',
        width: '100%'
    },
    title: {
        color: 'white',
        ...textStyle.allTextBold,
        fontSize: 30,
        textAlign: 'right'
    },
    textContainer: {
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        zIndex: 2,
    },
    episodeImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    episodesContainer: {
        zIndex: 100,
        top: '10%',
        position: 'absolute',
        width: '70%', 
    }
})