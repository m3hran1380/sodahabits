import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useEffect } from 'react'
import SaharaSurvival from './SaharaSurvival'
import MountainAscend from './MountainAscend'
import { toggleTabBar } from '../../../../../../features/appSlice';
import { useDispatch, useSelector } from 'react-redux'
import { retrieveJourneys } from '../../../../../../businessLogic/firestoreFunctions';
import { setGroupJourneys } from '../../../../../../features/groupSlice';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../../../../../firestore/firestoreConfig';


const JourneyMapScreen = ({ navigation, route }) => {
    const dispatch = useDispatch();
    const {groupData} = route.params; 
    const groupJourneys = useSelector(state => state.groups.journeys)[groupData.id];

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


    // set a listener on the group journeys
    useEffect(() => {
        const journeysQuery = query(collection(db, 'groups', groupData.id, 'journeys'));
        const unsubscribe = onSnapshot(journeysQuery, (querySnapshot) => {
            const journeys = [];
            querySnapshot.forEach(doc => {
                journeys.push({id: doc.id, ...doc.data()});
            });
            dispatch(setGroupJourneys({groupId: groupData.id, journeysData: journeys}));
        }, (error) => console.log("error in journey snapshot ", error));

        return () => {
            unsubscribe();
        }
    }, []);

    
    const maps = [
        <SaharaSurvival groupData={groupData} />,
        <MountainAscend groupData={groupData} />
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