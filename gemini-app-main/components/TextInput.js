import React from 'react';
import { TextInput, View, StyleSheet, Image, Platform } from 'react-native';
import { TextInput as PaperTextInput, DefaultTheme, Surface } from 'react-native-paper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors, config, fonts } from '../utils/constant';

//TextInput COMPONENT
export const CustomTextInput = (props) => {
    let { dense = true, isCommon = false
        , textColor = colors.accent_color, inputHeight, roundness = 12, textInputRef, placeholder, value, placeholderTextColor, keyboardType, textContentType, onFocus, onBlur, children,
        onChangeText, secureTextEntry, icon, editable, maxLength, textInputStyle, containerStyle, numberOfLines,
        autoCapitalize, returnKeyType, onSubmitEditing, blurOnSubmit, multiline, setHidePass, textAlignVertical } = props
    if (isCommon) {
        return (
            <PaperTextInput
                ref={textInputRef}
                mode={"outlined"}
                theme={{
                    roundness: roundness,
                    mode: 'exact',
                    colors: {
                        placeholder: placeholderTextColor,
                        primary: colors.primary_color,
                        text: textColor,
                    },
                    fonts: {
                        regular: fonts.book,
                    },

                }}
                outlineColor={"white"}
                label={placeholder}
                style={{
                    fontSize: moderateScale(14),
                    // marginHorizontal: moderateScale(10),
                    backgroundColor: "white",
                    fontFamily: fonts.regular,
                    lineHeight: verticalScale(45),
                    height: inputHeight ? inputHeight : verticalScale(45),
                    paddingTop: 0,
                    shadowColor: "#838383",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                    elevation: 5,
                    borderRadius: moderateScale(12),
                    width: "98%",
                    alignSelf: "center"
                }}
                right={
                    textContentType == "password" ? <PaperTextInput.Icon
                        style={{ top: -verticalScale(6), position: "absolute" }}
                        name={secureTextEntry ? 'eye' : 'eye-off'}
                        onPress={() => setHidePass(!secureTextEntry)}
                    /> : null
                }
                left={
                    textContentType == "fees" ? <PaperTextInput.Affix
                        text="$" textStyle={{ color: colors.accent_color, alignSelf: "center", top: verticalScale(5) }}
                    /> : null
                }
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                textContentType={textContentType !== "fees" ? textContentType : "none"}
                value={value}
                numberOfLines={numberOfLines}
                textAlignVertical={textAlignVertical}
                editable={editable}
                maxLength={maxLength}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize}
                returnKeyType={returnKeyType == "none" ? Platform.OS == "ios" ? "default" : returnKeyType : returnKeyType}
                onSubmitEditing={onSubmitEditing}
                blurOnSubmit={blurOnSubmit}
                onFocus={onFocus}
                onBlur={onBlur}
                multiline={multiline}
            // dense={dense}
            />
        )
    } else {
        return (
            <View style={[styles.viewContainer, containerStyle]}>
                {/* {icon ? <Image style={styles.imageStyle} source={icon} /> : <View />} */}
                <TextInput
                    placeholderTextColor={placeholderTextColor}
                    ref={textInputRef}
                    style={[styles.textInputStyle, textInputStyle]}
                    placeholder={placeholder}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    textContentType={textContentType}
                    value={value}
                    numberOfLines={numberOfLines}
                    textAlignVertical={textAlignVertical}
                    editable={editable}
                    maxLength={maxLength}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    blurOnSubmit={blurOnSubmit}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    multiline={multiline}
                    underlineColorAndroid='transparent'
                />{children}
                {/* {textContentType == "password" ?
                    <Icon
                        name={!secureTextEntry ? 'eye' : 'eye-slash'}
                        size={15}
                        color={colors.primary_color}
                        onPress={() => setHidePass(!secureTextEntry)}
                    /> : <View />} */}
                {icon ? <Image style={styles.imageStyle} source={icon} /> : <View />}
            </View>
        );
    }
};

CustomTextInput.defaultProps = {
    textInputRef: null,
    placeholder: "",
    value: "",
    keyboardType: "default",
    textContentType: "none",
    secureTextEntry: false,
    icon: "",
    editable: true,
    // maxLength: 25,
    autoCapitalize: "none",
    returnKeyType: 'done',
    blurOnSubmit: true,
    onSubmitEditing: null,
    textInputStyle: {}
};

const styles = StyleSheet.create({
    viewContainer: {
        paddingLeft: moderateScale(10),
        paddingRight: moderateScale(10),
        borderRadius: moderateScale(8),
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        height: verticalScale(42),
    },
    imageStyle: {
        height: verticalScale(20),
        width: scale(20)
    },
    textInputStyle: {
        fontFamily: fonts.regular,
        // marginLeft: moderateScale(8),
        height: verticalScale(42),
        flex: 1,
        color: "#000000"
    },
    lineStyle: {
        height: 1,
        marginTop: 0,
        marginLeft: moderateScale(5),
        marginRight: moderateScale(5),
        backgroundColor: 'lightgray',
    },
});


