import ContentLoader, { Rect, Circle } from "react-content-loader/native";
import { View, StyleSheet } from "react-native";
import { availableScreenWidth, colors } from "../../../../../styles/generalStyle";

const UserLoadingSkeleton = () => (
    <View style={styles.container}>
        <ContentLoader 
            speed={2}
            width={availableScreenWidth - 20}
            height={50}
            viewBox={`0 0 ${availableScreenWidth - 20} 50`}
            backgroundColor={colors.backgroundColorQuarternary}
            foregroundColor={colors.backgroundColorSecondary}
        >
            <Circle cx="30" cy="25" r="20" /> 
            <Rect x="58" y="13" rx="4" ry="4" width={availableScreenWidth*0.5} height="10" /> 
            <Rect x="58" y="28" rx="4" ry="4" width={availableScreenWidth*0.3} height="10" />
        </ContentLoader>
    </View>
)

export default UserLoadingSkeleton;


const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundColorPrimary,
        height: 50,
        marginHorizontal: 10,
        borderRadius: 10,
        marginVertical: 2,
    }
})
