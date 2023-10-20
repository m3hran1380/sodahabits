import { createStackNavigator } from '@react-navigation/stack';
import SocialScreen from './SocialScreen';


const Stack = createStackNavigator();


const SocialScreenNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen component={SocialScreen} name='social screen' />
        </Stack.Navigator>
    )
}


export default SocialScreenNavigator;