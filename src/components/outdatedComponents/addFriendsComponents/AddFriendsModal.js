import { StyleSheet, View, Text, FlatList } from 'react-native';
import generalStyles, { colors } from '../../../styles/generalStyle';
import FormInput from '../../sharedComponents/FormInput';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import { retrieveUsers } from '../../../businessLogic/firestoreFunctions';
import RetrievedUser from './RetrievedUser';
import { useSelector } from 'react-redux';
import CustomModal from '../../sharedComponents/CustomModal';


const AddFriendsModal = ({ closeModal, style, status }) => {
    const [retrievedUsers, setRetrievedUsers] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [requestStatus, setRequestStatus] = useState({error: false, message: ''})

    const user = useSelector((state) => state.user.currentUser);
    
    useEffect(() => {
        if (!usernameInput) setIsSearching(false);
        if (!status) {
            setUsernameInput('');
            setRequestStatus({error: false, message: ''});
        }
        }, [usernameInput, setIsSearching, status, setUsernameInput])


    const debouncedUserSearch = useCallback(
        debounce((userInput) => {
            retrieveUsers(userInput, user.uid)
                .then((data) => {
                    setRetrievedUsers(data);
                    setIsSearching(false);
                })
                .catch((error) => {
                    console.log("error while retrieving users: ", error)
                })
    }, 500), []);


    // Clean up the debounce effect on component unmount
    useEffect(() => {
        return () => {
            debouncedUserSearch.cancel(); // Cancel any pending debounced actions
        };
    }, [debouncedUserSearch]);

    // clear the request status message after 10 seconds:
    useEffect(() => {
        if (requestStatus.message) {
            const timerId = setTimeout(() => {
                setRequestStatus({error: false, message: ''})
            }, 2000);

            return () => {
                clearTimeout(timerId);
            }
        }
    }, [requestStatus])


    const onSearch = (userInput) => {
        setRequestStatus({error: false, message: ''})
        setRetrievedUsers([]);
        setUsernameInput(userInput);
        userInput && setIsSearching(true);

        if (userInput) debouncedUserSearch(userInput);
    }

    return (
        <CustomModal closeModal={closeModal} style={style} status={status}>
            <FormInput value={usernameInput} handleInput={onSearch} placeholder='Username to search for' />
            {isSearching && <UserLoadingSkeleton />}

            {requestStatus.message && 
                <Text 
                    style={[styles.statusText, {color: requestStatus.error ? colors.colorFailure : 'green'}]}
                >
                    {requestStatus.message}
                </Text>
            }

            {(usernameInput && !isSearching) && 
                <>
                {retrievedUsers.length ? 
                    <View style={styles.listStyle}>
                        <FlatList 
                            data={retrievedUsers}
                            renderItem={(userData) => {
                                return <RetrievedUser setStatus={setRequestStatus} userData={userData.item} />
                            }}
                            keyExtractor={(userData) => userData.uid}
                            keyboardDismissMode='on-drag'
                            keyboardShouldPersistTaps='always'
                        />
                    </View>
                    
                    :
                    <View style={styles.userNotFound}>
                        <Text style={[generalStyles.normalText, styles.userNotFoundText]}>No matching user found.</Text>
                    </View>
                }
                </>
            }

        </CustomModal>
    ) 
}

export default AddFriendsModal

const styles = StyleSheet.create({
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
    },
    statusText: {
        ...generalStyles.normalText,
        textAlign: 'left',
        marginHorizontal: 12,
        marginBottom: 10,
        fontSize: 16, 
    }
})