import { createStackNavigator } from '@react-navigation/stack';
import GroupCreationScreen from './GroupCreationScreen';
import InviteFriendsScreen from './InviteFriendsScreen';
import GroupOverviewScreen from './GroupOverviewScreen';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setInvitation } from '../../../../features/groupSlice';

const Stack = createStackNavigator();

const GroupCreationNavigator = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setInvitation([]));
        }
    }, []);

    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen component={GroupCreationScreen} name='group creation screen' />
            <Stack.Screen component={InviteFriendsScreen} name='invite friends screen' />
            <Stack.Screen component={GroupOverviewScreen} name='group overview screen' />
        </Stack.Navigator>
    )
}

export default GroupCreationNavigator

