import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/mainScreens/HomeScreen';
import SocialScreen from '../screens/mainScreens/SocialScreen';
import VendingMachineScreen from '../screens/mainScreens/VendingMachineScreen';
import LocationScreen from '../screens/mainScreens/LocationScreen';
import TabBarButton from '../components/navigationComponents/TabBarButton';


const Tab = createBottomTabNavigator();

const AuthenticatedNavigation = () => {

    const barStyle = {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        elevation: 0,
        borderTopWidth: 0,
        position: 'absolute',
        paddingBottom: 10,
    }

    return (
        <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarStyle: {...barStyle}}}>
            <Tab.Screen name='home' component={HomeScreen} 
                options={{
                    tabBarButton: (props) => <TabBarButton screen='home' {...props} />
                }}
            />
            <Tab.Screen name='social' component={SocialScreen} 
                options={{
                    tabBarButton: (props) => <TabBarButton screen='social' {...props} />
                }}
            />
            <Tab.Screen name='vending machine' component={VendingMachineScreen} 
                options={{
                    tabBarButton: (props) => <TabBarButton screen='vending machine' {...props} />
                }}
            />
            <Tab.Screen name='location' component={LocationScreen} 
                options={{
                    tabBarButton: (props) => <TabBarButton screen='location' {...props} />
                }}
            />
        </Tab.Navigator>
    )
}

export default AuthenticatedNavigation