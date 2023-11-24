import { StyleSheet, Text, View, Pressable, FlatList } from 'react-native';
import generalStyles, { actualScreenWidth } from '../../../../styles/generalStyle';
import PlusIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/plus.svg';
import SearchIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/search.svg';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import GroupItem from './GroupItem';


const GroupsMenu = ({ style }) => {
    const { groups } = useSelector(state => state.groups);
    const navigation = useNavigation();

    return (
        <View style={style}>
            <View style={styles.headerContainer}>
                <Text style={generalStyles.h2}>Groups</Text>
                <View style={styles.iconsContainer}>
                    <Pressable onPress={() => {navigation.navigate('social search screen')}}>
                        <SearchIcon width={27} height={27}/>
                    </Pressable>
                    <Pressable onPress={() => {navigation.navigate('group creation navigator')}}>
                        <PlusIcon width={27} height={27}/>
                    </Pressable>
                </View> 
            </View>
            <View style={styles.groupsContainer}>
                <FlatList 
                    data={groups}
                    renderItem={({item, index}) => <GroupItem lastIndex={groups.length - 1} groupData={item} index={index} /> }
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                />
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
        height: 40,
        paddingHorizontal: 20,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
})