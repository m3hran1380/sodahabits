import { StyleSheet, SafeAreaView, View, Text, FlatList, Pressable, Image } from 'react-native';
import generalStyles, { actualScreenHeight, availableScreenWidth2, colors, textStyle } from '../../../../styles/generalStyle';
import GroupFriendItem from '../../../../components/ScreensComponents/SocialComponents/groupComponents/GroupFriendItem';
import BackButtonIcon from '../../../../../assets/svgs/Icons/socialIcons/friendIcons/backButton.svg';
import DefaultGroupPicture from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { useDispatch, useSelector } from 'react-redux';
import { useLayoutEffect, useState } from 'react';
import ModalSpinnerOverlay from '../../../../components/loadingSpinners/ModalSpinnerOverlay';
import { createGroup } from '../../../../businessLogic/firestoreFunctions';
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';
import { setInvitation } from '../../../../features/groupSlice';
import { storage } from '../../../../firestore/firestoreConfig';


const GroupOverviewScreen = ({ navigation, route }) => {
    const {friendsToInvite} = useSelector(state => state.groups);
    const {friendsList} = useSelector(state => state.friends);
    const {currentUser} = useSelector(state => state.user);
    const [friendsToInviteData, setFriendsToInviteData] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);
    const [error, setError] = useState(null);
    const { image, groupName } = route.params;

    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const data = friendsList.filter(friend => friendsToInvite.includes(friend.id));
        setFriendsToInviteData(data);
    }, [friendsToInvite]);

    const createGroupHandler = async () => {
        try {
            setShowSpinner(true);
            // upload pic //////////////////////
            if (image) {
                const fetchImage = await fetch(image);
                const imageBlob = await fetchImage.blob();
                const imageName = new Date().toISOString();
                const uploadTask = uploadBytesResumable(ref(storage, `groups/${groupName.toLowerCase()}/${imageName}`), imageBlob);
                uploadTask.on('state_changed', 
                    null,
                    (error) => {
                        console.log("error during file upload to firebase ", error);
                    }, 
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            createGroup(currentUser.uid, friendsToInvite, groupName, downloadURL).then(() => {
                                setShowSpinner(false);
                                dispatch(setInvitation([]));
                                navigation.navigate('social screen');
                            }).catch((error) => {
                                setError("A group with the same name was just created - change the name before you proceed!");
                                console.log(error);
                                setShowSpinner(false);
                            });
                        }).catch(error => console.log("error while getting the image URI from camera screen ", error));
                    }
                )
            }
            else {
                createGroup(currentUser.uid, friendsToInvite, groupName).then(() => {
                    setShowSpinner(false);
                    dispatch(setInvitation([]));
                    navigation.navigate('social screen');
                }).catch((error) => {
                    setError("A group with the same name was just created - change the name before you proceed!");
                    console.log(error);
                    setShowSpinner(false);
                });
            }
            //////////////////////////////////
        }
        catch (error) {
            setError("An unexpected error has occured!");
            console.log(error);
            setShowSpinner(false);
        }
    }

    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                <View style={styles.headerTextContainer}>
                    <Text style={[generalStyles.h2, styles.headerText]}>Group overview</Text>
                </View>

                <View style={styles.groupImageContainer}>
                    {image ?
                        <Image resizeMode='contain' source={{ uri: image }} style={styles.image} />
                    :
                        <DefaultGroupPicture width='100%' height='100%' style={styles.defaultImage} />
                    }
                </View>

                <Text style={[generalStyles.h3, styles.groupName]}>{groupName}</Text>
                <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>

                <View style={styles.listContainer}>
                    <FlatList
                        data={friendsToInviteData}
                        numColumns={3}
                        renderItem={({item}) => <GroupFriendItem userData={item} />} 
                        keyExtractor={(item) => item.id}
                    />
                </View>

                <View style={styles.nextBtnContainer}>
                    <Pressable 
                        onPress={createGroupHandler} 
                        style={styles.nextBtn}
                    >
                        {({pressed}) => 
                            <Text style={[styles.nextBtnText, pressed && {color: 'black'}]}>Create group</Text>
                        }
                    </Pressable>
                    <Pressable style={styles.backBtn} onPress={() => {navigation.goBack()}}><BackButtonIcon width='100%' height='100%' /></Pressable>
                </View>

            </SafeAreaView>

            {showSpinner && <ModalSpinnerOverlay />}
        </View>
    )
}

export default GroupOverviewScreen

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
    groupName: {
        color: 'white',
        textAlign: 'left',
        fontSize: 20,
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
        height: ((availableScreenWidth2/3) * 2) + 10,
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
    groupImageContainer: {
        width: availableScreenWidth2/2,
        height: availableScreenWidth2/2,
        borderRadius: availableScreenWidth2/10,
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: '#3C3C3C'
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
})