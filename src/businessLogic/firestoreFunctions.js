import { getDocs, getDoc, doc, query, collection, orderBy, limit, addDoc, serverTimestamp, writeBatch, updateDoc, startAt, endAt, runTransaction, deleteDoc, where, startAfter, setDoc, getDocsFromCache, getDocsFromServer, arrayUnion } from 'firebase/firestore';
import { ref, deleteObject } from "firebase/storage";
import { storage } from '../firestore/firestoreConfig';
import { db } from '../firestore/firestoreConfig';


// retrieves the user document corresponding to the provided userID.
export const getUserData = async (userId) => {
    const docRef = doc(db, 'usersprivate', userId);
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
    const habitDocQuery = query(collection(db, 'dailyhabits'), where("ownerId", "==", userId), orderBy('timestamp', 'desc'), limit(1));
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
        // make sure the previous habit document has any pending statuses set to not-complete
        ['primary', 'secondary'].forEach((habitType) => {
            for (let key in latestHabitData.habits[habitType]) {
                const currentHabit = latestHabitData.habits[habitType][key];
                if (currentHabit) {
                    currentHabit.status = currentHabit.status === 'pending' ? 'not-complete' : currentHabit.status;
                }
            }
        });
        // update the firestore
        const updateDocRef = doc(db, 'dailyhabits', latestHabitData.id);
        await updateDoc(updateDocRef, latestHabitData);

        // create a new habit for the user:
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
    const dailyHabitRef = collection(db, 'dailyhabits');

    try {
        await addDoc(dailyHabitRef, {
        ownerId: userId,
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
export const retrieveLatestWeeklyTrackers = async (userId, amount) => {
    try {
        const weeklyTrackerDocQuery = query(collection(db, 'usersprivate', userId, 'weeklytrackers'), orderBy('timestamp', 'desc'), limit(amount));
        const weeklyTrackerData = await getDocs(weeklyTrackerDocQuery);
        const latestTrackers = [];

        if (!weeklyTrackerData.empty) {
            weeklyTrackerData.forEach((doc) => {
                latestTrackers.push({
                    id: doc.id,
                    ...doc.data(),
                    // replace the timestamp retrieved with a local timestamp
                    timestamp: convertToLocaleTime(doc.data().timestamp)                    
                })
            });
        }
        else { return };
        return latestTrackers;
    }
    catch (error) {
        console.log(error);
    }
}

// this function makes sure we have a record for any missing week
export const syncWeeklyTrackers = async (userId) => {
    const RetrievedTrackerData = await retrieveLatestWeeklyTrackers(userId, 1);
    const latestTrackerData = RetrievedTrackerData[0];
    const now = new Date();
    const currentWeekMonday = getMonday(now);
    const latestTrackerMonday = getMonday(latestTrackerData.timestamp);

    if (latestTrackerMonday < currentWeekMonday) {
        while (latestTrackerMonday < currentWeekMonday) {
            // while we haven't reached the current week, create weeklytracker documents
            // and mark the habits as not-complete as the user has missed them.
            latestTrackerMonday.setDate(latestTrackerMonday.getDate() + 7);

            if (latestTrackerMonday < currentWeekMonday) {
                await createIncompleteWeeklyTrackerDocument(userId, latestTrackerMonday);
            }
            else {
                // this is for creating the tracker document that corresponds to the current week
                // get today's index - we then use this index to set the previous days before today to not-complete as they've been missed.
                const todayIndex = getTodayIndex();
                await createCurrentWeekTrackerDocument(userId, latestTrackerMonday, todayIndex);
            }
        }    
    }
    else {
        // make sure that any habit status in the prior days within the current week 
        // that are still set to pending are changed to not-complete.
        await syncMissedDaysInCurrentWeekTracker(userId);
    }   
    
}

// this function creates weekly track documents for weeks with no activity
const createIncompleteWeeklyTrackerDocument = async (userId, timeStamp) => {
    try {
        const weeklyTrackerDocRef = collection(db, 'usersprivate', userId, 'weeklytrackers');
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
        const weeklyTrackerDocRef = collection(db, 'usersprivate', userId, 'weeklytrackers');

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


// this function checks the days prior to today in the current week and ensures any habit with the status of 'pending'
// is set to not-complete.
const syncMissedDaysInCurrentWeekTracker = async (userId) => {
    // retrieve the latest weekly tracker document
    const retrievedTracker = await retrieveLatestWeeklyTrackers(userId, 1);
    const currentWeeklyTrackerHabitStatus = retrievedTracker[0].habitStatus;

    const todayIndex = getTodayIndex();

    for (let i=0; i<todayIndex; i++) {
        const currentItem = currentWeeklyTrackerHabitStatus[i];
        ['primaryStatus', 'secondaryStatus'].forEach(statusKey => {
            // Check each status in the current array (either 'primaryStatus' or 'secondaryStatus').
            currentItem[statusKey] = currentItem[statusKey].map(status => {
                // If the status is 'pending', change it to 'not-complete'. Otherwise, leave it as is.
                return status === 'pending' ? 'not-complete' : status;
            });
        });
    }

    // update the firestore with the updated weekly tracker
    try {
        const trackerRef = doc(db, 'usersprivate', userId, 'weeklytrackers', retrievedTracker[0].id);
        await updateDoc(trackerRef, retrievedTracker[0]);
    }
    catch (error) {
        console.log('Error while trying to sync current week missed days: ', error);
    }
}   


// return today's index
export const getTodayIndex = () => {
    const now = new Date();
    const todayIndex = (now.getDay() - 1) < 0 ? 6 : (now.getDay() - 1);
    return todayIndex;
}


// update the status of a habit to completed or pending in both the weekly tracker and todayHabit collections
export const updateHabitStatus = async (userId, habitIndex, habitType, newHabitStatus) => {
    try {
        const latestWeeklyTrackerList = await retrieveLatestWeeklyTrackers(userId, 1);
        const currentWeeklyTracker = latestWeeklyTrackerList[0];
        const todayIndex = getTodayIndex();
        const todayHabitDocument = await getTodaysHabits(userId); 

        // update status of the habit in both the weekly tracker and dailyhabit documents;
        currentWeeklyTracker.habitStatus[todayIndex][`${habitType}Status`][habitIndex] = newHabitStatus;
        todayHabitDocument.habits[habitType][habitIndex].status = newHabitStatus;

        if (newHabitStatus === 'pending') {
            const imageName = todayHabitDocument.habits[habitType][habitIndex].imageName;
            if (imageName) {
                const imageRef = ref(storage, `images/${userId}/${imageName}`);
                await (deleteObject(imageRef));
                todayHabitDocument.habits[habitType][habitIndex].imageUrl = null;
                todayHabitDocument.habits[habitType][habitIndex].imageName = null;
            }   
            todayHabitDocument.habits[habitType][habitIndex].completionTime = null;
        }
        else {
            // if the habit is completed update the timestamp of the document:
            todayHabitDocument.timestamp = serverTimestamp();
            // also add the completion timestamp to the particular habit if its a primary habit:
            if (habitType === 'primary') todayHabitDocument.habits[habitType][habitIndex].completionTime = serverTimestamp();
        }

        // check to see if at least one habit is completed - this is for the social feed:
        const atleastOnePrimaryComplete = Object.keys(todayHabitDocument.habits.primary)
                                                .map(key => todayHabitDocument.habits.primary[key].status)
                                                .some(status => status === 'complete');
        
        if (atleastOnePrimaryComplete) todayHabitDocument.atleastOnePrimaryCompleted = true;
        else todayHabitDocument.atleastOnePrimaryCompleted = false;
        

        const trackerDocRef = doc(db, 'usersprivate', userId, 'weeklytrackers', currentWeeklyTracker.id);
        const dailyhabitDocRef = doc(db, 'dailyhabits', todayHabitDocument.id);
       
        const batch = writeBatch(db);
        batch.update(trackerDocRef, currentWeeklyTracker);
        batch.update(dailyhabitDocRef, todayHabitDocument);
        
        await batch.commit(); 
    }
    catch (error) {
        // if we can't update habit status, the app state should be reverted back - (optimistic update)
        throw error;
    }
}


// following function is used to edit the name of a habit
export const updateHabitName = async (userId, habitIndex, habitType, updatedName) => {
    try {
        const todayHabitDoc = await getTodaysHabits(userId);
        todayHabitDoc.habits[habitType][habitIndex].name = updatedName;
        const documentRef = doc(db, 'dailyhabits', todayHabitDoc.id);
        await updateDoc(documentRef, todayHabitDoc);
        // convert the timestamp before returning the habit object - to allow its storage in redux store:
        for (const key in todayHabitDoc.habits.primary) {
            const completionTime = todayHabitDoc.habits.primary[key].completionTime;
            if (completionTime) {
                todayHabitDoc.habits.primary[key].completionTime = convertToLocaleTime(completionTime).toISOString();
            }
        }

        return todayHabitDoc;
    }   
    catch (error) {
        throw Error(`Error while updating the name of a habit ${error}`)
    }
}


// following function adds/updates note of a habit
export const addNotesToHabit = async (userId, habitIndex, habitType, note) => {
    try {
        const todayHabitDoc = await getTodaysHabits(userId);
        todayHabitDoc.habits[habitType][habitIndex].notes = note;
        const docRef = doc(db, 'dailyhabits', todayHabitDoc.id);
        await updateDoc(docRef, todayHabitDoc);
    }
    catch (error) {
        console.log("Error while adding notes to a habit document ", error);
    }
}


// following function removes the image associated with the current habit
export const removeHabitImage = async (userId, habitIndex, habitType) => {
    try {
        const todayHabitDocument = await getTodaysHabits(userId); 
        const imageRef = ref(storage, `images/${userId}/${todayHabitDocument.habits[habitType][habitIndex].imageName}`);
        await (deleteObject(imageRef));
        todayHabitDocument.habits[habitType][habitIndex].imageUrl = null;
        todayHabitDocument.habits[habitType][habitIndex].imageName = null;
        // update the todayhabitdocument in firestore
        const dailyhabitDocRef = doc(db, 'dailyhabits', todayHabitDocument.id);
        await updateDoc(dailyhabitDocRef, todayHabitDocument);
    }
    catch (error) {
        console.log("error while removing a habit image ", error);
    }
}


// retrieve public users - search for by username
export const retrieveUsers = async (username, userId) => {
    try {
        const searchStartValue = username.toLowerCase();
        const searchEndValue = username.toLowerCase() + '\uf8ff' // '\uf8ff' is a high code point in the Unicode range
        const queryRef = query(collection(db, 'userspublic'), orderBy('username'), startAt(searchStartValue), endAt(searchEndValue));
        const snapshot = await getDocs(queryRef);

        const usernames = [];
        snapshot.forEach((doc) => {
            // make sure we don't retrieve the user itself
            if (doc.id !== userId) {
                usernames.push({uid: doc.id, ...doc.data()})
            }
        })
        return usernames;
    } 
    catch (error) {
        console.log("error while fetching users by username: ", error);
        return [];
    }
}


// this function sends a friend request from the sender to the receiver.
export const sendFriendRequest = async (senderId, receiverId) => {

    // check to see if an incoming/outgoing friend request between these 2 users alrdy exists or not;
    const outgoingRequestRef = doc(db, 'friendrequests', `${senderId}${receiverId}`)
    const incomingRequestRef = doc(db, 'friendrequests', `${receiverId}${senderId}`)
    try {
        await runTransaction(db, async (transaction) => {
            const outgoingDoc = await transaction.get(outgoingRequestRef);
            const incomingDoc = await transaction.get(incomingRequestRef);

            if (outgoingDoc.exists()) {
                throw "You've already sent this user a friend request."
            }
            else if (incomingDoc.exists()) {
                throw "This user has already sent you a friend request."
            }

            // if there is no incoming/outgoing requests send one:
            transaction.set(outgoingRequestRef, {
                senderId: senderId,
                receiverId: receiverId,
                status: 'pending',
                timestamp: serverTimestamp(),
            });
        })
    }
    catch (error) {
        throw error;
    }
}


export const getUsersById = async (ids) => {
    const usersDocuments = [];
    try {
        for (const id of ids) {
            const retrievedDocument = await getDoc(doc(db, 'userspublic', id));
            if (retrievedDocument.exists()) {
                usersDocuments.push({id: retrievedDocument.id, ...retrievedDocument.data()});
            }
        }
        return usersDocuments;
    }
    catch (error) {
        console.log("error while getting user documents by id: ", error);
        return [];
    }
}

export const getGroupsById = async (ids) => {
    const groupsDocuments = [];
    try {
        for (const id of ids) {
            const retrievedDocument = await getDoc(doc(db, 'groups', id));
            if (retrievedDocument.exists()) {
                groupsDocuments.push({id: retrievedDocument.id, ...retrievedDocument.data()});
            }
        }
        return groupsDocuments;
    }
    catch (error) {
        console.log("error while getting group documents by id: ", error);
        return [];
    }
}


export const acceptFriendRequest = async (senderId, receiverId) => {
    try {
        // update the friendrequests collection only - this will trigger
        // a cloud function that will update the corresponding users friends array automatically
        await updateDoc(doc(db, 'friendrequests', `${senderId}${receiverId}`), {
            status: 'accepted'
        });
    }
    catch (error) {
        console.log('Error while accepting friend request status: ', error);
    }
}


// this function is used to delete friend requests 
export const deleteFriendRequest = async (senderId, receiverId) => {
    try {
        // delete the friendrequests document - this will trigger
        // a cloud function that will update the corresponding users friends array automatically
        await deleteDoc(doc(db, 'friendrequests', `${senderId}${receiverId}`));
    }
    catch (error) {
        console.log('Error while rejecting friend request status: ', error);
    }
}


// this function is used to remove friends 
export const removeFriend = async (firstUserId, secondUserId) => {
    try {
        // delete the friendrequests document - this will trigger
        // a cloud function that will update the corresponding users friends array automatically
        
        // firs we need to find the associated friendrequests document:

        const firstPossibleId = `${firstUserId}${secondUserId}`;
        const secondPossibleId = `${secondUserId}${firstUserId}`;

        let doc1 = await getDoc(doc(db, 'friendrequests', firstPossibleId));

        if (doc1.exists()) {
            await deleteDoc(doc(db, 'friendrequests', firstPossibleId));
        } 
        else {
            await deleteDoc(doc(db, 'friendrequests', secondPossibleId));
        }
    }
    catch (error) {
        console.log('Error while removing friend: ', error);
    }
}


// this function updates the imageURI of the habit passed to it
export const updateHabitImageURI = async (userId, habitIndex, habitType, imageURI, imageName) => {
    try {
        const todayHabitDocument = await getTodaysHabits(userId);
        const currentHabitObject = todayHabitDocument.habits;

        // remove the previous image from the firebase storage if one exists
        if (currentHabitObject[habitType][habitIndex].imageName) {
            const imageRef = ref(storage, `images/${userId}/${currentHabitObject[habitType][habitIndex].imageName}`);
            await (deleteObject(imageRef));
        }

        currentHabitObject[habitType][habitIndex].imageUrl = imageURI; 
        currentHabitObject[habitType][habitIndex].imageName = imageName; 
        const docRef = doc(db, 'dailyhabits', todayHabitDocument.id);
        await updateDoc(docRef, {
            habits: currentHabitObject
        });
        // convert timestamps to string to allow their storage in redux store
        for (const key in currentHabitObject.primary) {
            const completionTime = currentHabitObject.primary[key].completionTime;
            if (completionTime) {
                currentHabitObject.primary[key].completionTime = convertToLocaleTime(completionTime).toISOString();
            }
        }
        return {todayHabits: {habits: currentHabitObject, id: todayHabitDocument.id}};
    }
    catch (error) {
        console.log("Error while updating the habit image URI ", error);
    }
}


// this function retrieves the incoming friend request
// used at the very start in root navigation
export const retrieveIncomingFriendRequestsData = async (userId) => {
    try {
        const incomingRequestQuery = query(collection(db, 'friendrequests'),
         where('receiverId', '==', userId), where('status', '==', 'pending'), orderBy('timestamp', 'desc'));

        const userIds = [];

        snapshot = await getDocs(incomingRequestQuery);
        snapshot.forEach((doc) => {
            userIds.push(doc.data().senderId);
        });
        const userData = await getUsersById(userIds);
        userData.forEach(user => user.type = 'request');
        return userData;
    }
    catch (error) {
        console.log("Error while retrieving the incoming friend requests ", error);
        return []
    }
}



// following function uploads users profile picture url onto firebase
export const updateUserPFPURI = async (userId, downloadURL, imageName) => {
    // check to see if the user already has a pfp - if so, delete their previous image from storage
    const userData = await getUserData(userId);

    if (userData.pfpUrl) {
        const imageRef = ref(storage, `images/${userId}/pfp/${userData.pfpImageName}`);
        await (deleteObject(imageRef));
    }

    const newUpdate = {
        pfpUrl: downloadURL,
        pfpImageName: imageName,
    }

    const privateUserRef = doc(db, 'usersprivate', userId);
    const publicUserRef = doc(db, 'userspublic', userId);

    const batch = writeBatch(db);
    batch.update(privateUserRef, newUpdate);
    batch.update(publicUserRef, newUpdate);
    await batch.commit();
}



// following function retrieves the 10 most recent posts made by friends:
export const retrieveMorePosts = async (userId, friendIds, cursorDoc) => {
    const allIds = [userId, ...friendIds];
    try {
        let retrievedPosts = [];
        let docsQuery;
        if (cursorDoc) {
            // if cursorDoc is present, retrieve another 10 posts - this is for loading more posts.
            const lastRetrievedHabit = await getDoc(doc(db, 'dailyhabits', cursorDoc.id));
            docsQuery = query(
                            collection(db, 'dailyhabits'), 
                            where('ownerId', 'in', allIds),
                            where('atleastOnePrimaryCompleted', '==', true), 
                            orderBy('timestamp', 'desc'), 
                            startAfter(lastRetrievedHabit), 
                            limit(10)
                        );
        }
        else {
            // this is for loading the initial 10 posts or upon reload.
            docsQuery = query(
                            collection(db, 'dailyhabits'), 
                            where('ownerId', 'in', allIds), 
                            where('atleastOnePrimaryCompleted', '==', true), 
                            orderBy('timestamp', 'desc'), 
                            limit(10)
                        );
        }
        const retrievedData = await getDocs(docsQuery);
        
        if (!retrievedData.empty) {
            retrievedData.forEach((doc) => {
                retrievedPosts.push({
                    id: doc.id,
                    ...doc.data(),
                    timestamp: convertToLocaleTime(doc.data().timestamp)
                })
            });
        }
        return retrievedPosts;
    }   
    catch (error) {
        console.log("Error while retrieving the most recent posts made by friends ", error);
    }
}



// following function toggles the like/unlike status of a post for a user
export const toggleLikeStatus = async (habitId, userId) => {
    try {   
        // check see if a document already exists - if not create it:
        const docRef = doc(db, 'postlikes', `${habitId}${userId}`);
        const retrievedDoc = await getDoc(docRef);

        if (!retrievedDoc.exists()) {
            await setDoc(docRef, {
                liked: true,
                habitId: habitId,
                userId: userId,
            })
        }
        else {
            await runTransaction(db, async (transaction) => {
                const currentDoc = await transaction.get(docRef);
                transaction.update(docRef, {
                    liked: !currentDoc.data().liked,
                });
            })
        }
    }
    catch (error) {
        throw error; 
    }
}


// update the device token
export const updateDeviceToken = async (deviceToken, userId) => {
    // update user doc
    const docRef = doc(db, 'usersprivate', userId);

    try {
        await updateDoc(docRef, {
            deviceToken: deviceToken
        })
    }
    catch (error) {
        console.log(error);
    }
}


// following function is used to nudge a user (this happens as a by product via a cloud function)
// users can only create notification documents if the targetId is in the friends list. (via security rules)
export const nudgeUser = async (senderId, receiverId, message, habitName, defaultMessage) => {
    try {
        await addDoc(collection(db, 'notifications'), {
            senderId: senderId,
            receiverId: receiverId, 
            message: message,
            habitName: habitName,
            defaultMessage: defaultMessage, 
            read: false,
            timestamp: serverTimestamp(),
        });
    }
    catch (error) {
        console.log("error while nudging a user ", error);
    }
}


// reply to a notification object 
export const replyToNudge = async (notificationData, reply, isEmoji) => {
    try {
        await addDoc(collection(db, 'notifications'), {
            senderId: notificationData.receiverId,
            receiverId: notificationData.senderId, 
            message: reply,
            isEmoji: isEmoji,
            habitName: notificationData.habitName,
            read: false,
            reply: true,
            originalDocumentId: notificationData.id,
            timestamp: serverTimestamp(),
        });
    }
    catch (error) {
        console.log("error while trying to reply to a nudge ", error);
    }
}



// following function is used to change the read status of a notification
export const setNotificationsReadStatus = async (notificationIds) => {
    try {
        notificationIds.forEach(async (documentId) => {
            await updateDoc(doc(db, 'notifications', documentId), {
                read: true,
            });
        })

    }   
    catch (error) {
        console.log("error while setting the read status of a notification document ", error);
    }
}


// following function is used to add the notification id (not the document the actual notification) to the document itself
export const addNotificationID = async (notificationId, notificationDocId) => {
    try {
        await updateDoc(doc(db, 'notifications', notificationDocId), {
            notificationId: notificationId
        })
    }
    catch (error) {
        console.log("error while adding notification id ", error)
    }
}


// following function is used to check if a particular group name already exists
export const groupExists = async (groupName) => {
    try {
        const docQuery = query(collection(db, 'groups'), where('lowercasedname', '==', groupName.toLowerCase()));
        const groupDoc = await getDocs(docQuery);
        if (!groupDoc.empty) {
            return true
        }
        else return false;

    }
    catch (error) {
        console.log("error while looking for a group ", error);
    }
}


// following function creates a group
export const createGroup = async (userId, friendsToInvite, groupName, imageUrl) => {
    try {
        const docQuery = query(collection(db, 'groups'), where('lowercasedname', '==', groupName.toLowerCase()));
        const groupDoc = await getDocs(docQuery);
        if (!groupDoc.empty) {
            throw new Error('Group already exists.');
        }
        const docRef = await addDoc(collection(db, 'groups'), {
            ownerId: userId,
            lowercasedname: groupName.toLowerCase(),
            name: groupName,
            members: [userId],
            open: true,
            invited: friendsToInvite,
            groupImage: imageUrl ? imageUrl : null,
        });
        await updateDoc(doc(db, 'usersprivate', userId), {
            membersOf: arrayUnion(docRef.id),
        });
        // invite the users
        friendsToInvite.forEach(async id => {
            await addDoc(collection(db, 'notifications'), {
                receiverId: id,
                senderId: userId,
                read: false,
                status: 'pending',
                timestamp: serverTimestamp(),
                type: 'group-invitation',
                groupName: groupName,
                groupId: docRef.id,
                groupImage: imageUrl ? imageUrl : null,
                members: [userId]
            })
        })
    }
    catch (error) {
        console.log("error during group creation ", error);
        throw error;
    }
}


// following function responds to a group invitation
export const respondToGroupInvite = async (notificationId, response) => {
    try {
        await updateDoc(doc(db, 'notifications', notificationId), {
            status: response,
        })
    }   
    catch (error) {
        console.log("error while responding to group invite ", error);
    }
}