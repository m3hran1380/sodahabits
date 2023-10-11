import { StyleSheet, Text, ImageBackground, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import generalStyles from '../../styles/generalStyle';
import FormInput from '../../components/authComponents/FormInput';
import SubmitButton from '../../components/authComponents/SubmitButton';
import FormSeparator from '../../components/authComponents/FormSeparator';
import TextButton from '../../components/authComponents/TextButton';
import isEmail from 'is-email';
import { auth } from '../../firestore/firestoreConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';


const backgroundImage = require('../../../assets/images/backgroundImages/gradient-3.jpg');

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValidEmail, setIsValidEmail] = useState({status: true, error: ''});
    const [isValidPassword, setIsValidPassword] = useState({status: true, error: ''});
    const [unknownError, setUnknownError] = useState({status: false, error: ''});

    const handleSubmit = () => {
        setUnknownError({ status: false, error: '' });
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

        if (validEmail && validPassword) {
            login(email, password);
        }
    }

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        }
        catch (error) {
            console.log("hi")
            console.log(error.code)
            switch (error.code) {
                case 'auth/user-not-found':
                    setUnknownError({status: true, error: 'There is no account with this email address.'});
                    break;
                case 'auth/invalid-email':
                    setIsValidEmail({status: true, error: 'Email address is not valid.'});
                    break;
                case 'auth/invalid-login-credentials':
                    setUnknownError({status: true, error: 'Incorrect login credentials.'});
                    break;
                case 'auth/too-many-requests':
                    setUnknownError({status: true, error: 'Too many requests. Please try again later.'});
                    break;
                default:
                    setUnknownError({status: true, error: error.code});
            }
        }
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.backgroundImage} >
            <SafeAreaView style={styles.container}>
                <Text style={styles.h1}>Hey, welcome Back!</Text>
                <Text style={styles.normalText}>Continue with email</Text>

                <FormInput 
                    label='Email'
                    placeholder='Enter your email address'
                    inputValue={email}
                    setValue={setEmail}
                    inputStyle={!isValidEmail.status && {borderColor: 'red'}}
                    resetInputState={setIsValidEmail}
                    state={isValidEmail}
                    style={{marginTop: 20}}
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
                { unknownError.status && <Text style={{color: 'red'}}>{unknownError.error}</Text>}
                <SubmitButton onPress={handleSubmit} style={styles.button} text='Login'/>
                
                <FormSeparator text='or login with google' />

                <View style={styles.registerOptionContainer}>
                    <Text>Don't have an account? </Text>
                    <TextButton onPress={() => {navigation.navigate('registration screen')}}>SignUp</TextButton>
                </View>

            </SafeAreaView>
        </ImageBackground>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    ...generalStyles,
    button: {
        marginTop: 30,
    },
    registerOptionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 15,
    }
})