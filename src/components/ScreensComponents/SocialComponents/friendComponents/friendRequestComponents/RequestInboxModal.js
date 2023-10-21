import { StyleSheet, Text, View } from 'react-native'
import CustomModal from '../../../../sharedComponents/CustomModal'


const RequestInboxModal = ({ closeModal, status, style }) => {
    return (
        <CustomModal closeModal={closeModal} status={status} style={style} > 
        
        </CustomModal>
    )
}

export default RequestInboxModal

const styles = StyleSheet.create({})