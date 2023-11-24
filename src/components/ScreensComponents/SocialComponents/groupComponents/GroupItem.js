import { StyleSheet, Text, View, Image } from 'react-native'
import { actualScreenHeight, actualScreenWidth, availableScreenWidth2 } from '../../../../styles/generalStyle';
import DefaultGroup from '../../../../../assets/svgs/defaultGroup.svg';
import { LinearGradient } from 'expo-linear-gradient';


const GroupItem = ({ groupData, index, lastIndex }) => {
    return (
        <View style={[styles.container, (index === 0) && {marginLeft: 20}, (lastIndex === index) && { marginRight: 20 }]}>
            {groupData?.groupImage ?
                <Image resizeMode='contain' source={{ uri: groupData.groupImage }} style={styles.pfpImage} />
                :
                <DefaultGroup width='100%' height='100%' />
            }
            <LinearGradient 
                start={{x:0, y:0.9}} 
                end={{x:0, y:0}} 
                colors={['black', 'transparent']} 
                style={styles.fade} 
            />
            <Text style={styles.groupName}>{groupData.name}</Text>
        </View>
    )
}

export default GroupItem

const styles = StyleSheet.create({
    container: {
        width: actualScreenHeight - (availableScreenWidth2 + 55 + 60 + 95) - 40,
        height: actualScreenHeight - (availableScreenWidth2 + 55 + 60 + 95) - 40,
        borderRadius: availableScreenWidth2/10,
        borderWidth: 1,
        borderColor: 'white',
        marginLeft: 10,
        overflow: 'hidden'
    },
    groupName: {
        color: 'white',
        textAlign: 'center',
        position: 'absolute',
        bottom: '5%',
        width: '100%',
        zIndex: 3,
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    fade: {
        bottom: 0,
        height: 100,
        width: actualScreenWidth,
        position: 'absolute',
        zIndex: 2,
    },
})