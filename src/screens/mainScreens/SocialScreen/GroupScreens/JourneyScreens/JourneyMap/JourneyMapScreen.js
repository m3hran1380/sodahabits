import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import SaharaSurvival from './SaharaSurvival'
import MountainAscend from './MountainAscend'
import { toggleTabBar } from '../../../../../../features/appSlice';
import { useDispatch } from 'react-redux'

const JourneyMapScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    useLayoutEffect(() => {
        const toggleNavigationBar = () => {
            dispatch(toggleTabBar());
        }
        navigation.addListener('focus', toggleNavigationBar);
        navigation.addListener('blur', toggleNavigationBar);
        return () => {
            navigation.removeListener('focus', toggleNavigationBar);
            navigation.removeListener('blur', toggleNavigationBar);
        };
    }, [navigation]);

    
    const maps = [
        <SaharaSurvival />,
        <MountainAscend />
    ]

    return (
        <View style={styles.container}>
            <FlatList 
                data={maps}
                renderItem={({item}) => item}
                keyExtractor={(_, index) => index}
                showsVerticalScrollIndicator={false}
                inverted={true}
            />
        </View>
    )
}

export default JourneyMapScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})