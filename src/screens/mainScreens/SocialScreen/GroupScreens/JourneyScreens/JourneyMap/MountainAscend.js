import { StyleSheet, Text, View } from 'react-native';
import { actualScreenHeight, actualScreenWidth, textStyle } from '../../../../../../styles/generalStyle';
import MountainBackground from '../../../../../../../assets/svgs/backgrounds/journeyBackgrounds/mountainAscend.svg';

const MountainAscend = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Season 2</Text>
                <Text style={styles.title}>Coming Soon</Text>
            </View>
            <MountainBackground style={styles.planeCrash} />
        </View>
    )
}

export default MountainAscend

const styles = StyleSheet.create({
    container: {
        width: actualScreenWidth,
        height: actualScreenHeight,
        backgroundColor: '#B4CDD6'
    },
    planeCrash: {
        position: 'absolute',
        bottom: 0,
    },
    title: {
        color: 'white',
        ...textStyle.allTextBold,
        fontSize: 35,
        textAlign: 'center'
    },
    textContainer: {
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})
