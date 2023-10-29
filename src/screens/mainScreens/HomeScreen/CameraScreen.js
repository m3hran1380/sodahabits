import { StyleSheet, Text, View, Linking, Pressable, AppState } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toggleCamera } from '../../../features/appSlice';
import CameraCanIcon from '../../../../assets/svgs/Icons/cameraIcons/requestIcon.svg';
import generalStyles, { actualScreenHeight, actualScreenWidth } from '../../../styles/generalStyle';
import { Ionicons, MaterialIcons } from '@expo/vector-icons/';
import TextButton from '../../../components/authComponents/TextButton';


const CameraScreen = () => {
    const [appState, setAppState] = useState(AppState.currentState);
    const [type, setType] = useState(CameraType.back);
    const [cameraPermission, setCameraPermission] = useState(null);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [image, setImage] = useState(null);

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
        if (cameraPermission?.canAskAgain) {
            checkCameraPermissions();
        }
        else {
            await Linking.openSettings();
        }
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
                console.log("image data ", data);
                setImage(data.uri);
            }
            catch (error) {
                console.log("error while taking picture ", error);
            }
        }
    }


    return (
        <View style={styles.container}>
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
                <View style={styles.cameraFlipIcon}>
                    <Pressable onPress={toggleCameraType}>
                        {({pressed}) => (
                            <MaterialIcons size={40} name='flip-camera-ios' style={{color: pressed ? 'grey' : 'white'}} />
                        )}
                    </Pressable>
                </View>
                <View style={styles.mainCameraIcons}>
                    <Pressable>
                        <MaterialIcons size={50} name='photo-library' style={{color: 'white'}} />
                    </Pressable>
                    <Pressable onPress={takePicture} disabled={!cameraPermission?.granted}>
                        {({pressed}) => (
                            <View style={[styles.cameraBtnContainer, !cameraPermission?.granted && {borderColor: 'grey'}]}>
                                <View style={[styles.cameraBtn, (pressed || !cameraPermission?.granted)  && {backgroundColor: 'grey'}]} />
                            </View>
                        )}
                    </Pressable>
                    <Pressable disabled={!cameraPermission?.granted} onPress={toggleFlash}>
                        <Ionicons size={50} name={flash ? 'flash' : 'flash-off'} style={{color: !cameraPermission?.granted ? 'grey' : 'white'}} /> 
                    </Pressable>
                </View>
            </View>     
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
    cameraFlipIcon: {
        alignItems: 'center',
    }
});