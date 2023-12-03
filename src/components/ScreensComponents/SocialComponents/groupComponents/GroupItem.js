import { StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { actualScreenHeight, actualScreenWidth, availableScreenWidth2 } from '../../../../styles/generalStyle';
import DefaultGroup from '../../../../../assets/svgs/defaultGroup.svg';
import MembersIcon from '../../../../../assets/svgs/Icons/socialIcons/groupIcons/members.svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { respondToGroupInvite } from '../../../../businessLogic/firestoreFunctions';
import { useNavigation } from '@react-navigation/native';


const GroupItem = ({ groupData, index, lastIndex }) => {

    const [showInvitationOptions, setShowInvitationOptions] = useState(false);
    const navigation = useNavigation();
    
    const groupPressed = () => {
        if (groupData?.invitation) {
            setShowInvitationOptions(val => !val);
        }
        else {
            navigation.navigate('group screen', {groupData: groupData});
        }
    }

    const respondToInvitation = async (response) => {
        await respondToGroupInvite(groupData.notificationId, response);
        setShowInvitationOptions(val => !val);
    }

    return (
        <Pressable onPress={groupPressed} style={[styles.container, (groupData.invitation) && {borderColor: '#59B9FF'},
         (index === 0) && {marginLeft: 20}, (lastIndex === index) && { marginRight: 20 }]}>
            {groupData?.groupImage ?
                <Image resizeMode='contain' source={{ uri: groupData.groupImage }} style={styles.pfpImage} />
                :
                <DefaultGroup width='100%' height='100%' />
            }
            <LinearGradient 
                start={{x:0, y:0.95}} 
                end={{x:0, y:0}} 
                colors={['black', 'transparent']} 
                style={styles.fade} 
            />
            <LinearGradient 
                start={{x:0, y:0}} 
                end={{x:0, y:0.5}} 
                colors={['black', 'transparent']} 
                style={styles.fade2} 
            />
            <View style={styles.memberCount}>
                <MembersIcon height='65%' />
                <Text style={styles.text}></Text>
            </View>
            <Text style={styles.groupName}>{groupData.name}</Text>
            {showInvitationOptions &&
                <View style={styles.groupInviteOptions}>
                    <Pressable onPress={() => respondToInvitation('accepted')} style={styles.optionBtn}>
                        <Text style={styles.options}>{String.fromCodePoint('0x1F44D')}</Text>
                    </Pressable>
                    <Pressable onPress={() => respondToInvitation('rejected')} style={styles.optionBtn}>
                        <Text style={styles.options}>{String.fromCodePoint('0x1F44E')}</Text>
                    </Pressable>
                </View>
            }
        </Pressable>
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
    fade2: {
        top: 0,
        height: 100,
        width: actualScreenWidth,
        position: 'absolute',
        zIndex: 2,
    },
    memberCount: {
        position: 'absolute',
        zIndex: 3,
        top: '8%',
        right: '12%',
        height: '20%',
        width: '100%',
        justifyContent: 'flex-end',
        flexDirection: 'row',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 17,
        top: '-3%',
    },
    groupInviteOptions: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 5,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    options: {
        fontSize: 20,
    },
    optionBtn: {
        marginHorizontal: 5,
    }
})