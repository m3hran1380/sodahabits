import { Dimensions } from "react-native";

const generalStyles = {
    container: {
        flex: 1,
        marginHorizontal: 30,
        paddingTop: 75,
        paddingBottom: 40,
    },
    containerNoMargin: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 75,
        paddingBottom: 40,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    h1: {
        fontSize: 35,
        fontFamily: 'space-grotesk-bold',
        textAlign: 'center'
    },
    h2: {
        fontSize: 25,
        fontFamily: 'space-grotesk-bold',
        textAlign: 'left',
        color: 'white',
    },
    h3: {
        fontSize: 18,
        fontFamily: 'space-grotesk-bold',
        textAlign: 'left',
        color: 'white',
    },
    normalText: {
        fontFamily: 'space-grotesk',
        textAlign: 'center',
        fontSize: 17,
    },
};

export const availableScreenWidth = Dimensions.get('window').width - generalStyles.container.marginHorizontal * 2;
export const availableScreenWidth2 = Dimensions.get('window').width - generalStyles.containerNoMargin.paddingHorizontal * 2;
export const actualScreenWidth = Dimensions.get('window').width;
export const actualScreenHeight = Dimensions.get('window').height;

export const colors = {
    primaryColor: '#635E5E',
    backgroundColorPrimary: '#122746',
    backgroundColorSecondary: '#435477',
    backgroundColorTertiary: '#E3F0FF',
    backgroundColorQuarternary: "#B4C3EC",
    habitColorPrimary: '#363b64',
    habitColorSuccess: '#1a965c',
    colorSuccess: '#06d447',
    colorFailure: '#d9004c',
    colorNull: '#dddddd',
    colorComplete: '#30CB5C',
    colorRejet: '#FF7A00',
}


export const textStyle = {
    allText: {
        fontFamily: 'space-grotesk',
    },
    allTextBold: {
        fontFamily: 'space-grotesk-bold',
    },
    normalText: {
        fontSize: actualScreenWidth > 414 ? 18 : actualScreenWidth > 321 ? 16 : 14,
    },
    h1: {
        fontSize: 35, 
        fontFamily: 'space-grotesk-bold',
    }
}

export default generalStyles;