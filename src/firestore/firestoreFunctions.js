import { getDocs, getDoc, doc, query, collection, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firestoreConfig';


export const getUserData = async (userId) => {
    const docRef = doc(db, 'users', userId);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
        return docSnapshot.data();
    }
    else {
        return false;
    }
}


export const getUserHabits = async (userId) => {
    const habitDocQuery = query(collection(db, 'users', userId, 'dailyhabits'), orderBy('timestamp', 'desc'), limit(1));
    const habitData = await getDocs(habitDocQuery);
    let latestHabitData;
    if (!habitData.empty) {
        habitData.forEach((doc) => {
            latestHabitData = {
                id: doc.id,
                ...doc.data()
            }
        });
    }
    else { return };
    return latestHabitData;
}


export const convertToLocaleTime = (firestoreTimeStamp) => {
    const miliSeconds = (firestoreTimeStamp.seconds * 1000) + (firestoreTimeStamp.nanoseconds / 1000000);
    const dateObject = new Date(miliSeconds);
    return dateObject;
}


export const getTodaysHabits = async (userId) => {
    let latestHabitData = await getUserHabits(userId);
    // check see if the latest habit data matches today's date 
    const latestHabitDate = convertToLocaleTime(latestHabitData.timestamp).toLocaleDateString();
    const now = new Date();
    const todayDate = now.toLocaleDateString();

    // if the last logged habits date does not match today's date create a new habit document for the user
    if (!(latestHabitDate == todayDate)) {

        const primaryHabits = latestHabitData.habits.primary;
        const secondarHabits = latestHabitData.habits.secondary;
        
        const primaryHabitsNames = Object.keys(primaryHabits).map(key => primaryHabits[key]?.name);
        const secondaryHabitNames = Object.keys(secondarHabits).map(key => secondarHabits[key]?.name);

        await createHabits(userId, primaryHabitsNames, secondaryHabitNames);

        latestHabitData = await getUserHabits(userId);
    }

    // return todays habit data;
    return latestHabitData;
}


export const createHabits = async (userId, primaryHabits=[], secondaryHabits=[]) => {
    const dailyHabitRef = collection(db, 'users', userId, 'dailyhabits');

    try {
        await addDoc(dailyHabitRef, {
        timestamp: serverTimestamp(),
        habits: {
            primary: {
                0: primaryHabits[0] ? createHabit(primaryHabits[0]) : null,
                1: primaryHabits[1] ? createHabit(primaryHabits[1]) : null,
                2: primaryHabits[2] ? createHabit(primaryHabits[2]) : null,
            },
            secondary: {
                0: secondaryHabits[0] ? createHabit(secondaryHabits[0]) : null,
                1: secondaryHabits[1] ? createHabit(secondaryHabits[1]) : null,
                2: secondaryHabits[2] ? createHabit(secondaryHabits[2]) : null,
            }
        }
    })}
    catch (error) {
        console.log(error);
    }
}


const createHabit = (name) => {
    return ({
        name: name,
        status: 'pending',
        notes: null,
        imageUrl: null,
    })
}