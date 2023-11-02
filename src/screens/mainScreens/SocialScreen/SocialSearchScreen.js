import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import generalStyles, { availableScreenWidth2, colors } from '../../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../../../components/sharedComponents/FormInput';
import { useState, useEffect, useCallback, useMemo, React } from 'react';
import { debounce } from 'lodash';
import RetrievedUser from '../../../components/ScreensComponents/SocialComponents/friendComponents/RetrievedUser';
import { retrieveUsers } from '../../../businessLogic/firestoreFunctions';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native';
import BackButtonIcon from '../../../../assets/svgs/Icons/socialIcons/friendIcons/backButton.svg';
import { useNavigation } from '@react-navigation/native';


const SocialSearchScreen = () => {
    const [retrievedUsers, setRetrievedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');

    const user = useSelector(state => state.user.currentUser);
    const {friendsList, incomingRequests} = useSelector(state => state.friends);


    const navigation = useNavigation();

    const debouncedUserSearch = useCallback(
        debounce((userInput) => {
            retrieveUsers(userInput, user.uid)
                .then((data) => {
                    // remove friends from the retrieved list of users
                    let filteredData = data.filter((user) => !friendsList.map(friend => friend.id).includes(user.uid));
                    // remove users from the list who have sent this user a friend request already
                    filteredData = filteredData.filter((user) => !incomingRequests.map(request => request.senderId).includes(user.uid)); 
                    setRetrievedUsers(filteredData);
                    setIsSearching(false);
                })
                .catch((error) => {
                    console.log("error while retrieving users: ", error)
                })
    }, 500), []);

    // if a users friendlist changes, update the retrieved results
    useEffect(() => {
        const filteredData = retrievedUsers.filter((user) => !friendsList.map(friend => friend.id).includes(user.uid));
        setRetrievedUsers(filteredData);
    }, [friendsList, setRetrievedUsers])


    // Clean up the debounce effect on component unmount
    useEffect(() => {
        return () => {
            debouncedUserSearch.cancel(); // Cancel any pending debounced actions
        };
    }, [debouncedUserSearch]);


    const onSearch = (userInput) => {
        setRetrievedUsers([]);
        setUsernameInput(userInput);
        userInput && setIsSearching(true);
        userInput && debouncedUserSearch(userInput);
    }


    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                <Text style={[generalStyles.h2, styles.headerText]}>Soda Community</Text>
                
                <View style={styles.headerTextContainer}>
                    <Text style={[generalStyles.h3, {marginBottom: 10}]}>Search for friends</Text>
                    <Pressable onPress={() => {navigation.goBack()}}><BackButtonIcon /></Pressable>
                </View>

                <FormInput style={{marginBottom: 20}} value={usernameInput} handleInput={onSearch} placeholder='Username to search for' />
                
                {isSearching && 
                    <View style={styles.searchingAnimation}>
                        <View style={styles.animationContainer}>
                            <LottieView 
                                source={require('../../../../assets/lottie/random/searching.json')}
                                autoPlay={true}
                                loop={true}
                                resizeMode='cover'
                                width={availableScreenWidth2/2}
                                height={availableScreenWidth2/2}
                            />
                        </View>
                    </View>
                }

                {(usernameInput && !isSearching) && 
                    <FlatList 
                        data={retrievedUsers}
                        numColumns={3}
                        renderItem={(userData) => {
                            return <RetrievedUser userData={userData.item} />
                        }}
                        keyExtractor={(userData) => userData.uid}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps='always'
                    />
                } 
            </SafeAreaView>
        </View>
    )
}

export default SocialSearchScreen

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
    },
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary
    },
    headerText: {
        color: 'white',
        textAlign: 'left',
        marginTop: 20,
        marginBottom: 15,
    },
    searchingAnimation: {
        width: availableScreenWidth2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    animationContainer: {
        width: availableScreenWidth2/2,
        height: availableScreenWidth2/2,
    }
})