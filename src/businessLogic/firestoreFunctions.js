import { getDocs, getDoc, doc, query, collection, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firestore/firestoreConfig';


// retrieves the user document corresponding to the provided userID.
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


// this function retrieves the user's latest recorded habits from the database.
export const getUserLatestHabitsRecord = async (userId) => {
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


// converts the firestore server timestamp to local time
export const convertToLocaleTime = (firestoreTimeStamp) => {
    const miliSeconds = (firestoreTimeStamp.seconds * 1000) + (firestoreTimeStamp.nanoseconds / 1000000);
    const dateObject = new Date(miliSeconds);
    return dateObject;
}



// this function checks to see if the latest recorded habits correspond to today or not
// if so it returns them, otherwise it creates habits for today and returns those.
export const getTodaysHabits = async (userId) => {
    let latestHabitData = await getUserLatestHabitsRecord(userId);
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

        latestHabitData = await getUserLatestHabitsRecord(userId);
    }

    // return todays habit data;
    return latestHabitData;
}


// creates a daily habit document for the provided userID
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


// returns a habit object
const createHabit = (name) => {
    return ({
        name: name,
        status: 'pending',
        notes: null,
        imageUrl: null,
    })
}



// returns the date corresponding to the first day of the week - remember this is local time
export const getMonday = (date) => {
    const providedDate = new Date(date);

    const currentDay = providedDate.getDay();
    const dayDifference = providedDate.getDate() - currentDay + (currentDay == 0 ? -6 : 1);

    const monday = new Date(providedDate.setDate(dayDifference));
    monday.setHours(0,0,0,0);
    
    return monday; 
}



// make sure we have a weekly tracker record for every week since the start of the user's account:

// this function retrieves the latest weekly tracker
const retrieveLatestWeeklyTracker = async (userId) => {
    try {
        const weeklyTrackerDocQuery = query(collection(db, 'users', userId, 'weeklytrackers'), orderBy('timestamp', 'desc'), limit(1));
        const weeklyTrackerData = await getDocs(weeklyTrackerDocQuery);
        let latestTracker;
        if (!weeklyTrackerData.empty) {
            weeklyTrackerData.forEach((doc) => {
                latestTracker = {
                    id: doc.id,
                    ...doc.data()
                }
            });
        }
        else { return };
        return latestTracker;
    }
    catch (error) {
        console.log(error);
    }
}

// this function makes sure we have a record for any missing week
export const syncWeeklyTrackers = async (userId) => {
    const latestTrackerData = await retrieveLatestWeeklyTracker(userId);
    const now = new Date();
    const currentWeekMonday = getMonday(now);
    const latestTrackerMonday = getMonday(convertToLocaleTime(latestTrackerData.timestamp));

    while (latestTrackerMonday < currentWeekMonday) {
        // while we haven't reached the current week, create weeklytracker documents
        // and mark the habits as not-complete as the user has missed them.
        latestTrackerMonday.setDate(latestTrackerMonday.getDate() + 7);

        if (latestTrackerMonday < currentWeekMonday) {
            await createIncompleteWeeklyTrackerDocument(userId, latestTrackerMonday);
        }
        else {
            // this is for creating the tracker document that corresponds to the current week
            // get today's index:
            const todayIndex = (now.getDay() - 1) < 0 ? 6 : (now.getDay() - 1);
            await createCurrentWeekTrackerDocument(userId, latestTrackerMonday, todayIndex);
        }
    }    
}

// this function creates weekly track documents for weeks with no activity
const createIncompleteWeeklyTrackerDocument = async (userId, timeStamp) => {
    try {
        const weeklyTrackerDocRef = collection(db, 'users', userId, 'weeklytrackers');
        await addDoc(weeklyTrackerDocRef, {
            timestamp: timeStamp,
            habitStatus: Array(7).fill(0).map(() => {
                return {primaryStatus: Array(3).fill('not-complete'), secondaryStatus: Array(3).fill('not-complete') }
            }),
        })
        
    }
    catch (error) {
        console.log('Error while creating weekly tracker documents', error);
    }
}


// this function creates weekly track documents for current week
const createCurrentWeekTrackerDocument = async (userId, timeStamp, todayIndex) => {
    try {
        const weeklyTrackerDocRef = collection(db, 'users', userId, 'weeklytrackers');

        const habitStatus = Array(7).fill(0).map(() => {
            return {primaryStatus: Array(3).fill('pending'), secondaryStatus: Array(3).fill('pending') }
        });

        // set the days that the user has missed to not-complete
        for (let i=0; i<todayIndex; i++) {
            habitStatus[i] = {
                primaryStatus: Array(3).fill('not-complete'),
                secondaryStatus: Array(3).fill('not-complete'),
            }
        }
        await addDoc(weeklyTrackerDocRef, {
            timestamp: timeStamp,
            habitStatus: habitStatus
        })
        
    }
    catch (error) {
        console.log('Error while creating weekly tracker documents', error);
    }
}