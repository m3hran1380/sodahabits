import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../../../styles/generalStyle';
import NotificationIcon from '../../../../../assets/svgs/Icons/optionIcons/notification.svg';
import Animated, {FadeIn} from 'react-native-reanimated';
import ToggleButton from '../ToggleButton';


const NotificationScreen = () => {
    return (
        <Animated.View entering={FadeIn.duration(1000)} style={styles.container}>
            <View style={styles.titleContainer}>
                <NotificationIcon width={25} height={25}/>
                <Text style={[generalStyles.normalText, styles.title]}>Notification Preferences</Text>
            </View>

            <View style={styles.groupContainer}>
                <Text style={[generalStyles.h3, styles.secondaryTitle]}>Friends</Text>
                <View style={styles.toggleTextContainer}>
                    <Text style={styles.text}>Nudges</Text>
                    <ToggleButton />
                </View>
                <View style={styles.toggleTextContainer}>
                    <Text style={styles.text}>Primary habit completions</Text>
                    <ToggleButton />
                </View>
                <View style={styles.toggleTextContainer}>
                    <Text style={styles.text}>Group habit completions</Text>
                    <ToggleButton />
                </View>
            </View>

            <View style={styles.groupContainer}>
                <Text style={[generalStyles.h3, styles.secondaryTitle]}>System</Text>
                <View style={styles.toggleTextContainer}>
                    <Text style={styles.text}>Push notifications</Text>
                    <ToggleButton />
                </View>
                <View style={styles.toggleTextContainer}>
                    <Text style={styles.text}>Email notifications</Text>
                    <ToggleButton />
                </View>
                <View style={styles.toggleTextContainer}>
                    <Text style={styles.text}>Reminders</Text>
                    <ToggleButton />
                </View>
            </View>
        </Animated.View>
    ) 
}

export default NotificationScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingVertical: '10%',
        paddingHorizontal: '13%',

    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 15,
        marginLeft: 10, 
    },
    toggleTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        color: 'white',
    },
    groupContainer: {
        marginTop: 50,
    },
    secondaryTitle: {
        textAlign: 'center',
        marginBottom: 5,
    }
})