import { StyleSheet } from 'react-native';
import { actualScreenHeight, availableScreenWidth, colors } from '../../../styles/generalStyle';
import FormInput from '../../sharedComponents/FormInput';
import UserLoadingSkeleton from './UserLoadingSkeleton';
import { useState, useEffect } from 'react';
import CircularCloseButton from './CircularCloseButton';
import Animated from 'react-native-reanimated';
import { debounce } from 'lodash';
import { useCallback } from 'react';


const AddFriendsModal = ({ closeModal, style, status }) => {
    const [isSearching, setIsSearching] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    
    useEffect(() => {
        if (!usernameInput) setIsSearching(false);
        if (!status) setUsernameInput('');
    }, [usernameInput, setIsSearching, status, setUsernameInput])


    const debouncedUserSearch = useCallback(
        debounce((userInput) => {
            console.log('retrieving user');
    }, 500), []);


    // Clean up the debounce effect on component unmount
    useEffect(() => {
        return () => {
            debouncedUserSearch.cancel(); // Cancel any pending debounced actions
        };
    }, [debouncedUserSearch]);

    
    const onSearch = (userInput) => {
        setUsernameInput(userInput);
        setIsSearching(true);
        debouncedUserSearch(userInput);
    }


    return (
        <Animated.View pointerEvents={status ? 'auto' : 'none'} style={[styles.container, style]}>
            <FormInput value={usernameInput} handleInput={onSearch} placeholder='Username to search for' />
            {isSearching && <UserLoadingSkeleton />}
            <CircularCloseButton handlePress={closeModal} style={styles.closeBtn}/>
        </Animated.View>
    ) 
}

export default AddFriendsModal

const styles = StyleSheet.create({
    container: {
        height: 0.6 * actualScreenHeight,
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
    }
})