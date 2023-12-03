import { StyleSheet, View } from 'react-native'
import { availableScreenWidth2 } from '../../styles/generalStyle';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import { retrieveMorePosts } from '../../businessLogic/firestoreFunctions';
import { useSelector } from 'react-redux';
import SocialPost from '../ScreensComponents/HomeComponents/socialFeedComponents/SocialPost';
import LoadingSpinner from '../ScreensComponents/HomeComponents/socialFeedComponents/LoadingSpinner';
import { Accelerometer } from 'expo-sensors';
import { debounce } from 'lodash';


const SocialFeedPosts = ({ userIds, ListHeaderComponent }) => {
    const {friendsList} = useSelector(state => state.friends);
    const user = useSelector(state => state.user.currentUser); 
    const [friendPosts, setFriendPosts] = useState([]);
    const [allRetrieved, setAllRetrieved] = useState(false);

    const flashListRef = useRef(null);

    // ----------- following chunk of code is for the shake detection ------------------- //
    let lastUpdate = Date.now();
    let last_x = 0;
    let last_y = 0;
    let last_z = 0;

    const ShakeThreshold = 250;

    useEffect(() => {
        Accelerometer.setUpdateInterval(100);

        const subscription = Accelerometer.addListener(accelerometerData => {
            let { x, y, z } = accelerometerData;
            let currentTime = Date.now();
            if (currentTime - lastUpdate > 100) {
                let timeDifference = currentTime - lastUpdate;
                lastUpdate = currentTime;
        
                let deltaX = Math.abs(x - last_x);
                let deltaY = Math.abs(y - last_y);
                let deltaZ = Math.abs(z - last_z);
                let speed = (deltaX + deltaY + deltaZ) / timeDifference * 10000;
        
                if (speed > ShakeThreshold) {
                    debouncedPostRetrieval(undefined, true);
                }
                last_x = x;
                last_y = y;
                last_z = z;
            }
        })

        return () => subscription.remove();
    })
    // ----------------------------------- END ---------------------------------------- //


    // retrieve the latest posts - run only on start
    const retrievePosts = async (cursorDoc, reset) => {
        const retrievedPosts = await retrieveMorePosts(user.uid, userIds, cursorDoc);

        // add the user data to its retrieved post data:
        const combinedData = retrievedPosts.map((post) => {
            return {
                habitsData: post,
                userData: post.ownerId === user.uid ? user : friendsList.find((friend) => friend.id === post.ownerId),
                // following property indicates whether this post is user's post or his/her friends post:
                isPostOwner: post.ownerId === user.uid ? true : false,
            }
        })
        if (!retrievedPosts.length) setAllRetrieved(true);
        if (reset) { setFriendPosts(combinedData); setAllRetrieved(false) }
        else setFriendPosts((prevFriendPosts => [...prevFriendPosts, ...combinedData]));
    }

    // debounced version of the retrivePosts function
    const debouncedPostRetrieval = useCallback(
        debounce((cursorDoc, reset) => {
            retrievePosts(cursorDoc, reset);
        }, 500),
    [])

    useEffect(() => {
        (async () => {
            await retrievePosts();
        })();
    }, []);

    const style = [
        [
            {top: '3%', left: '4%'},
            {top: '10%', right: '10%'},
            {bottom: 0, left: '30%'},
        ],
        [
            {top: 0, right: '10%'},
            {top: '16%', left: '12%'},
            {bottom: 0, right: '30%'},
        ]
    ];

    const retrieveMore = () => {
        if (friendPosts.length && !allRetrieved) {
            debouncedPostRetrieval(friendPosts[friendPosts.length - 1]['habitsData']);
        }
    }

    const renderPost = useCallback(({item, index}) => 
        <SocialPost 
            style={style[[index % 2 === 0 ? 0 : 1]]} 
            userData={item.userData} 
            habitsData={item.habitsData}
            isPostOwner={item.isPostOwner}
            postIndex={index}
            flashListRef={flashListRef}
        />, 
        [])

    const keyExtractor = useCallback((item) => item.habitsData.id, [])

    return (
        <View style={styles.postList}>  
            <FlashList 
                ListHeaderComponent={ListHeaderComponent ? ListHeaderComponent : <></>}
                data={friendPosts}
                renderItem={renderPost}
                keyExtractor={keyExtractor}
                ListFooterComponent={allRetrieved ? <></> : <LoadingSpinner />}
                onEndReached={retrieveMore}
                onEndReachedThreshold={0}
                estimatedItemSize={availableScreenWidth2}
                ref={flashListRef}
                keyboardShouldPersistTaps='always'
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default SocialFeedPosts

const styles = StyleSheet.create({
    postList: {
        flex: 1, 
    }
})