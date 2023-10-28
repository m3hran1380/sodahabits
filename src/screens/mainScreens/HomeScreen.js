import { StyleSheet, Image, View, Button } from 'react-native'
import { signOut } from 'firebase/auth';
import { auth } from '../../firestore/firestoreConfig';
import generalStyles, { colors } from '../../styles/generalStyle';
import { LinearGradient } from 'expo-linear-gradient';
import { actualScreenWidth } from '../../styles/generalStyle';
import { useSelector } from 'react-redux';
import HabitItem from '../../components/ScreensComponents/HomeComponents/habitComponents/HabitItem';
import DaysLabel from '../../components/ScreensComponents/HomeComponents/habitComponents/DaysLabel';


const HomeScreen = () => {
    const user = useSelector((state) => state.user.currentUser);
    const locationImage = require('../../../assets/images/locations/FevalaHome.png');

    return (
        <View style={styles.parentContainer}>
            <View style={styles.locationBackgroundContainer}>
                <Image source={locationImage} style={styles.locationBackground} />
                <LinearGradient 
                    start={{x:0, y:0.9}} 
                    end={{x:0, y:0}} 
                    colors={[colors.backgroundColorPrimary, 'transparent']} 
                    style={styles.fade} 
                />
            </View>
            <View style={[styles.container, {paddingTop: 0}]}>
                <DaysLabel />
                {
                    // render the primary habits
                    Object.keys(user.todayHabits.habits.primary).map(key => {
                        return ({
                            habitName: user.todayHabits.habits.primary[key].name,
                            habitStatus: user.todayHabits.habits.primary[key].status,
                        })
                    }).map(({habitName, habitStatus}, index) => {
                        return <HabitItem key={index} habitIndex={index} habitStatus={habitStatus} habitName={habitName} primary={true} />
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
    },
    fade: {
        bottom: 0,
        height: 100,
        width: actualScreenWidth,
        position: 'absolute',
        zIndex: 2,
    }
})