import { StyleSheet, Text, View, Modal, Pressable, FlatList } from 'react-native';
import CloseIcon from '../../../../../assets/svgs/Icons/socialFeedIcons/closeHabit.svg';
import generalStyles, { availableScreenWidth2, textStyle } from '../../../../styles/generalStyle';
import { useSelector } from 'react-redux';
import FriendItem from '../../SocialComponents/friendComponents/FriendItem';
import { useEffect, useState } from 'react';


const PostLikesOverlay = ({ setShowLikesOverlay, likesUserIds }) => {
    const {friendsList} = useSelector(state => state.friends);
    const [likeData, setLikeData] = useState([]);


    useEffect(() => {
        const userLikeData = likesUserIds.map((id) => friendsList.find(friend => friend.id === id));
        setLikeData(userLikeData);
    }, [likesUserIds, setLikeData])


    return (
        <Modal transparent={true}>
            <Pressable onPress={() => setShowLikesOverlay(false)} style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Likes</Text>
                        <Pressable style={styles.closeBtnContainer} onPress={() => setShowLikesOverlay(false)}><CloseIcon height='100%' /></Pressable>
                    </View>
                    {!likesUserIds.length &&
                        <Text style={styles.text}>You haven't received any likes on your post yet.</Text>
                    }
                    <FlatList
                        data={likeData}
                        numColumns={3}
                        renderItem={({item}) => <FriendItem userData={item} />} 
                        keyExtractor={(item) => item.id}
                    />
                </View> 
            </Pressable>
        </Modal>
    )
}

export default PostLikesOverlay

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerContainer: {
        paddingVertical: '15%',
        width: availableScreenWidth2,
        height: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerText: {
        ...generalStyles.h2,
        color: 'white'
    },
    closeBtnContainer: {
        height: availableScreenWidth2/10,
    },
    text: {
        ...textStyle.allText,
        color: 'white',
        marginTop: '5%',
        fontSize: 16,
    }
})