import { StyleSheet, SafeAreaView, View, Text, FlatList, Pressable } from 'react-native';
import generalStyles, { actualScreenHeight, actualScreenWidth, availableScreenWidth2, colors, textStyle } from '../../../../styles/generalStyle';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import GroupFriendItem from '../../../../components/ScreensComponents/SocialComponents/groupComponents/GroupFriendItem';
import BackButtonIcon from '../../../../../assets/svgs/Icons/socialIcons/friendIcons/backButton.svg';
import { setInvitation } from '../../../../features/groupSlice';


const InviteFriendsScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const { image, groupName } = route.params;
    const {friendsList} = useSelector(state => state.friends);
    const {friendsToInvite} = useSelector(state => state.groups);

    const handleSelect = (id) => {
        if (friendsToInvite.includes(id)) {
            dispatch(setInvitation(friendsToInvite.filter(prevId => prevId !== id)));
        } else {
            dispatch(setInvitation([...friendsToInvite, id]));
        }
    };

    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                <View style={styles.headerTextContainer}>
                    <Text style={[generalStyles.h2, styles.headerText]}>Invite friends</Text>
                </View>

                <View style={styles.listContainer}>
                    <FlatList
                        data={friendsList}
                        numColumns={3}
                        renderItem={({item}) => <GroupFriendItem userData={item} handleSelect={handleSelect} />} 
                        keyExtractor={(item) => item.id}
                    />
                </View>

                <View style={styles.nextBtnContainer}>
                    <Pressable 
                        onPress={() => navigation.navigate('group overview screen', {groupName: groupName, image: image})} 
                        style={styles.nextBtn}
                    >
                        {({pressed}) => 
                            <Text style={[styles.nextBtnText, pressed && {color: 'black'}]}>Next</Text>
                        }
                    </Pressable>
                    <Pressable style={styles.backBtn} onPress={() => {navigation.goBack()}}><BackButtonIcon width='100%' height='100%' /></Pressable>
                </View>

            </SafeAreaView>
        </View>
    )
}

export default InviteFriendsScreen

const styles = StyleSheet.create({
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary,
    },
    container: {
        paddingTop: 40,
        alignItems: 'center'
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    headerText: {
        color: 'white',
        textAlign: 'left',
        bottom: 5,
    },
    nextBtn: {
        paddingVertical: 1,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 0.5,
        backgroundColor: '#59B9FF',
    },
    nextBtnText: {
        ...textStyle.allTextBold,
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
    listContainer: {
        height: ((availableScreenWidth2/3) * 4) + 20,
    },
    nextBtnContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 1,
        position: 'absolute',
        width: availableScreenWidth2,
        bottom: 50 + (actualScreenHeight * 0.05)
    },
    backBtn: {
        height: 20,
        width: 20,
        position: 'absolute',
        right: 0,
    },
})