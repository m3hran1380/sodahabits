import ContentLoader, { Circle } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";
import { availableScreenWidth2, colors } from "../../styles/generalStyle";

const UserLoadingSkeleton = () => {
    const diameter = (availableScreenWidth2/3) * 0.7;
    return (
        <View style={styles.container}>
            <ContentLoader 
                speed={2}
                width={diameter}
                height={diameter}
                viewBox={`0 0 ${diameter} ${diameter}`}
                backgroundColor='#3C3C3C'
                foregroundColor='#171717'
            >
                <Circle cx={`${diameter/2}`} cy={`${diameter/2}`} r={`${diameter/2}`} /> 
            </ContentLoader>
        </View>
    )
}

export default UserLoadingSkeleton;


const styles = StyleSheet.create({
    container: {
        width: availableScreenWidth2/3,
        height: availableScreenWidth2/3,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
