import React, { Component, useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, Image, Dimensions, SafeAreaView,
  TouchableOpacity,
  StatusBar, FlatList, Platform, ImageBackground
} from 'react-native';

import { colors, fonts } from '../utils/constant';
import HomeScreenCell from './HomeScreenCell';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../utils/constant';
import Loader from '../components/Loader';
import fetch from '../services/fetch';
function HomeScreen(props) {

  const { navigation } = props

  const [pagination, setPagination] = useState(10);
  const [AllData, setAllData] = useState([]);
  const [Loading, setLoader] = useState(false);
  const [token, setToken] = useState("");
  const [type, setType] = useState("pendding")
  const [available_points, setAvailablePoints] = useState("0.00");
  const [isRefreshing, setRefreshing] = useState(false)
  const [data, setData] = useState([{
    shippingType: "Express Shipping",
    code: "# TN12345",
    name: "Steven M. Patch",
    contact: "+1 195 1965 5465",
    pickUpDate: "10-3-2022",
    deliveryDate: "15-3-2022",
    pickUpLocation: "4558 Street Name, City Texas 75245.",
    deliveryLocation: "4558 Street Name, City Texas 75245.",
    price: "$ 120.00"
  },
  {
    shippingType: "Standard Shipping",
    code: "# TN12345",
    name: "Steven M. Patch",
    contact: "+1 195 1965 5465",
    pickUpDate: "10-3-2022",
    deliveryDate: "15-3-2022",
    pickUpLocation: "4558 Street Name, City Texas 75245.",
    deliveryLocation: "4558 Street Name, City Texas 75245.",
    price: "$ 120.00"
  }, {
    shippingType: "Express Shipping",
    code: "# TN12345",
    name: "Steven M. Patch",
    contact: "+1 195 1965 5465",
    pickUpDate: "10-3-2022",
    deliveryDate: "15-3-2022",
    pickUpLocation: "4558 Street Name, City Texas 75245.",
    deliveryLocation: "4558 Street Name, City Texas 75245.",
    price: "$ 120.00"
  }, {
    shippingType: "Express Shipping",
    code: "# TN12345",
    name: "Steven M. Patch",
    contact: "+1 195 1965 5465",
    pickUpDate: "10-3-2022",
    deliveryDate: "15-3-2022",
    pickUpLocation: "4558 Street Name, City Texas 75245.",
    deliveryLocation: "4558 Street Name, City Texas 75245.",
    price: "$ 120.00"
  },
  {
    shippingType: "Standard Shipping",
    code: "# TN12345",
    name: "Steven M. Patch",
    contact: "+1 195 1965 5465",
    pickUpDate: "10-3-2022",
    deliveryDate: "15-3-2022",
    pickUpLocation: "4558 Street Name, City Texas 75245.",
    deliveryLocation: "4558 Street Name, City Texas 75245.",
    price: "$ 120.00"
  }, {
    shippingType: "Express Shipping",
    code: "# TN12345",
    name: "Steven M. Patch",
    contact: "+1 195 1965 5465",
    pickUpDate: "10-3-2022",
    deliveryDate: "15-3-2022",
    pickUpLocation: "4558 Street Name, City Texas 75245.",
    deliveryLocation: "4558 Street Name, City Texas 75245.",
    price: "$ 120.00"
  }])


  const _retrieveData = async (status) => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        // We have data!!
        const userData = JSON.parse(value);
        setToken(userData.token)
        getData(userData.token, status, 1)
        getPoint(userData.token)
        // setAvailablePoints(userData.available_coin == null ? "0.00" : userData.available_coin)
        console.log('_retrieveData', JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
      setToken("")
    }
  };

  // useEffect(() => {
  //   _retrieveData("pendding");
  // }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      setType("pendding")
      _retrieveData("pendding");
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;

  }, [navigation]);


  function getPoint(token) {
    let data = {}
    fetch.get(API_URL + '/user/wallet_list', data, token)
      .then((result) => {
        console.log("result", result)
        if (result.status && result.status == 200) {
          setLoader(false)
          if (result.data.wallet) {
            if (result.data.wallet.length > 0) {
              setAvailablePoints(result.data.available_coin)
            }
          } else {
            setAvailablePoints("0.00")
          }
        } else {
          setAvailablePoints("0.00")
        }
      })
      .catch((error) => {
        console.log("error", error)
        setAvailablePoints("0.00")
      })
  }

  function getData(token, status, value) {
    if (value == 1)
      setLoader(true)
    const formData = new FormData();
    formData.append('limit', pagination);
    formData.append('offset', 0);
    formData.append('status', status);
    fetch.post(API_URL + '/user/pakageList', formData, "POST", "formData", token)
      .then((result) => {
        setLoader(false)
        console.log("result", result)
        if (result.status && result.status == 200) {
          setLoader(false)
          setAllData(result.data)
        } else {
          setAllData([])
        }
      })
      .catch((error) => {
        console.log("error", error)
        setLoader(false)
        setAllData([])
      })
  }

  // console.log("type",type)

  function onPressType(value) {
    if (value == 1) {
      setType("pendding")
      getData(token, "pendding", 1)
    } else {
      setType("completed")
      getData(token, "completed", 1)
    }
  }

  function render({ item, index }) {
    return <HomeScreenCell
      // onPress={()=>props.navigation.navigate('PointScreen')}
      // onPressCoin={()=>props.navigation.navigate('ShippingScreen')}
      onPressBlock={() => props.navigation.navigate('ShippingScreen', { expressDetails: item, type })}
      onPressCoin={() => console.log("I am coin")}
      shippingType={item.service_type}
      code={item.order_number}
      price={item.coin}
      customer_name={item.sender}
      customer_contact={item.tracking_number}
      pickup_date={item.pickup_date}
      deliver_date={item.delivery_date}
      pickup_location={item.address}
      deliver_location={item.delivery_address}
      tracking_no={item.tracking_number}
    />
  }
  return (
    <View style={styles.MainContainer}>
      {Loading && (
        <View>
          <Loader />
        </View>
      )}
      {Platform.OS === 'ios' ? (
        <StatusBar backgroundColor={'#132E5B'} barStyle="light-content" />
      ) : (
        <StatusBar backgroundColor={'#132E5B'} barStyle="light-content" />
      )}
      <ImageBackground
        source={require('../assets/images/mapback.png')}
        resizeMode="cover"
        style={styles.image}
      />
      <View style={[styles.titleBarContainer]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => props.navigation.navigate('PointScreen')}>
          <ImageBackground resizeMode={"contain"} style={{ height: 80, width: 130, justifyContent: "center", alignItems: "center" }} source={require("../assets/icons/bg.png")}>
            <Text style={[styles.titleText]}>{available_points}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
      <View style={styles.CenterView}>
        <View height={20} />
        <View style={styles.viewContainer}>
          <TouchableOpacity style={[styles.viewContainer2, { backgroundColor: type == "pendding" ? colors.primary_color : colors.white_color }]}
            onPress={() => {
              onPressType(1)
            }}>
            <Text style={[styles.textContainer1, { color: type == "pendding" ? "white" : colors.text_color }]}>Pending</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.viewContainer2, { backgroundColor: type == "completed" ? colors.primary_color : colors.white_color }]}
            onPress={() => {
              onPressType(2)
            }}>
            <Text style={[styles.textContainer1, { color: type == "completed" ? "white" : colors.text_color }]}>Completed</Text>
          </TouchableOpacity>
        </View>
        {AllData.length > 0 ? <FlatList
          style={{ flex: 1, marginTop: 20 }}
          data={AllData}
          renderItem={render}
          keyExtractor={(item, index) => index.toString()}
          refreshing={isRefreshing}
          onRefresh={() => {
            setRefreshing(true)
            getData(token, type, 2)
          }}
        /> : <View style={styles.noRecordContainer}>
          <Text style={styles.textContainer2}>No Packages Found</Text>
        </View>}
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  titleBarContainer: {
    height: 70,
    backgroundColor: '#132E5B',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    width: '100%',
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: "row"
  },
  titleText: {
    fontSize: 17,
    fontFamily: fonts.regular,
    color: colors.primary_color,
    alignItems: "center",
    alignSelf: "center"
  },
  MainContainer: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop:30,
    backgroundColor: colors.main_bg_color
  },
  CenterView: {
    width: Dimensions.get('window').width,
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    // alignItems: 'center',
    alignSelf: "center"
  },
  viewContainer: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
    backgroundColor: colors.white_color,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderRadius: 30,
    flexDirection: "row",
    height: 50,
    width: "75%",
    alignSelf: "center"
  },
  viewContainer2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  textContainer1: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.text_color
  },
  image: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  noRecordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer2: {
    fontFamily: fonts.medium,
    fontSize: 20,
    color: colors.title_color
  },
});

export default HomeScreen;
