import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import DefaultHabitPicture from '../../../../../assets/svgs/defaultHabit.svg'
import { availableScreenWidth2 } from '../../../../styles/generalStyle'


const SocialPostHabitItem = ({ habitData, style }) => {

    return (
        <View style={[styles.container, style]}>
            <View style={styles.imageContainer}>
                { habitData?.imageUrl ? 
                    <Image resizeMode='contain' source={{ uri: habitData.imageUrl }} style={styles.habitImage} />
                    :
                    <DefaultHabitPicture width='100%' height='100%' style={styles.habitImage} />
                }
            </View>
        </View>
    )
}

export default SocialPostHabitItem

const styles = StyleSheet.create({
    container: {
        width: availableScreenWidth2/3.5,
        position: 'absolute',
    },
    imageContainer: {
        height: availableScreenWidth2/3.3,
        width: availableScreenWidth2/3.3,
        borderRadius: (availableScreenWidth2/6),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 1.5,
    },
    habitImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },

})