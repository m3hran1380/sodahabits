import { StyleSheet, Text, View } from 'react-native';
import generalStyles from '../../../../styles/generalStyle';
import PlusIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/plus.svg';
import SearchIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/search.svg';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const GroupsMenu = ({ style }) => {

    const navigation = useNavigation();

    return (
        <View style={style}>
            <View style={styles.headerContainer}>
                <Text style={generalStyles.h2}>Groups</Text>
                <View style={styles.iconsContainer}>
                    <Pressable onPress={() => {navigation.navigate('social search screen')}}>
                        <SearchIcon width={27} height={27}/>
                    </Pressable>
                    <Pressable>
                        <PlusIcon width={27} height={27}/>
                    </Pressable>
                </View> 
            </View>
        </View>
    )
}

export default GroupsMenu

const styles = StyleSheet.create({
    friendList: {
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})