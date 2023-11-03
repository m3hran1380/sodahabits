import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import generalStyles, { availableScreenWidth2, colors } from '../../../../styles/generalStyle';
import UserSettingIcon from '../../../../../assets/svgs/Icons/optionIcons/user-setting.svg';
import Animated, {FadeIn, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg'
import { useSelector, useDispatch } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { updateUserPFPURI } from '../../../../businessLogic/firestoreFunctions';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firestore/firestoreConfig';
import { setUser } from '../../../../features/userSlice';


const AccountInfoScreen = () => {
    const user = useSelector(state => state.user.currentUser);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);

    const dispatch = useDispatch();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    }
    
    const handleImageUpload = async () => {
        setUploading(true);
        const fetchImage = await fetch(image);
        const imageBlob = await fetchImage.blob();
        const imageName = new Date().toISOString();
        const uploadTask = uploadBytesResumable(ref(storage, `images/${user.uid}/pfp/${imageName}`), imageBlob);
        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.log("error during file upload to firebase ", error);
            }, 
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    updateUserPFPURI(user.uid, downloadURL, imageName).then(() => {
                        dispatch(setUser({pfpUrl: downloadURL}));
                        setUploading(false);
                        setImage(null);
                        setProgress(0);
                    });
                }).catch(error => console.log("error while getting the image URI from camera screen ", error));
            }
        )
    }

    const progressBarStyle = useAnimatedStyle(() => {
        return {
            height: '100%',
            width: withTiming(`${progress}%`),
            backgroundColor: '#59B9FF',
            borderRadius: 10,
        }
    })

    return (
        <Animated.View entering={FadeIn.duration(1000)} style={styles.container}>
            <View style={styles.titleContainer}>
                <UserSettingIcon width={25} height={25}/>
                <Text style={[generalStyles.normalText, styles.title]}>Account Information</Text>
            </View>
            <View style={styles.pfpContainer}>
                <View style={styles.imageContainer}>
                    {image ?
                        <Image resizeMode='contain' source={{ uri: image }} style={styles.pfpImage} />
                    :
                    <>
                    { user?.pfpUrl ? 
                        <Image resizeMode='contain' source={{ uri: user.pfpUrl }} style={styles.pfpImage} />
                        :
                        <DefaultPFP width='100%' height='100%' style={styles.pfpImage} />
                    }
                    </>}
                </View>
                {image ? 
                <View style={styles.buttonContainer}>
                    {uploading ?
                    <View style={styles.progressBarContainer}>
                        <Animated.View style={progressBarStyle} />
                    </View>
                    :
                    <>
                    <Pressable onPress={() => {setImage(null)}} style={[styles.imageChangeBtnContainer, {backgroundColor: 'red'}]}>
                        {({pressed}) => <Text style={{color: pressed ? 'black' : 'white'}}>Discard</Text>}
                    </Pressable>
                    <Pressable onPress={handleImageUpload} style={[styles.imageChangeBtnContainer, {backgroundColor: colors.colorSuccess}]}>
                        {({pressed}) => <Text style={{color: pressed ? 'black' : 'white'}}>Confirm</Text>}
                    </Pressable>
                    </>}
                </View>
                :
                <Pressable onPress={pickImage} style={styles.imageChangeBtnContainer}>
                    {({pressed}) => <Text style={{color: pressed ? 'black' : 'white'}}>{user?.pfpUrl ? 'Change image' : 'Add image'}</Text>}
                </Pressable>
                }
            </View>
        </Animated.View>
    )
}

export default AccountInfoScreen

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingVertical: '10%',
        paddingHorizontal: '13%',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontSize: 15,
        marginLeft: 10, 
    },
    pfpContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    imageContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        width: availableScreenWidth2/3,
        height: availableScreenWidth2/3,
        borderRadius: availableScreenWidth2/6,
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    imageChangeBtnContainer: {
        paddingVertical: 3,
        paddingHorizontal: 5,
        borderRadius: 10,
        backgroundColor: '#626262',
        top: -15,
        marginHorizontal: 2,
    },
    buttonContainer: {
        flexDirection: 'row',  
    },
    progressBarContainer: {
        height: 20,
        width: availableScreenWidth2/3,
        padding: 2,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
    }
})