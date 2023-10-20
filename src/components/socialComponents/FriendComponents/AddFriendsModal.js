import { StyleSheet, View, Text } from 'react-native';
import generalStyles, { actualScreenHeight, availableScreenWidth, colors } from '../../../styles/generalStyle';
import FormInput from '../../sharedComponents/FormInput';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import { useState, useEffect } from 'react';
import CircularCloseButton from './CircularCloseButton';
import Animated from 'react-native-reanimated';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { retrieveUsers } from '../../../businessLogic/firestoreFunctions';
import RetrievedUser from './RetrievedUser';


const AddFriendsModal = ({ closeModal, style, status }) => {
    const [retrievedUsers, setRetrievedUsers] = useState([]);

    const [isSearching, setIsSearching] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    
    useEffect(() => {
        if (!usernameInput) setIsSearching(false);
        if (!status) setUsernameInput('');
    }, [usernameInput, setIsSearching, status, setUsernameInput])


    const debouncedUserSearch = useCallback(
        debounce((userInput) => {
            retrieveUsers(userInput)
                .then((data) => {
                    setRetrievedUsers(data);
                    setIsSearching(false);
                })
                .catch((error) => console.log("error while retrieving users: ", error))
    }, 500), []);


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

        if (userInput) debouncedUserSearch(userInput);
    }

    return (
        <Animated.View pointerEvents={status ? 'auto' : 'none'} style={[styles.container, style]}>
            <FormInput value={usernameInput} handleInput={onSearch} placeholder='Username to search for' />
            {isSearching && <UserLoadingSkeleton />}

            {(usernameInput && !isSearching) && 
                <>
                {retrievedUsers.length ? 
                    <>
                    {retrievedUsers.map((userData, index) => {
                        return <RetrievedUser key={index} userData={userData} />
                    })}
                    </>
                    :
                    <View style={styles.userNotFound}>
                        <Text style={[generalStyles.normalText, styles.userNotFoundText]}>No matching user found.</Text>
                    </View>
                }
                </>
            }

            <CircularCloseButton handlePress={closeModal} style={styles.closeBtn}/>
        </Animated.View>
    ) 
}

export default AddFriendsModal

const styles = StyleSheet.create({
    container: {
        height: 0.45 * actualScreenHeight,
        width: availableScreenWidth,
        borderRadius: 10,
        position: 'absolute',
        backgroundColor: colors.backgroundColorTertiary,  
        top: (actualScreenHeight/2) - 0.3 * actualScreenHeight,      
        alignSelf: 'center',
    },
    closeBtn: {
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        marginBottom: 10,
    },
    userNotFound: {
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'red',
        backgroundColor: colors.colorFailure,
    },
    userNotFoundText: {
        color: 'white',
        textAlign: 'center'
    }
})