import { StyleSheet, Text, View, Button } from 'react-native'
import { signOut } from 'firebase/auth';
import { auth } from '../firestore/firestoreConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <SafeAreaView>
            <Text>HomeScreen</Text>
            <Button title='Sign Out' onPress={handleSignOut}/>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})