import { createStackNavigator } from '@react-navigation/stack';
import SocialScreen from './SocialScreen';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIncomingRequests, setOutgoingRequests } from '../../../features/friendSlice';
import { onSnapshot, where, query, collection, orderBy } from 'firebase/firestore';
import { db } from '../../../firestore/firestoreConfig';
import { addFriend } from '../../../businessLogic/firestoreFunctions';


const Stack = createStackNavigator();

const SocialScreenNavigator = () => {

    const user = useSelector(state => state.user.currentUser);
    const dispatch = useDispatch();

    // setup a live listener on the incoming/outgoing friend requests
    useEffect(() => {
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
            unsubFriendStatus();
        }
    }, [])


    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen component={SocialScreen} name='social screen' />
        </Stack.Navigator>
    )
}


export default SocialScreenNavigator;