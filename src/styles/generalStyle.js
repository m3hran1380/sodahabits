import { Dimensions } from "react-native";

const generalStyles = {
    container: {
        flex: 1,
        marginHorizontal: 30,
        paddingTop: 75,
        paddingBottom: 40,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    h1: {
        fontSize: 35,
        fontFamily: 'elephant',
        textAlign: 'center'
    },
    normalText: {
        fontFamily: 'inter',
        textAlign: 'center',
        fontSize: 17,
    },
};

export const screenWidth = Dimensions.get('window').width - generalStyles.container.marginHorizontal * 2;
export const actualScreenWidth = Dimensions.get('window').width;


export const colors = {
    primaryColor: '#635E5E',
    backgroundColorPrimary: '#122746',
    habitColorPrimary: '#363b64'
}

export default generalStyles;