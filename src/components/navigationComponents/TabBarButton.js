import { StyleSheet, Pressable, View } from 'react-native';
import { FontAwesome, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons/';


const TabBarButton = ({onPress, screen, accessibilityState}) => {
    
    const focused = accessibilityState.selected;

    const iconStyle = {
        color: focused ? 'red' : 'white',
    }

    const renderIcon = () => {
        switch (screen) {
            case 'home':
                return <FontAwesome name='home' style={iconStyle} size={focused ? 40 : 30}/>
            case 'social':
                return <FontAwesome name='group' style={iconStyle} size={focused ? 40 : 30}/>
            case 'vending machine':
                return <MaterialCommunityIcons name='slot-machine' style={iconStyle} size={focused ? 40 : 30}/>
            case 'location':
                return <FontAwesome5 name='map-marked-alt' style={iconStyle} size={focused ? 40 : 30}/>
        }
    }

    return (
        <Pressable onPress={onPress} style={styles.container}>
            {renderIcon()}
        </Pressable>
    )
}

export default TabBarButton

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})