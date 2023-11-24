import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import generalStyles from '../../../../styles/generalStyle';
import { useSelector } from 'react-redux';
import FriendItem from './FriendItem';
import AddFriendIcon from '../../../../../assets/svgs/Icons/socialIcons/friendIcons/addFriend.svg';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const FriendsMenu = ({ style }) => {
    const {friendsList, incomingRequestsData} = useSelector(state => state.friends);
    // the following is the data of friends + incoming requests.
    const [combinedData, setCombinedData] = useState([]);    
    const navigation = useNavigation();


    // sort the incoming request data + friend data separately and combine them together. Do this everytime either list changes.
    useEffect(() => {
        const sortedFriends = friendsList.slice().sort((a, b) => a.username.localeCompare(b.username));
        const sortedIncomingRequestsData = incomingRequestsData.slice().sort((a, b) => a.username.localeCompare(b.username));
        const dataCombined = [...sortedIncomingRequestsData, ...sortedFriends];
        setCombinedData(dataCombined);
        
    }, [incomingRequestsData, friendsList, setCombinedData]);
    


    return (
        <View style={[styles.container, style]}>
            <View style={styles.headerContainer}>
                <Text style={generalStyles.h2}>Friends</Text>
                <Pressable onPress={() => {navigation.navigate('social search screen')}} style={styles.addIconContainer}>
                    <AddFriendIcon width={27} height={27}/>
                </Pressable>
            </View>
            <View style={styles.wrappableContainer}>
            {
                combinedData.map((item, index) => {
                    return (
                        <FriendItem key={index} userData={item} />
                    )
                })
            }
            </View>
        </View>
    )
}

export default FriendsMenu

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
    friendList: {
        width: '100%',
    },
    headerContainer: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addIconContainer: {
        justifyContent: 'center',
    },
    wrappableContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    }
})