import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import RegistrationScreen from "../screens/authScreens/RegistrationScreen";
import LoginScreen from "../screens/authScreens/LoginScreen";
import { clearUser, setUser } from "../features/userSlice";
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import OnboardingScreen from "../screens/onboardingScreens/OnboardingScreen";
import AuthenticatedNavigation from "./AuthenticatedNavigation";
import SplashScreen from "../components/loadingSpinners/SplashScreen";
import { setAppLoading } from "../features/appSlice";
import { setUnreadNotifications, setUnreadNotificationsData } from "../features/notificationSlice";
import { initialiseApp } from "../businessLogic/initialisationFunctions";
import { collection, doc, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db, auth } from "../firestore/firestoreConfig";
import { getUsersById, retrieveIncomingFriendRequestsData, getGroupsById } from "../businessLogic/firestoreFunctions";
import { setFriends, setIncomingRequestsData } from "../features/friendSlice";
import { setGroups, setIncomingInvitations } from "../features/groupSlice";


const Stack = createStackNavigator();

const RootNavigation = () => {
    const dispatch = useDispatch();

    const loadingState = useSelector(state => state.app.loading);
    const userState = useSelector((state) => state.user.currentUser);
    // check for authentication status:
    useEffect(() => {
        let userSnapshotUnsub = () => {return null}
        let notificationsSnapshotUnsub = () => {return null}
        let groupSnapshotUnsub = () => {return null}
        let groupInvitationSnapshotUnsub = () => {return null}
        const unsub = onAuthStateChanged(auth, async (user) => {
            try {
                // don't go to home page till we have retrieved the necessary data.
                {!loadingState && dispatch(setAppLoading(true))}
                if (user) {
                    const userData = await initialiseApp(user.uid);
                    // retrieve user's friends data:
                    const friendsData = await getUsersById(userData.friends ? userData.friends : []);
                    // retrieve incoming requests:
                    const incomingRequestsData = await retrieveIncomingFriendRequestsData(user.uid);
                    dispatch(setIncomingRequestsData(incomingRequestsData));
                    dispatch(setUser(userData));
                    dispatch(setFriends(friendsData));

                    // set up a live listener on the userprivate document:
                    userSnapshotUnsub = onSnapshot(doc(db, 'usersprivate', user.uid), (snapshot) => {
                        dispatch(setUser(snapshot.data()));
                    }, (error) => console.log('error in user snapshot: ', error))
                    // ---------------- end ------------------------- //

                    // set up a live listener on the unread notifications documents:
                    const notificationsQuery = query(collection(db, 'notifications'), 
                        where('receiverId', '==', user.uid), where('read', '==', false), orderBy('timestamp', 'desc'));
                    notificationsSnapshotUnsub = onSnapshot(notificationsQuery, (snapshot) => {
                        const notifications = [];
                        snapshot.forEach((doc) => {
                            const notification = {id: doc.id, ...doc.data()};
                            delete notification.timestamp;
                            notifications.push(notification);
                        });
                        dispatch(setUnreadNotifications(notifications))
                    }, (error) => console.log('error in notifications snapshot: ', error))
                    // ---------------- end ------------------------- //

                    // set up a live listener on the group invitations
                    const invitationQuery = query(collection(db, 'notifications'), where('receiverId', '==', user.uid)
                        ,where('type', '==', 'group-invitation'), where('status', '==', 'pending'), orderBy('timestamp', 'desc')    
                    );
                    groupInvitationSnapshotUnsub = onSnapshot(invitationQuery, (snapshot) => {
                        const groupInvites = [];
                        snapshot.forEach(doc => {
                            const invite = {id: doc.id, ...doc.data()};
                            delete invite.timestamp;
                            groupInvites.push(invite);
                        });
                        dispatch(setIncomingInvitations(groupInvites));
                    }, (error) => console.log('error in group invite snapshot: ', error));

                    // set up a live listener on the groups documents:
                    const groupsQuery = query(collection(db, 'groups'), 
                        where('members', 'array-contains', user.uid));
                        groupSnapshotUnsub = onSnapshot(groupsQuery, (snapshot) => {
                        const groups = [];
                        snapshot.forEach((doc) => {
                            const group = {id: doc.id, ...doc.data()};
                            delete group.timestamp;
                            groups.push(group);
                        });
                        dispatch(setGroups(groups))
                    }, (error) => console.log('error in groups snapshot: ', error))
                    // ---------------- end ------------------------- //
                }
                else {
                    dispatch(clearUser())
                    dispatch(setUnreadNotificationsData([]));
                }
                dispatch(setAppLoading(false));
            }
            catch (error) {
                console.log("error inside root navigation", error);
            }
        });
        return () => {
            unsub();
            userSnapshotUnsub();
            notificationsSnapshotUnsub();
            groupSnapshotUnsub();
            groupInvitationSnapshotUnsub();
        }
    }, [])


    if (userState === null || loadingState) {
        return (
            <SplashScreen />  
        )
    }

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            { userState ? 
                <>
                { userState.onboarding ? 
                    <Stack.Screen component={AuthenticatedNavigation} name='authenticated navigation' />
                    :
                    <Stack.Screen component={OnboardingScreen} name='onboarding screen' />
                }
                </>
                :
                <>
                    <Stack.Screen component={RegistrationScreen} name='registration screen' />
                    <Stack.Screen component={LoginScreen} name='login screen' />
                </>
            }
        </Stack.Navigator>
  )
}

export default RootNavigation