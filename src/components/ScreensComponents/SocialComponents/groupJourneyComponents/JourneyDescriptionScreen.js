import { StyleSheet, Text, View, Image } from 'react-native';
import CanTabs from '../../../../../assets/svgs/Icons/groupJourneyIcons/rewards/canTabs.svg';
import SaharaBadge from '../../../../../assets/svgs/Icons/groupJourneyIcons/rewards/saharaBadge.svg';
import SaharaCan from '../../../../../assets/svgs/Icons/groupJourneyIcons/rewards/saharaCan.svg';
import BlueButton from '../../../buttons/BlueButton';
import { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';


const JourneyDescriptionScreen = ({ setShowInviteScreen }) => {
    
    const episodeDetails = {
        episodeNumber: 'EP.1',
        episodeName: 'Wreckage',
        episodeImage: require('../../../../../assets/svgs/backgrounds/journeyBackgrounds/episodes/ep1.png'),
        episodeDescription: 'You and your crew crash land in the middle of the Sahara, you need search through the wreckage together to find fuel for the cold nights ahead.'
    } 

    const onPress = () => {
        setShowInviteScreen(true);
    }


    return (
        <>
            <View style={styles.imageContainer}>
                <Image source={episodeDetails.episodeImage} style={styles.episodeImage} />
            </View>
            <Text style={styles.episodeName}>{episodeDetails.episodeNumber} {episodeDetails.episodeName}</Text>
            <Text style={styles.episodeDescription}>{episodeDetails.episodeDescription}</Text>
            <Text style={[styles.episodeName, {fontSize: 20}]}>Rewards:</Text>

            <View style={styles.rewardContainer}>
                <View style={[styles.tabRewardContainer, styles.rewardInnerContainer]}>
                    <CanTabs width='50%' height='50%' />
                    <Text style={styles.tabAmounts}>500</Text>
                </View>
                <View style={styles.rewardInnerContainer}><SaharaCan width='57%' height='100%'/></View>
                <View style={styles.rewardInnerContainer}><SaharaBadge width='100%' height='100%'/></View>
            </View>

            <BlueButton label='Start' onPress={onPress} style={{paddingHorizontal: 25, marginTop: 20,}}/>
        </>
    )
}

export default JourneyDescriptionScreen

const styles = StyleSheet.create({
    episodeImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    imageContainer: {
        width: availableScreenWidth2 * 0.6,
        height: availableScreenWidth2 * 0.6,
        overflow: 'hidden',
        borderRadius: 15,
    },
    episodeName: {
        color: 'white',
        ...textStyle.allTextBold,
        textAlign: 'center',
        fontSize: 22,
        marginVertical: 10,
    },
    episodeDescription: {
        color: 'white',
        ...textStyle.allText,
        textAlign: 'center',
        fontSize: 16,
        paddingHorizontal: 20,
    },
    tabRewardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },  
    tabAmounts: {
        color: 'white',
        fontSize: 30,
        ...textStyle.allText,
        textAlign: 'center',
    },
    rewardContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rewardInnerContainer: {
        width: availableScreenWidth2 / 4,
        height: availableScreenWidth2 / 4,
        alignItems: 'center',
        justifyContent: 'center'
    }
})