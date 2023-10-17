import { getUserData, getTodaysHabits, syncWeeklyTrackers } from "./firestoreFunctions";


export const initialiseApp = async (userId) => {
    let userData;
    const data = await getUserData(userId);
    if (data) {
        if (data.onboarding) {
            const todayHabits = await getTodaysHabits(userId);
            await syncWeeklyTrackers(userId);
            userData = {uid: userId, ...data, todayHabits: todayHabits.habits}
        }
        else {
            userData = {uid: userId, ...data}
        }
    }
    else {
        userData = {uid: userId}
    }
    return userData;
}