import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import CameraScreen from './CameraScreen';


const Stack = createStackNavigator();

const HomeScreenNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen component={HomeScreen} name='home screen' />
            <Stack.Screen component={CameraScreen} options={{unmountOnBlur: true}} name='camera screen' />
        </Stack.Navigator>
    )
}


export default HomeScreenNavigator;