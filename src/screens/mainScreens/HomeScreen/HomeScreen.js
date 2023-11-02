import { Pressable, StyleSheet, View } from 'react-native'
import generalStyles, { colors } from '../../../styles/generalStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { actualScreenWidth } from '../../../styles/generalStyle';
import { useSelector } from 'react-redux';
import HabitItem from '../../../components/ScreensComponents/HomeComponents/habitComponents/HabitItem';
import DaysLabel from '../../../components/ScreensComponents/HomeComponents/habitComponents/DaysLabel';
import LottieView from 'lottie-react-native';
import { calculateAdjustedDimensions } from '../../../businessLogic/utilityFunctions';


const [lottieWidth, lottieHeight] = calculateAdjustedDimensions(1804, 1787);


const HomeScreen = () => {
    const user = useSelector((state) => state.user.currentUser);

    return (
        <View style={styles.parentContainer}>
            <View style={styles.locationBackgroundContainer}>
                <LottieView 
                    source={require('../../../../assets/lottie/properties/favelapropertyOptimisedLottie.json')}
                    width={lottieWidth}
                    height={lottieHeight}
                    loop={true}
                    autoPlay={true}
                />
                <LinearGradient 
                    start={{x:0, y:0.9}} 
                    end={{x:0, y:0}} 
                    colors={[colors.backgroundColorPrimary, 'transparent']} 
                    style={styles.fade} 
                />
            </View>

            <View style={[styles.containerNoMargin, {paddingTop: 0}]}>
                <DaysLabel />
                {
                    // render the primary habits
                    Object.keys(user.todayHabits.habits.primary).map(key => {
                        return ({
                            habitName: user.todayHabits.habits.primary[key].name,
                            habitStatus: user.todayHabits.habits.primary[key].status,
                            habitNotes: user.todayHabits.habits.primary[key].notes,
                            habitImageUrl: user.todayHabits.habits.primary[key].imageUrl,
                        })
                    }).map((habitData, index) => {
                        return (
                            <HabitItem 
                                key={index} 
                                habitIndex={index} 
                                habitData={habitData}
                                primary={true} 
                            />
                        )
                    })
                }
            </View>
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    ...generalStyles,
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary
    },
    locationBackground: {
        width: actualScreenWidth,
        height: '100%',
    },
    locationBackgroundContainer: {
        height: '45%',
        overflow: 'hidden'
    },
    fade: {
        bottom: 0,
        height: 100,
        width: actualScreenWidth,
        position: 'absolute',
        zIndex: 2,
    }
})