import { getDoc, doc } from 'firebase/firestore';
import { db } from './firestoreConfig';


export const getUserData = async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    else {
        throw new Error('No matching document for this user Id was found!');
    }
}