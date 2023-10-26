import { StyleSheet, Pressable, View, Text } from 'react-native'
import UserSettingIcon from '../../../../assets/svgs/Icons/optionIcons/user-setting.svg';
import NotificationsIcon from '../../../../assets/svgs/Icons/optionIcons/notification.svg';
import BillingIcon from '../../../../assets/svgs/Icons/optionIcons/billing.svg';
import FAQIcon from '../../../../assets/svgs/Icons/optionIcons/faq.svg';
import FeedbackIcon from '../../../../assets/svgs/Icons/optionIcons/feedback.svg';
import generalStyles from '../../../styles/generalStyle';


const OptionScreenOptions = ({ adjustedWidth, adjustedHeight }) => {

    const parentContainerStyle = {
        width: adjustedWidth,
        height: adjustedHeight,
    }
    const iconsContainerStyle = {
        height: adjustedHeight * 0.7,
        width: adjustedWidth / 2.05,
        paddingVertical: adjustedHeight * 0.025,
    }
    const labelsContainerStyle = {
        height: adjustedHeight * 0.7,
        width: adjustedWidth / 2.05,
        paddingVertical: adjustedHeight * 0.025,
        position: 'absolute',
        right: 0,
        alignItems: 'flex-end',
    }

    return (
        <View style={[styles.container, parentContainerStyle]}>
            <View style={iconsContainerStyle}>
                <Pressable style={[styles.iconContainer, styles.firstIcon]}>
                    <UserSettingIcon width='60%' height='60%' />
                </Pressable>

                <Pressable style={[styles.iconContainer, styles.secondIcon]}>
                    <NotificationsIcon width='60%' height='60%' />
                </Pressable>

                <Pressable style={[styles.iconContainer, styles.thirdIcon]}>
                    <BillingIcon width='60%' height='60%' />
                </Pressable>

                <Pressable style={[styles.iconContainer, styles.fourthIcon]}>
                    <FAQIcon width='60%' height='60%' />              
                </Pressable>

                <Pressable style={[styles.iconContainer, styles.fifthIcon]}>
                    <FeedbackIcon width='60%' height='60%' />
                </Pressable>
            </View>
            <View style={labelsContainerStyle}>
                <View style={[styles.labelContainer, styles.firstLabel]}>
                    <Text style={styles.labelText}>Account info</Text>
                </View>
                
                <View style={[styles.labelContainer, styles.secondLabel]}>
                    <Text style={styles.labelText}>Notification preferences</Text>
                </View>

                <View style={[styles.labelContainer, styles.thirdLabel]}>
                    <Text style={styles.labelText}>Billing &</Text>
                    <Text style={styles.labelText}>subscriptions</Text>
                </View>

                <View style={[styles.labelContainer, styles.fourthLabel]}>
                    <Text style={styles.labelText}>FAQs</Text>
                </View>

                <View style={[styles.labelContainer, styles.fifthLabel]}>
                    <Text style={styles.labelText}>Feedback</Text>
                </View>
            </View>
        </View>
    )
}

export default OptionScreenOptions

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        opacity: 0.9,
    },
    iconContainer: {
        height: '20%',
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    firstIcon: {
        left: '11%'
    },  
    secondIcon: {
        left: '0%'
    },
    thirdIcon: {
        left: '3%',
    },
    fourthIcon: {
        left: '13%'
    },
    fifthIcon: {
        left: '28%'
    },
    labelContainer: {
        height: '20%',
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red'
    },
    firstLabel: {
        right: '17%',
    },
    secondLabel: {
        right: '22%',
    },
    thirdLabel: {
        right: '18%',
    },
    fourthLabel: {
        right: '10%',
    },
    fifthLabel: {
        right: '2%',
    },
    labelText: {
        color: 'white'
    }
})