import { StyleSheet, Text, View, Linking, Pressable, AppState, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCamera } from '../../../features/appSlice';
import CameraCanIcon from '../../../../assets/svgs/Icons/cameraIcons/requestIcon.svg';
import generalStyles, { actualScreenWidth } from '../../../styles/generalStyle';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons/';
import TextButton from '../../../components/authComponents/TextButton';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, FlipType } from 'expo-image-manipulator';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firestore/firestoreConfig';
import CanProgressionBar from '../../../components/sharedComponents/progressionBarComponents/CanProgressionBar';
import { updateHabitImageURI } from '../../../businessLogic/firestoreFunctions';
import { setUser } from '../../../features/userSlice';


const CameraScreen = ({ route, navigation }) => {
    const [appState, setAppState] = useState(AppState.currentState);
    const [type, setType] = useState(CameraType.back);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const user = useSelector(state => state.user.currentUser);
    const {habitIndex} = route.params;

    const dispatch = useDispatch();
    const cameraRef = useRef();
    
    // following use effect controls the appwide camera state - it runs on mount and dismount. 
    useEffect(() => {
        checkCameraPermissions();        
        dispatch(toggleCamera());
        return (() => {
            dispatch(toggleCamera());
        })
    }, []);

    // functions related to updating the camera permissions
    const checkCameraPermissions = useCallback(async () => {
        const permission = await Camera.getCameraPermissionsAsync();
        if (!permission.granted && permission.canAskAgain) {
            const requestedPermission = await Camera.requestCameraPermissionsAsync();
            setCameraPermission(requestedPermission);
        }
        setCameraPermission(permission);
    }, []);
    
    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (appState.match(/inactive|background/) && nextAppState === 'active') {
                checkCameraPermissions();
            }
            setAppState(nextAppState);
        });
        return () => {
            subscription.remove();
        };
    }, [appState]);
    // ------------------- END ---------------------------------

    const openSettings = useCallback(async () => {
        if (cameraPermission?.canAskAgain) checkCameraPermissions();
        else await Linking.openSettings();
    }, [])

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }
    const toggleFlash = () => {
        setFlash(current => (current === Camera.Constants.FlashMode.on ? Camera.Constants.FlashMode.off : Camera.Constants.FlashMode.on));
    }
 
    const takePicture = async () => {
        if (cameraRef) {
            try {
                const data = await cameraRef.current.takePictureAsync();
                let imageData = data.uri;
                // if a front facing photo is taken flip the photo to avoid it looking mirrored.
                if (type==='front') {
                    const manipulatedImage = await manipulateAsync(
                        data.uri,
                        [{flip: FlipType.Horizontal}]
                    )
                    imageData = manipulatedImage.uri;
                }
                setImage(imageData);
            }
            catch (error) {
                console.log("error while taking picture ", error);
            }
        }
    }

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
        const uploadTask = uploadBytesResumable(ref(storage, `images/${user.uid}/${new Date().toISOString()}`), imageBlob);
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
                    updateHabitImageURI(user.uid, habitIndex, downloadURL).then((updatedHabitObject) => {
                        dispatch(setUser(updatedHabitObject));
                        navigation.navigate('home screen');
                    });
                }).catch(error => console.log("error while getting the image URI from camera screen ", error));
            }
        )
    }


    return (
        <View style={styles.container}>
            <>
            {image ? 
                <>
                {uploading ?
                    <CanProgressionBar progress={progress} />
                    :
                    <View style={styles.selectedImageContainer}>
                        <View style={styles.selectedImageBtnContainer}>
                            <Pressable onPress={() => {setImage(null)}}>
                                {({pressed}) => <Feather size={40} name='x' style={{color: pressed ? 'grey' : 'white'}}/>}
                            </Pressable>
                            <TextButton onPress={handleImageUpload} style={{fontSize: 25}} nounderline={true}>Upload</TextButton>
                        </View>
                        <Image source={{uri: image}} style={styles.selectedImage} />
                    </View>
                }
                </>
            :
            <>
            {cameraPermission?.granted ? 
                <Camera type={type} style={styles.camera} flashMode={flash} ref={cameraRef} ratio='1:1'/>
            :
                <View style={styles.permissionRequestContainer}>
                    <CameraCanIcon width={100} height={100} />
                    <Text style={[generalStyles.h2, styles.text]}>Allow SodaHabits to access your camera</Text>
                    <Text style={[generalStyles.normalText, styles.text]}>This lets you take and share photos on the app. You can change this at any time in your device settings.</Text>
                    <TextButton onPress={openSettings} style={{fontSize: 17}} nounderline={true}>Open Settings</TextButton>
                </View>
            }
            <View style={styles.cameraIcons}>
                {type === 'back' &&
                <View style={styles.flashIcon}>
                    <Pressable disabled={!cameraPermission?.granted} onPress={toggleFlash}>
                        <Ionicons size={50} name={flash ? 'flash' : 'flash-off'} style={{color: !cameraPermission?.granted ? 'grey' : 'white'}} /> 
                    </Pressable>
                </View>
                }
                <View style={styles.mainCameraIcons}>
                    <Pressable onPress={pickImage}>
                        <MaterialIcons size={50} name='photo-library' style={{color: 'white'}} />
                    </Pressable>
                    <Pressable onPress={takePicture} disabled={!cameraPermission?.granted}>
                        {({pressed}) => (
                            <View style={[styles.cameraBtnContainer, !cameraPermission?.granted && {borderColor: 'grey'}]}>
                                <View style={[styles.cameraBtn, (pressed || !cameraPermission?.granted)  && {backgroundColor: 'grey'}]} />
                            </View>
                        )}
                    </Pressable>
                    <Pressable onPress={toggleCameraType}>
                        {({pressed}) => (
                            <MaterialIcons size={40} name='flip-camera-ios' style={{color: pressed ? 'grey' : 'white'}} />
                        )}
                    </Pressable>
                </View>
            </View>    
            </> 
            }</>
        </View>
    )
}

export default CameraScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center'
    },
    permissionRequestContainer: {
        alignItems: 'center',
        paddingHorizontal: '5%',
        flex: 1,
        justifyContent: 'center',
    },
    cameraIcons: {
        height: 150,
        width: actualScreenWidth,
        position: 'absolute',
        zIndex: 10000,
        bottom: 10,
        paddingHorizontal: 20,
        justifyContent: 'flex-end'
    },
    mainCameraIcons: {
        height: 100, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cameraBtnContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraBtn: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    camera: {
        width: actualScreenWidth,
        height: actualScreenWidth,
        aspectRatio: 1,
        bottom: '10%'
    },
    flashIcon: {
        alignItems: 'center',
    },
    selectedImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedImage: {
        width: actualScreenWidth,
        height: actualScreenWidth,
        aspectRatio: 1,
    },
    selectedImageBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
        position: 'absolute',
        top: 10,
    }
});