import { StyleSheet, View, Text, Pressable, Image, TextInput } from 'react-native';
import generalStyles, { actualScreenHeight, availableScreenWidth2, colors, textStyle } from '../../../../styles/generalStyle';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButtonIcon from '../../../../../assets/svgs/Icons/socialIcons/friendIcons/backButton.svg';
import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import DefaultGroupPicture from '../../../../../assets/svgs/defaultPfps/default1.svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { debounce } from 'lodash';
import { groupExists } from '../../../../businessLogic/firestoreFunctions';


const GroupCreationScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [groupName, setGroupName] = useState(null);
    const [groupAlreadyExists, setGroupAlreadyExists] = useState(null);
    const [searching, setSearching] = useState(false);

    const debouncedGroupSearch = useCallback(
        debounce((userInput) => {
            groupExists(userInput).then((results) => {
                setGroupAlreadyExists(results);
                setSearching(false);
            })
    }, 500), []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) setImage(result.assets[0].uri);
    }

    const handleInput = (input) => {
        setGroupName(input);
        if (!input) setGroupAlreadyExists(null);
        if (input) {
            setSearching(true);
            debouncedGroupSearch(input);
        }
    }

    return (
        <View style={styles.parentContainer}>
            <SafeAreaView style={[generalStyles.containerNoMargin, styles.container]}>
                <KeyboardAwareScrollView 
                    enableOnAndroid={true} 
                    style={{flex: 1}}
                    extraScrollHeight={0.15 * actualScreenHeight}
                    keyboardShouldPersistTaps='always'
                >               
                    <View style={styles.headerTextContainer}>
                        <Text style={[generalStyles.h2, styles.headerText]}>Create a gorup</Text>
                        <Pressable style={styles.backBtn} onPress={() => {navigation.goBack()}}><BackButtonIcon width='100%' height='100%' /></Pressable>
                    </View>
                    <View style={styles.innerContainer}>
                        <View style={styles.groupImageContainer}>
                            {image ?
                                <Image resizeMode='contain' source={{ uri: image }} style={styles.image} />
                            :
                                <DefaultGroupPicture width='100%' height='100%' style={styles.defaultImage} />
                            }
                            <Pressable onPress={pickImage} style={styles.addImageBtn}>
                                {({pressed}) => <Text style={[styles.text, pressed && {color: 'black'}]}>{image ? 'Change' : 'Add image'}</Text>}
                            </Pressable>
                        </View>
                        <TextInput 
                            placeholderTextColor={'#838383'}
                            value={groupName} 
                            onChangeText={handleInput} 
                            style={[
                                styles.textInput, 
                                {borderColor: !groupName ? 'black' : groupAlreadyExists === null ? 'black' : groupAlreadyExists ? 'red' : 'green'}, 
                                searching && {borderColor: 'black'}
                            ]} 
                            placeholder='Enter group name' 
                            multiline={true}
                        />
                        <Text style={styles.paragraph}>As a group you can grow together, contribute towards a group fund to purchase exclusive properties and more.</Text>
                        
                        <Pressable 
                            disabled={searching || !groupName || groupAlreadyExists} 
                            onPress={() => navigation.navigate('invite friends screen', {groupName: groupName, image: image})} 
                            style={[styles.nextBtn, (searching || !groupName || groupAlreadyExists) && styles.nextBtnDisabled]}
                        >
                            {({pressed}) => 
                                <Text style={[styles.nextBtnText, pressed && {color: 'black'}, (searching || !groupName || groupAlreadyExists) && styles.nextBtnDisabled]}>Next</Text>
                            }
                        </Pressable>

                    </View>
                </KeyboardAwareScrollView> 
            </SafeAreaView>
        </View>
    )
}


export default GroupCreationScreen


const styles = StyleSheet.create({
    parentContainer: {
        flex: 1, 
        backgroundColor: colors.backgroundColorPrimary
    },
    container: {
        paddingTop: 40,
    },
    headerText: {
        color: 'white',
        textAlign: 'left',
        bottom: 5,
    },
    headerTextContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
    },
    backBtn: {
        height: 20,
        width: 20,
        position: 'absolute',
        right: 0,
    },
    groupImageContainer: {
        width: availableScreenWidth2/2,
        height: availableScreenWidth2/2,
        borderRadius: availableScreenWidth2/10,
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        backgroundColor: '#3C3C3C'
    },
    innerContainer: {
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 1,
    },
    defaultImage: {
        top: '-10%'
    },
    addImageBtn: {
        paddingVertical: 1,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 0.5,
        position: 'absolute',
        bottom: '5%',
        backgroundColor: '#59B9FF'
    },
    nextBtn: {
        paddingVertical: 1,
        paddingHorizontal: 5,
        borderRadius: 10,
        borderColor: 'black',
        borderWidth: 0.5,
        backgroundColor: '#59B9FF'
    },
    text: {
        ...textStyle.allTextBold,
        textAlign: 'center',
        color: 'white'
    },
    nextBtnText: {
        ...textStyle.allTextBold,
        textAlign: 'center',
        color: 'white',
        fontSize: 18,
    },
    paragraph: {
        ...textStyle.allText,
        textAlign: 'center',
        color: 'white',
        paddingHorizontal: '10%',
        marginVertical: '5%'
    },
    textInput: {
        backgroundColor: '#383838',
        color: 'white',
        width: availableScreenWidth2,
        paddingHorizontal: '3%', 
        paddingVertical: 2,
        fontSize: 15,
        textAlign: 'center',
        borderRadius: 5,
        marginTop: 20,
        borderWidth: 1,
    },
    nextBtnDisabled: {
        backgroundColor: '#878787',
        color: '#4c4c4c'
    }
})


