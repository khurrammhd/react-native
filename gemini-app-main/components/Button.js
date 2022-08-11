import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Platform, Image } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { colors, config, fonts } from '../utils/constant';

//Button COMPONENT
export const CustomButton = (props) => {
	let { paperTheme = true, title, buttonStyle, disabled, textStyle, onPress, icon, mainContainerStyle } = props;
	return (
		<TouchableOpacity style={mainContainerStyle} disabled={disabled} activeOpacity={0.8} onPress={onPress}>
			<View style={[styles.buttonStyle, buttonStyle]}>
				{icon && <Image style={styles.imageStyle} source={icon} />}
				<Text style={[styles.textStyle, textStyle]}>
					{title}
				</Text>
			</View>
		</TouchableOpacity>
	)

};

CustomButton.defaultProps = {
	title: "",
	buttonStyle: {},
	textStyle: {}
};

const styles = StyleSheet.create({
	textStyle: {
		color: 'white',
		alignSelf: 'center',
		fontFamily: fonts.regular,
		fontSize: moderateScale(18),
		paddingLeft: moderateScale(10),
		paddingRight: moderateScale(10),
	},
	imageStyle: {
		height: moderateScale(18),
		width: moderateScale(18),
		alignSelf: "center",
		tintColor: "white"
	},
	buttonStyle: {
		borderRadius: moderateScale(25),
		marginLeft: moderateScale(10),
		marginRight: moderateScale(10),
		padding: moderateScale(8),
		justifyContent: 'center',
		flexDirection: "row",
		backgroundColor: colors.accent_color,
		// ...Platform.select({
		// 	ios: {
		// 		shadowColor: 'grey',
		// 		shadowOffset: { width: 1, height: 2 },
		// 		shadowOpacity: 0.8,
		// 		shadowRadius: 4,
		// 	},
		// 	android: {
		// 		elevation: 5,
		// 	},
		// }),
	},
	buttonStyle1: {
		borderRadius: moderateScale(25),
		marginLeft: moderateScale(10),
		marginRight: moderateScale(10),
		justifyContent: "center"
		// padding: moderateScale(8),
		// justifyContent: 'center',
		// flexDirection: "row",
		// backgroundColor: colors.accent_color,
		// ...Platform.select({
		// 	ios: {
		// 		shadowColor: 'grey',
		// 		shadowOffset: { width: 1, height: 2 },
		// 		shadowOpacity: 0.8,
		// 		shadowRadius: 4,
		// 	},
		// 	android: {
		// 		elevation: 5,
		// 	},
		// }),
	},
});