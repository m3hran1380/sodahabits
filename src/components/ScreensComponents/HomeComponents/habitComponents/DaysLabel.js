import { StyleSheet, Text, View } from 'react-native'
import generalStyles from '../../../../styles/generalStyle'

const DaysLabel = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}><Text style={styles.text}>M</Text></View>
            <View style={styles.textContainer}><Text style={styles.text}>T</Text></View>
            <View style={styles.textContainer}><Text style={styles.text}>W</Text></View>
            <View style={styles.textContainer}><Text style={styles.text}>T</Text></View>
            <View style={styles.textContainer}><Text style={styles.text}>F</Text></View>
            <View style={styles.textContainer}><Text style={styles.text}>S</Text></View>
            <View style={styles.textContainer}><Text style={styles.text}>S</Text></View>
        </View>
    )
}

export default DaysLabel

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,

    },
    text: {
        fontFamily: generalStyles.normalText.fontFamily,
        fontSize: 15, 
        color: 'white',
    },
    textContainer: {
        height: 20,
        width: 16,
        marginHorizontal: 2,
        justifyContent: 'center',
        alignItems: 'center',
    }
})