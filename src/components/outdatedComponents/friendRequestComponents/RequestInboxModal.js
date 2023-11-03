import { StyleSheet, Text, View, FlatList } from 'react-native';
import CustomModal from '../../../../sharedComponents/CustomModal';
import { useSelector } from 'react-redux';
import generalStyles, { actualScreenHeight } from '../../../../../styles/generalStyle';
import { useEffect, useState } from 'react';
import { getUsersById } from '../../../../../businessLogic/firestoreFunctions';
import RetrievedUserRequest from './RetrievedUserRequest';


const RequestInboxModal = ({ closeModal, status, style }) => {
    const {incomingRequests, outgoingRequests} = useSelector(state => state.friends);
    const [incomingRequestsData, setIncomingRequestsData] = useState();
    const [outgoingRequestsData, setOutgoingRequestsData] = useState();

    // retrieve the user profile informations - INCOMING:
    useEffect(() => {
        const incomingUserIds = incomingRequests.map((request) => request.senderId);
        (async () => {
            const retrievedData = await getUsersById(incomingUserIds);
            setIncomingRequestsData(retrievedData);
        })();
    }, [incomingRequests, setIncomingRequestsData])

    // retrieve the user profile informations - OUTGOING:
    useEffect(() => {
        const outgoingUserIds = outgoingRequests.map((request) => request.receiverId);
        (async () => {
            const retrievedData = await getUsersById(outgoingUserIds);
            setOutgoingRequestsData(retrievedData);
        })();
    }, [outgoingRequests, setOutgoingRequestsData])


    return (
        <CustomModal closeModal={closeModal} status={status} style={style}>
            <View style={styles.innerContainer}>
                <Text style={[generalStyles.h3, styles.text]}>Incoming Friend Requests</Text>
                <FlatList 
                    data={incomingRequestsData}
                    renderItem={(request) => {
                        return <RetrievedUserRequest type='incoming' userData={request.item} />
                    }}
                    keyExtractor={(data) => data.id}
                />
            </View>
            <View style={styles.innerContainer}>
                <Text style={[generalStyles.h3, styles.text]}>Outgoing Friend Requests</Text>
                <FlatList 
                    data={outgoingRequestsData}
                    renderItem={(request) => {
                        return <RetrievedUserRequest type='outgoing' userData={request.item} />
                    }}
                    keyExtractor={(data) => data.id}
                />
            </View>
        </CustomModal>
    )
}

export default RequestInboxModal

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        color: 'black',
        marginVertical: 10,
    },
    innerContainer: {
        height: 0.3 * actualScreenHeight - 35,
        marginBottom: 5
    }
})