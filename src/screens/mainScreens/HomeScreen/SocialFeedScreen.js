import { StyleSheet, View } from 'react-native'
import { actualScreenHeight, colors } from '../../../styles/generalStyle'
import { useCallback, useEffect, useState } from 'react';
import { GestureDetector, Gesture, FlatList } from 'react-native-gesture-handler';
import Animated, { Extrapolation, interpolate, runOnJS, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import ArrowDownIcon from '../../../../assets/svgs/Icons/screenTransitionIcons/downArrow.svg';
import { retrieveMorePosts } from '../../../businessLogic/firestoreFunctions';
import { useSelector } from 'react-redux';
import SocialPost from '../../../components/ScreensComponents/HomeComponents/socialFeedComponents/SocialPost';
import { Accelerometer } from 'expo-sensors';
import { debounce } from 'lodash';



const SocialFeedScreen = ({ navigation }) => {
    const {friendsList} = useSelector(state => state.friends);
    const startingPosition = useSharedValue(0);
    const positionMovement = useSharedValue(0);
    const [friendPosts, setFriendPosts] = useState([]);

    // ----------- following chunk of code is for the shake detection ------------------- //
    const [data, setData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
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
                    debouncedPostRetrieval();
                }
                last_x = x;
                last_y = y;
                last_z = z;
                setData(accelerometerData);
            }
        })

        return () => subscription.remove();
    })
    // ----------------------------------- END ---------------------------------------- //




    const swipeDownGesture = Gesture.Pan()
        .onStart((event) => {
            if (event.absoluteY > actualScreenHeight * 0.2) startingPosition.value = actualScreenHeight;
            else startingPosition.value = event.absoluteY;
        }) 
        .onChange((event) => {
            positionMovement.value = (event.absoluteY - startingPosition.value) <= 0 ? 0 : (event.absoluteY - startingPosition.value);
        })
        .onEnd((event)=>{
            const distancePulled = event.absoluteY - startingPosition.value;
            if (distancePulled > actualScreenHeight * 0.2) runOnJS(navigation.navigate)('home screen');
            else positionMovement.value = withTiming(0);
        })

    const animatedArrowStyle = useAnimatedStyle(() => {
        const positionChange = interpolate(positionMovement.value,
                [0, actualScreenHeight * 0.2],
                [0, 50],
                {extrapolateRight: Extrapolation.CLAMP}
            )
        return {
            transform: [
                {translateY: positionChange}
            ]
        }
    })


    // retrieve the latest posts - run only on start
    const retrievePosts = async (cursorDoc) => {
        const retrievedPosts = await retrieveMorePosts(friendsList.map(user => user.id), cursorDoc);
        // add the user data to its retrieved post data:
        const combinedData = retrievedPosts.map((post) => {
            return {
                habitsData: post,
                userData: friendsList.filter((friend) => friend.id === post.ownerId)[0]
            }
        })
        setFriendPosts([...friendPosts, ...combinedData]);
    }

    // debounced version of the retrivePosts function
    const debouncedPostRetrieval = useCallback(
        debounce((cursorDoc) => {
            retrievePosts(cursorDoc);
        }, 500),
    [])

    useEffect(() => {
        (async () => {
            await retrievePosts();
        })();
    }, []);


    const style = [
        [
            {top: '3%', left: '15%'},
            {top: '20%', right: '10%'},
            {bottom: 0, left: '30%'},
        ],
        [
            {top: 0, right: '10%'},
            {top: '16%', left: '12%'},
            {bottom: 0, right: '30%'},
        ]
    ];

    return (
        <GestureDetector gesture={swipeDownGesture}>
            <View style={styles.container}>
                <Animated.View style={[styles.arrowContainer, animatedArrowStyle]}>
                    <ArrowDownIcon />
                </Animated.View>    
                <FlatList 
                    data={friendPosts}
                    renderItem={({item, index}) => <SocialPost style={style[[index % 2 === 0 ? 0 : 1]]} userData={item.userData} habitsData={item.habitsData} />}
                    keyExtractor={(item) => item.habitsData.id}
                    style={styles.postList}
                />
            </View>
        </GestureDetector>
    )
}

export default SocialFeedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary,
    },
    arrowContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
    },
    postList: {
        marginTop: 40,
        marginBottom: 50,
    }
})