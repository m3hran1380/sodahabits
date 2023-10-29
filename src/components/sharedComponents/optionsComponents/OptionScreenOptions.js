import { StyleSheet, Pressable, View, Text } from 'react-native'
import UserSettingIcon from '../../../../assets/svgs/Icons/optionIcons/user-setting.svg';
import NotificationsIcon from '../../../../assets/svgs/Icons/optionIcons/notification.svg';
import BillingIcon from '../../../../assets/svgs/Icons/optionIcons/billing.svg';
import FAQIcon from '../../../../assets/svgs/Icons/optionIcons/faq.svg';
import FeedbackIcon from '../../../../assets/svgs/Icons/optionIcons/feedback.svg';
import LogoutIcon from '../../../../assets/svgs/Icons/optionIcons/logout.svg';
import Animated, {FadeIn} from 'react-native-reanimated';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firestore/firestoreConfig';


const OptionScreenOptions = ({ adjustedWidth, adjustedHeight, setSpecificOptionSelected, setLoggingOut, setSelectedScreenIndex }) => {

    const parentContainerStyle = {
        width: adjustedWidth,
        height: adjustedHeight,
        alignItems: 'center',
    }
    const iconsContainerStyle = {
        height: adjustedHeight,
        width: adjustedWidth / 2.05,
        paddingVertical: adjustedHeight * 0.025,
        justifyContent: 'space-between',
    }
    const labelsContainerStyle = {
        height: adjustedHeight * 0.7,
        width: adjustedWidth / 2.05,
        paddingVertical: adjustedHeight * 0.025,
        position: 'absolute',
        right: 0,
        alignItems: 'flex-end',
    }

    const optionsData = [
        {
            iconAdjustment: '11%',
            icon: UserSettingIcon, 
            labelAdjustment: '12%',
            labelText: ['Account info']
        },
        {
            iconAdjustment: '0%',
            icon: NotificationsIcon, 
            labelAdjustment: '15%',
            labelText: ['Notification Preferences']
        },
        {
            iconAdjustment: '1%',
            icon: BillingIcon, 
            labelAdjustment: '13%',
            labelText: ['Billing &', 'Subscription']
        },
        {
            iconAdjustment: '16%',
            icon: FAQIcon, 
            labelAdjustment: '10%',
            labelText: ['FAQ']
        },
        {
            iconAdjustment: '28%',
            icon: FeedbackIcon, 
            labelAdjustment: '0%',
            labelText: ['Feedback']
        }
    ];

    // option icon press handler functions:
    const handleSignOut = async () => {
        try {
            setLoggingOut(true);
            await signOut(auth);
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleOptionPressed = (index) => {
        setSpecificOptionSelected(true); 
        setSelectedScreenIndex(index);
    }


    return (
        <Animated.View entering={FadeIn.duration(500)} style={[styles.container, parentContainerStyle]}>
            <View style={iconsContainerStyle}>
                <View style={{height: '70%'}}>
                    {optionsData.map((optionData, index) => (
                        <Pressable 
                            onPress={() => {handleOptionPressed(index)}} 
                            key={index} style={[styles.iconContainer, {left: optionData.iconAdjustment}]}
                        >
                            <optionData.icon width='60%' height='60%' />
                        </Pressable>   
                    ))}
                </View> 
                <Pressable onPress={handleSignOut} style={[styles.iconContainer, {left: '35%'}]}>
                    <LogoutIcon width='50%' height='50%' />
                </Pressable>
            </View>

            <View style={labelsContainerStyle}>
                {optionsData.map((optionData, index) => (
                    <View key={index} style={[styles.labelContainer, {right: optionData.labelAdjustment}]}>
                        {optionData.labelText.map((text, index) => (
                            <Text key={index} style={styles.labelText}>{text}</Text>
                        ))}
                    </View> 
                ))}
            </View>
        </Animated.View>
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
    labelContainer: {
        height: '20%',
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelText: {
        color: 'white'
    }
})