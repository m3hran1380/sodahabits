import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { availableScreenWidth2 } from '../../../../styles/generalStyle';
import { useState } from 'react';
import { Canvas, Circle, RadialGradient, vec } from "@shopify/react-native-skia";
import AddUserIcon from '../../../../../assets/svgs/Icons/socialIcons/friendIcons/addUserIcon.svg'
import DefaultPFP from '../../../../../assets/svgs/defaultPfps/default1.svg';
import FriendRequestOverlay from '../../SocialComponents/friendComponents/FriendRequestOverlay';


const FriendItem = ({ userData }) => {
    const [friendRequestOverlay, setFriendRequestOverlay] = useState(false);

    const handleProfilePressed = () => {
        if (userData?.type) {
            setFriendRequestOverlay(true);
        }
    }

    return ( 
        <View style={styles.outermostContainer}>
            <Pressable onPress={handleProfilePressed} style={styles.pfpContainer}>
                {userData?.type && 
                    <Canvas style={styles.glowCanvas}>
                        <Circle cx={(availableScreenWidth2/3) * 0.5} cy={(availableScreenWidth2/3) * 0.5} r={(availableScreenWidth2/3) * 0.5}>
                            <RadialGradient
                                c={vec((availableScreenWidth2/3) * 0.5, (availableScreenWidth2/3) * 0.5)}
                                r={(availableScreenWidth2/3) * 0.5}
                                colors={['#55D5E7', '#55D5E7', '#55D5E7', '#55D5E7', 'transparent']}
                            />
                        </Circle>
                    </Canvas>
                }
                <View style={styles.imageContainer}>
                    { userData?.pfpUrl ? 
                        <Image resizeMode='contain' source={{ uri: userData.pfpUrl }} style={styles.pfpImage} />
                        :
                        <DefaultPFP style={styles.pfpImage} />
                    }
                </View>
                {userData?.type && 
                    <AddUserIcon width={'30%'} height={'30%'} style={styles.addUserIcon} />
                }
            </Pressable>
            <View style={styles.usernameContainer}><Text style={styles.text}>{userData.username}</Text></View>
            {friendRequestOverlay && <FriendRequestOverlay setFriendRequestOverlay={setFriendRequestOverlay} userData={userData} />}
        </View>
    )
}

export default FriendItem;


const styles = StyleSheet.create({
    outermostContainer: {
        marginBottom: 5,
    },
    pfpContainer: {
        width: availableScreenWidth2/3,
        height: availableScreenWidth2/3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        height: (availableScreenWidth2/3) * 0.7,
        width: (availableScreenWidth2/3) * 0.7,
        borderRadius: (availableScreenWidth2/3) * 0.35,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pfpImage: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    glowCanvas: {
        width: availableScreenWidth2/3, 
        height: availableScreenWidth2/3,
        position: 'absolute',
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
    addUserIcon: {
        position: 'absolute',
        top: '10%',
        right: '10%',
    },
    usernameContainer: {
        width: (availableScreenWidth2/3),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: (availableScreenWidth2/3) * 0.9,
    }
})