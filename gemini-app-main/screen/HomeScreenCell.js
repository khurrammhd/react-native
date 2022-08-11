import React from 'react';
import { TouchableOpacity, Text, TextInput, View, StyleSheet, Image, Dimensions, FlatList } from 'react-native';
import { colors, fonts } from '../utils/constant';

import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default HomeScreenCell = ({ shippingType, code, onPressBlock, onPressCoin, price, customer_name, customer_contact, pickup_date,
    deliver_date, pickup_location, deliver_location, tracking_no }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPressBlock}>
            <View style={Styles.viewContainer}>
                <View style={Styles.viewContainer1}>
                    <View width={"65%"} >
                        <Text style={Styles.TextContainer1}>{shippingType}</Text>
                        <Text style={{ fontSize: 12, fontFamily: fonts.regular, color: colors.text_color }}>{code}</Text>
                    </View>
                    {price !== '0.00' && <View width={"35%"}>
                        <View style={{
                            backgroundColor: "#0C1D39", paddingHorizontal: 17, paddingVertical: 8,
                            justifyContent: "center", alignItems: "center", borderRadius: 30, flexDirection: "row",

                        }} >

                            <Image style={{ height: 15, width: 15, resizeMode: "contain" }}
                                source={require("../assets/icons/icon.png")} />
                            <Text style={Styles.TextContainer2}>{price}</Text>

                        </View>
                    </View>}
                </View>
                <View style={Styles.lineStyle} />
                <View style={Styles.viewContainer2}>
                    <View style={Styles.viewContainer3}>
                        <Image style={Styles.imageContainer1}
                            source={require("../assets/icons/user.png")} />
                        <View style={Styles.viewContainer4} >
                            <Text style={Styles.TextContainer3}>Sender</Text>
                            <Text style={Styles.TextContainer4}>{customer_name}</Text>
                        </View>
                    </View>
                    <View style={[Styles.viewContainer3]}>
                        <Image style={Styles.imageContainer1}
                            source={require("../assets/icons/phone2.png")} />
                        <View style={Styles.viewContainer4}>
                            <Text style={Styles.TextContainer3}>Tracking No</Text>
                            <Text style={Styles.TextContainer4}>{tracking_no}</Text>
                        </View>
                    </View>
                </View>
                <View height={15} />
                <View style={Styles.viewContainer2}>
                    <View style={Styles.viewContainer3}>
                        <Image style={Styles.imageContainer1}
                            source={require("../assets/icons/calender.png")} />
                        <View style={Styles.viewContainer4} >
                            <Text style={Styles.TextContainer3}>Pickup Date</Text>
                            <Text style={Styles.TextContainer4} >{pickup_date}</Text>
                        </View>
                    </View>
                    <View style={[Styles.viewContainer3, {}]}>
                        <Image style={Styles.imageContainer1}
                            source={require("../assets/icons/calender.png")} />
                        <View style={Styles.viewContainer4}>
                            <Text style={Styles.TextContainer3}>Deliver Date</Text>
                            <Text style={Styles.TextContainer4}>{deliver_date}</Text>
                        </View>
                    </View>
                </View>
                {/* <View height={15} /> */}
                {/* <View style={Styles.viewContainer2}>
                    <View style={Styles.viewContainer3}>
                        <Image style={Styles.imageContainer1}
                            source={require("../assets/icons/location.png")} />
                        <View style={Styles.viewContainer4} >
                            <Text style={Styles.TextContainer3}>Pickup Location</Text>
                            <Text style={Styles.TextContainer4}>{pickup_location}</Text>
                        </View>
                    </View>
                    <View style={[Styles.viewContainer3]}>
                        <Image style={Styles.imageContainer1}
                            source={require("../assets/icons/location.png")} />
                        <View style={Styles.viewContainer4}>
                            <Text style={Styles.TextContainer3}>Deliver Location</Text>
                            <Text style={Styles.TextContainer4}>{deliver_location}</Text>
                        </View>
                    </View>
                </View> */}
            </View >
        </TouchableOpacity>
    );
};
const Styles = StyleSheet.create({
    viewContainer: {
        backgroundColor: "white",
        flex: 1,
        width: "95%",
        marginBottom: 15,
        borderRadius: 10,
        padding: 10,
        alignSelf: "center",
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    viewContainer1: {
        width: "100%",
        alignItems: 'center',
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    viewContainer2: {
        width: "100%",
        alignItems: 'center',
        justifyContent: "space-between",
        flexDirection: 'row',
    },
    viewContainer3: {
        width: "50%",
        alignItems: 'center',
        justifyContent: "flex-start",
        flexDirection: 'row',
    },
    viewContainer4: {
        paddingLeft: 5,
        flex: 1
    },
    imageContainer1: {
        height: 18,
        width: 18,
        resizeMode: "contain"
    },
    lineStyle: {
        height: 1,
        backgroundColor: "lightgrey",
        width: "100%",
        marginVertical: 8
    },
    TextContainer1: {
        color: colors.primary_color,
        fontSize: moderateScale(14),
        fontFamily: fonts.semibold,
        color: "#545454"
    },
    TextContainer2: {
        color: "white",
        fontSize: 14,
        fontFamily: fonts.regular,
        paddingLeft: 5
    },
    TextContainer3: {
        color: "grey",
        fontSize: moderateScale(12),
        fontFamily: fonts.regular
    },
    TextContainer4: {
        color: "#545454",
        fontSize: 13,
        fontFamily: fonts.regular
    },
});


