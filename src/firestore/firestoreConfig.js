import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyCZ7Ipq-u_3NfamprZD_UAT9LHmKe_DLTQ",
    authDomain: "sodahabit-1aea0.firebaseapp.com",
    projectId: "sodahabit-1aea0",
    storageBucket: "sodahabit-1aea0.appspot.com",
    messagingSenderId: "1086069857683",
    appId: "1:1086069857683:web:b11a5cd8d2f5c053539c66",
    measurementId: "G-HB9ZP0NGHK"
};


export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);
export const storage = getStorage(app);
