import { StyleSheet, Text, View } from 'react-native'
import generalStyles, { actualScreenHeight, availableScreenWidth2, colors } from '../../../styles/generalStyle';
import SocialFeedPosts from '../../../components/sharedComponents/SocialFeedPosts';
import { useSelector } from 'react-redux';
import GroupScreenInfo from '../../../components/ScreensComponents/SocialComponents/groupComponents/GroupScreenInfo';


const GroupScreen = ({ route }) => {
    const user = useSelector(state => state.user.currentUser);
    const { groupData } = route.params; 

    return (
        <View style={styles.parentContainer}>
            <View style={styles.postsContainer}>
                <SocialFeedPosts 
                    ListHeaderComponent={<GroupScreenInfo groupData={groupData} />}
                    userIds={groupData.members.filter(id => id !== user.uid)} 
                />
            </View>
        </View>
    )
}

export default GroupScreen

const styles = StyleSheet.create({
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary,
        paddingHorizontal: 20,
    },
    postsContainer: {
        flex: 1,
        paddingTop: 70,
        paddingBottom: 60,
    }
})