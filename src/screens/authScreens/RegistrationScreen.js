import { Text, StyleSheet, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, runTransaction, getDoc } from "firebase/firestore"; 
import { auth } from '../../firestore/firestoreConfig';
import { db } from '../../firestore/firestoreConfig';
import isEmail from 'is-email';
import FormInput from '../../components/authComponents/FormInput';
import SubmitButton from '../../components/authComponents/SubmitButton';


const backgroundImage = require('../../../assets/images/backgroundImages/gradient-3.jpg');

function RegistrationScreen() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // --------------------------- FORM VALIDATION ---------------------------------------//
    const [isValidEmail, setIsValidEmail] = useState({status: true, error: ''});
    const [isValidPassword, setIsValidPassword] = useState({status: true, error: ''});
    const [isValidUsername, setIsValidUsername] = useState({status: true, error: ''});
    const [unknownError, setUnknownError] = useState(false);
    
    const handleSubmit = () => {
        setUnknownError(false);
        let validEmail, validPassword, validUsername;
        validEmail = validPassword = validUsername = true;

        // verify email address:
        if (!email) {
            setIsValidEmail({status: false, error: 'Email is required'})
            validEmail = false;
        }
        else if (!isEmail(email)) {
            setIsValidEmail({status: false, error: 'Please enter a valid email address'})
            validEmail = false;
        }

        // verify password:
        if (!password) {
            setIsValidPassword({status: false, error: 'Password is required'})
            validPassword = false;
        }
        // verify username:
        if (!username) {
            setIsValidUsername({status: false, error: 'Username is required'})
            validUsername = false;
        }

        // if no error - register the user:
        if (validEmail && validPassword && validUsername) {
            register(username, email, password);
        }
    }
    // ------------------------------------ END ---------------------------------------//

    // create the user
    const register = async (username, email, password) => {
        try {
            // check if the username is already taken or not (we will also check again after this stage
            // in case another user makes an account with same username at the same time)
            
            const usernameDoc = await getDoc(doc(db, 'usernames', username));
            if (usernameDoc.exists()) {
                setIsValidUsername({status: false, error: 'Username already exists.'});
                return;
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            const usernameRef = doc(db, 'usernames', username);
            const userRef = doc(db, 'users', user.uid);

            // transaction to check if username exists and if it doesn't 
            try {
                await runTransaction(db, async (transaction) => {
                    const usernameDoc = await transaction.get(usernameRef);

                    if (usernameDoc.exists()) {
                        throw new Error('Username already exists.');
                    }

                    transaction.set(usernameRef, { uid: user.uid });
                    transaction.set(userRef, { username: username })
                })
            }   
            catch (error) {
                setIsValidUsername({status: false, error: error.message});
                try {
                    await auth.currentUser.delete();
                }
                catch (error) {
                    console.log(error);
                    console.log(error);
                    setUnknownError(true);
                }
            }
        }
        catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setIsValidEmail({status: false, error: 'Email address is already in use.'})
                    break;
                case 'auth/invalid-email':
                    setIsValidEmail({status: false, error: 'Email address is not valid.'})
                    break;
                case 'auth/weak-password':
                    setIsValidPassword({status: false, error: 'Password is too weak.'})
                    break;
                default:
                    console.log(error);
                    setUnknownError(true);
            }
        }
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage} >
            <SafeAreaView style={styles.container}>
                <Text style={styles.h1}>Create Account</Text>
                <Text style={styles.normalText}>Keep on top of your habits!</Text>
                <FormInput 
                    label='Username'
                    placeholder='Enter your username'
                    inputValue={username}
                    setValue={setUsername}
                    inputStyle={!isValidUsername.status && {borderColor: 'red'}}
                    resetInputState={setIsValidUsername}
                    state={isValidUsername}
                />
                <FormInput 
                    label='Email'
                    placeholder='Enter your email address'
                    inputValue={email}
                    setValue={setEmail}
                    inputStyle={!isValidEmail.status && {borderColor: 'red'}}
                    resetInputState={setIsValidEmail}
                    state={isValidEmail}
                />
                <FormInput 
                    label='Password'
                    placeholder='Enter your password'
                    inputValue={password}
                    setValue={setPassword}
                    isPassword={true}
                    inputStyle={!isValidPassword.status && {borderColor: 'red'}}
                    resetInputState={setIsValidPassword}
                    state={isValidPassword}
                />
                { unknownError && <Text style={{color: 'red'}}>An unexpected error has occured. Please try again later.</Text>}
                <SubmitButton onPress={handleSubmit} style={styles.button} text='Sign Up'/>
            </SafeAreaView>
        </ImageBackground>
    )
}

export default RegistrationScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 40,
        paddingTop: 75,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    h1: {
        fontSize: 35,
        fontFamily: 'elephant',
        textAlign: 'center'
    },
    normalText: {
        fontFamily: 'inter',
        textAlign: 'center'
    },
    button: {
        marginTop: 30,
    }
})