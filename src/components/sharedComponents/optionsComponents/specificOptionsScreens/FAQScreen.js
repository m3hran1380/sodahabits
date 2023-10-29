import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../../../styles/generalStyle';
import FAQIcon from '../../../../../assets/svgs/Icons/optionIcons/faq.svg';
import Animated, {FadeIn} from 'react-native-reanimated';


const FAQScreen = () => {
    return (
        <Animated.View entering={FadeIn.duration(1000)} style={styles.container}>
            <View style={styles.titleContainer}>
                <FAQIcon width={25} height={25}/>
                <Text style={[generalStyles.normalText, styles.title]}>FAQ</Text>
            </View>
        </Animated.View>
    ) 
}

export default FAQScreen

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
})