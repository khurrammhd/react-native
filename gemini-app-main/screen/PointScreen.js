import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { Component, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ImageBackground, Platform
} from 'react-native';
import Loader from '../components/Loader';
import fetch from '../services/fetch';
import { API_URL, colors, config, fonts } from '../utils/constant';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
function PointScreen(props) {
  const [token, setToken] = useState("");
  const [Loading, setLoader] = useState(false);
  const [available_points, setAvailablePoints] = useState("0.00");
  const [total_earn, setTotalEarn] = useState("0.00");
  const [pointData, SetPointData] = useState([])

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        // We have data!!
        const userData = JSON.parse(value);
        setToken(userData.token)
        getData(userData.token)
        console.log('_retrieveData', JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
      setToken("")
    }
  };

  useEffect(() => {
    _retrieveData();
  }, [])


  function getData(value) {
    let data = {}
    setLoader(true)
    fetch.get(API_URL + '/user/wallet_list', data, value)
      .then((result) => {
        setLoader(false)
        console.log("result", result)
        if (result.status && result.status == 200) {
          setLoader(false)
          if (result.data.wallet) {
            if (result.data.wallet.length > 0) {
              SetPointData(result.data.wallet)
              setAvailablePoints(result.data.available_coin)
              setTotalEarn(result.data.total_coin)
            }
          } else {
            SetPointData([])
          }
        } else {
          SetPointData([])
        }
      })
      .catch((error) => {
        console.log("error", error)
        setLoader(false)
        SetPointData([])
      })
  }



  const Item = ({ data }) => (
    <View style={styles.item}>
      <View
        style={{
          paddingLeft: 5,
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <Text style={styles.title}>{data.transaction_no}</Text>
        <Text style={styles.timer}>{data.amount + " Points"}</Text>
      </View>
    </View>
  );
  const renderItem = ({ item }) => <Item data={item} />;
  const onBackPress = () => {
    console.log('all');
    props.navigation.pop();
  };
  return (
    // <View style={styles.container}>
    <SafeAreaView style={styles.container}>
      {Loading && (
        <View>
          <Loader />
        </View>
      )}
      {Platform.OS === 'ios' ? (
        // <View
        //   style={{
        //     width: '100%',
        //     height: 60,
        //     position: 'absolute',
        //     top: 0,
        //     left: 0,
        //     backgroundColor: '#132E5B',

        //   }}
        // />
        <StatusBar backgroundColor={'#132E5B'} barStyle="light-content" />
      ) : (
        <StatusBar backgroundColor={'#132E5B'} barStyle="light-content" />
      )}
      <View style={[styles.titleBarContainer, styles.elevation]}>
        <TouchableOpacity
          onPress={() => onBackPress()}
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingVertical: 5,
            // backgroundColor:"red"
          }}>
          <Image
            resizeMode="cover"
            source={require('../assets/icons/left-back.png')} //Change your icon image here
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: ' #132E5B',
            // color:"white"
          }}>
          <Text onPress={() => { }} style={styles.titleText}>
            Points
          </Text>
        </View>
      </View>

      {pointData.length > 0 ? <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingVertical: 20,
          width: '100%',
        }}>
        <View style={styles.box}>
          <View style={{ flexDirection: 'row' }}>
            <View width={'30%'} style={{ justifyContent: 'center' }}>
              <Image
                resizeMode="cover"
                source={require('../assets/icons/money.png')} //Change your icon image here
                style={styles.ImageStyle}
              />
            </View>
            <View width={'70%'}>
              <Text style={styles.textLabel}>Available Points</Text>
              <Text style={styles.textPoints}>{available_points + " Points"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.box}>
          <View style={{ flexDirection: 'row' }}>
            <View width={'30%'} style={{ justifyContent: 'center' }}>
              <Image
                resizeMode="cover"
                source={require('../assets/icons/money.png')} //Change your icon image here
                style={styles.ImageStyle}
              />
            </View>
            <View width={'70%'}>
              <TouchableOpacity>
                <Text style={styles.textLabel}>Total Earns</Text>
                <Text style={styles.textPoints}>{config.currency + " " + total_earn}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View> : console.log("")}

      {pointData.length > 0 ? <View
        style={{
          //   paddingVertical: 10,
          width: '100%',
          // flex: 1,
          paddingHorizontal: 15,
          //   justifyContent: 'center',
          //   marginBottom:20,
        }}>
        <FlatList
          data={pointData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          // style={{marginBottom:50}}
          style={{
            // flex: 1,
            borderRadius: 10,
            backgroundColor: 'white',
            paddingHorizontal: 10,
            paddingVertical: 20,
            // marginBottom:30
          }}
          // contentContainerStyle={{ paddingBottom: 100 }}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  marginVertical: 20,
                  backgroundColor: 'gray',
                  height: 1,
                }}
              />
            );
          }}
        />
      </View> : <View style={styles.noRecordContainer}>
        <Text style={styles.textContainer2}>No Data Found</Text>
      </View>}
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: width,
    height: height,
    // padding: 20,
    backgroundColor: '#E5E5E5',
  },
  textLabel: {
    fontFamily: fonts.regular,
    justifyContent: 'center',
    color: colors.accent_color
  },
  textPoints: {
    marginTop: 5,
    fontFamily: fonts.semibold,
    color: colors.accent_color
  },
  ImageStyle: {
    justifyContent: 'center',

    height: 30,
    width: 30,
  },
  box: {
    backgroundColor: 'white',
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    width: '45%',
    // height: 71,
    // padding: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    ...Platform.select({
      ios: {
        shadowColor: "white",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  titleBarContainer: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#132E5B',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,

    width: '100%',
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  item: {
    width: '100%',
    // backgroundColor: 'white',
    // paddingHorizontal: 12,
    // paddingVertical: 15,
    // marginVertical: 8,
    // borderRadius: 10,
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.regular,
  },
  timer: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    // marginTop: 10,
    color: 'black',
  },
  image: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },

  elevation: {
    elevation: 20,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
  },
  titleText: {
    fontSize: 22,
    fontFamily: fonts.semibold,
    color: 'white',
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

export default PointScreen;
