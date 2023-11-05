import { getUserData, getTodaysHabits, syncWeeklyTrackers, retrieveLatestWeeklyTrackers, convertToLocaleTime } from "./firestoreFunctions";


export const initialiseApp = async (userId) => {
    let userData;
    const data = await getUserData(userId);
    if (data) {
        if (data.onboarding) {
            // this section is only ran when the user logs in after their registration. 
            // (we don't need to synchronise weekly trackers upon registration)
            const todayHabits = await getTodaysHabits(userId);

            // sync the weekly trackers to ensure we have one document for each week till now
            await syncWeeklyTrackers(userId);

            // retrieve the last 10 weekly trackers (retrieve more upon request)
            const latestWeeklyTrackers = await retrieveLatestWeeklyTrackers(userId, 10);

            // convert the timestamps to ISOSTRING timestamps so they can be stored in redux store
            latestWeeklyTrackers.forEach((tracker) => {
                tracker.timestamp = tracker.timestamp.toISOString();
            })
            for (const key in todayHabits.habits.primary) {
                const completionTime = todayHabits.habits.primary[key].completionTime;
                if (completionTime) {
                    todayHabits.habits.primary[key].completionTime = convertToLocaleTime(completionTime).toISOString();
                }
            }
            userData = {uid: userId, ...data, todayHabits: {habits: todayHabits.habits, id: todayHabits.id}, weeklyTrackers: latestWeeklyTrackers}
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