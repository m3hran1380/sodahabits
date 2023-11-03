import { createStackNavigator } from '@react-navigation/stack';
import SocialScreen from './SocialScreen';
import SocialSearchScreen from './SocialSearchScreen';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends, setIncomingRequests, setOutgoingRequests, setIncomingRequestsData } from '../../../features/friendSlice';
import { onSnapshot, where, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../../../firestore/firestoreConfig';
import { getUsersById } from '../../../businessLogic/firestoreFunctions';


const Stack = createStackNavigator();

const SocialScreenNavigator = () => {
    const isFetching = useRef(false);
    const user = useSelector(state => state.user.currentUser);
    const {friendsList, incomingRequests, incomingRequestsData} = useSelector(state => state.friends);
    const dispatch = useDispatch();

    // setup a live listener on the incoming/outgoing friend requests
    useEffect(() => {
        isFetching.current = true;
        const incomingFriendRequestQuery = query(collection(db, 'friendrequests'),
         where('receiverId', '==', user.uid), where('status', '==', 'pending'), orderBy('timestamp', 'desc'));
        const unsubIncoming = onSnapshot(incomingFriendRequestQuery, (querySnapshot) => {
            const incomingRequests = [];
            querySnapshot.forEach((doc) => {
                const request = {id: doc.id, ...doc.data()};
                delete request.timestamp;
                incomingRequests.push(request);
            });
            dispatch(setIncomingRequests(incomingRequests));
            isFetching.current = false;
        }, (error) => console.log('error in incoming snapshot: ', error))

        const outgoingFriendRequestQuery = query(collection(db, 'friendrequests'),
         where('senderId', '==', user.uid), where('status', '==', 'pending'), orderBy('timestamp', 'desc'));
        const unsubOutgoing = onSnapshot(outgoingFriendRequestQuery, (querySnapshot) => {
            const outgoingRequests = [];
            querySnapshot.forEach((doc) => {
                const request = {id: doc.id, ...doc.data()};
                delete request.timestamp;
                outgoingRequests.push(request);
            });
            dispatch(setOutgoingRequests(outgoingRequests));
        }, (error) => console.log('error in outgoing snapshot: ', error))

        return () => {
            unsubIncoming();
            unsubOutgoing();
        }
    }, []);


    // this side effect runs everytime the incoming request changes - it retrieves the new requesting user's data
    useEffect(() => {
        if (!isFetching.current) {
            const incomingRequestsDataIds = new Set(incomingRequestsData.map(userData => userData.id));
            const incomingRequestsIds = new Set(incomingRequests.map(request => request.senderId));
            const areArraysEqual = incomingRequestsData.map(userData => userData.id).length === 
            incomingRequests.map(request => request.senderId).length && [...incomingRequestsDataIds].every(item => incomingRequestsIds.has(item));

            if (!areArraysEqual) {
                // find out if a new request has been added or removed
                if (incomingRequestsDataIds.size < incomingRequestsIds.size) {
                    const difference = [...incomingRequestsIds].filter(item => !incomingRequestsDataIds.has(item));
                    // retrieve the data for the new requesting users:
                    (async () => {
                        const usersData = await getUsersById(difference);
                        usersData.forEach(user => user.type = 'request')
                        const modifiedIncomingRequestsDataArray = [...incomingRequestsData, ...usersData];
                        dispatch(setIncomingRequestsData(modifiedIncomingRequestsDataArray));
                    })();
                }
                else {
                    const difference = [...incomingRequestsDataIds].filter(item => !incomingRequestsIds.has(item));
                    // dispatch new incoming requests data state:
                    const modifiedIncomingRequestsDataArray = incomingRequestsData.filter(item => !difference.includes(item.id));
                    dispatch(setIncomingRequestsData(modifiedIncomingRequestsDataArray));
                }
            }
        }
    }, [incomingRequests])


    // this side effect runs everytime the user state changes - it checks for changes in friends array.
    useEffect(() => {
        if (!user.friends) return;
        
        const currentFriendIds = friendsList.map((friend) => friend.id);
         // compare the updated user document's friends array to what we have in redux
        const currentFriendsSet = new Set(currentFriendIds);
        const retrievedFriendsSet = new Set(user.friends);

        const areArraysEqual = currentFriendIds.length === user.friends.length && 
            [...currentFriendsSet].every(item => retrievedFriendsSet.has(item));

        if (!areArraysEqual) {
            // find out if a friend has been added or removed
            if (currentFriendsSet.size < retrievedFriendsSet.size) {
                const difference = [...retrievedFriendsSet].filter(item => !currentFriendsSet.has(item));
                // retrieve the data for the new friends:
                (async () => {
                    const usersData = await getUsersById(difference);
                    const modifiedFriendsArray = [...friendsList, ...usersData];
                    dispatch(setFriends(modifiedFriendsArray));
                })();
            }
            else {
                const difference = [...currentFriendsSet].filter(item => !retrievedFriendsSet.has(item));
                // dispatch new friends state:
                const modifiedFriendsArray = friendsList.filter(item => !difference.includes(item.id));
                dispatch(setFriends(modifiedFriendsArray));
            }
        }
    }, [user])


    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen component={SocialScreen} name='social screen' />
            <Stack.Screen component={SocialSearchScreen} name='social search screen' />
        </Stack.Navigator>
    )
}


export default SocialScreenNavigator;