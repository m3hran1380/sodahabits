import { createStackNavigator } from '@react-navigation/stack';
import JourneyChallengeScreen from './JourneyChallengeScreen';
import JourneyMapScreen from './JourneyMap/JourneyMapScreen';

const Stack = createStackNavigator();

const JourneyNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen component={JourneyMapScreen} name='journey map screen' />
            <Stack.Screen component={JourneyChallengeScreen} name='journey challenge screen' />
        </Stack.Navigator>
    )
}


export default JourneyNavigator;