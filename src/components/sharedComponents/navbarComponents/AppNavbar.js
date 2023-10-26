import { StyleSheet, View } from 'react-native';
import { actualScreenWidth } from '../../../styles/generalStyle';


const AppNavbar = () => {
    return (
        <View style={styles.container}>
        </View>
    )
}

export default AppNavbar

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        width: actualScreenWidth,
        height: 50,
        zIndex: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})