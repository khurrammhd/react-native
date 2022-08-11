import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  FlatList,
  ImageBackground,
  Pressable,
  ActivityIndicator, Alert
} from 'react-native';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from 'react-native-reanimated';
import { API_URL, fonts } from '../utils/constant';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
function EditProfileScreen(props) {
  const { navigation, route } = props;
  const [ProfileData, setProfileData] = useState();
  const [token, setToken] = useState();
  const [Loading, setLoader] = useState(false);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        // We have data!!
        const userData = JSON.parse(value);

        getProfileData(userData?.token);

        // console.log('_retrieveData', JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      _retrieveData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;

  }, [navigation]);

  function getProfileData(token) {
    setLoader(true);
    var bearer = `Bearer ${token}`;

    fetch(API_URL + '/user/getProfile', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).then(response =>
      response
        .json()
        .then(data => ({
          data: data,
          status: response.status,
        }))
        .then(res => {
          setProfileData(res?.data?.data);
          setLoader(false);
          // console.log('Res', res);
          // props.navigation.navigate('MainScreen');
        })
        .catch(e => console.log(e)),
    );
  }
  // console.log('pro', ProfileData);

  async function handleLogout() {
    await AsyncStorage.removeItem('usertoken');
    await AsyncStorage.removeItem('userAccess');
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Login' },
        ],
      })
    );
  };

  function logout() {
    Alert.alert(
      "Log Out",
      'Are you sure you want to log out?',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => {
            handleLogout()
          },
        },
      ],
      { cancelable: false },
    )
  }


  return (
    // <View style={styles.container}>
    <SafeAreaView style={styles.container}>
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
      {Loading && (
        <View>
          <Loader />
        </View>
      )}
      <View style={[styles.titleBarContainer, styles.elevation]}>
        <TouchableOpacity
          onPress={() => logout()}
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingVertical: 5,
          }}>
          <Image
            resizeMode="contain"
            source={require('../assets/icons/logout.png')} //Change your icon image here
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
          <Text style={styles.titleText}>Profile</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('EditProfileScreen', {
              profileDetails: ProfileData,
            })
          }>
          <Image
            resizeMode="contain"
            source={require('../assets/icons/edit.png')} //Change your icon image here
            style={{ height: 25, width: 25 }}
          />
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require('../assets/images/mapback.png')}
        resizeMode="cover"
        style={styles.image}>
        {ProfileData && (
          <View>
            {/* <ImageBackground source={image} resizeMode="cover" style={styles.image}> */}
            <View
              style={{
                paddingVertical: 10,
                width: '100%',
                paddingHorizontal: 15,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View height={65} />
              <View style={styles.rect}>
                <Image
                  resizeMode="contain"
                  source={require('../assets/images/AccountImage.png')} //Change your icon image here
                  style={{
                    height: 120,
                    width: 120,
                    alignSelf: 'center',
                    marginTop: -70,
                    // alignItems: 'center',
                    // justifyContent: 'center',
                  }}
                />
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                      marginTop: 20,
                    }}>
                    <Text style={styles.textLeft}>First name</Text>
                    <Text style={styles.textRight}>
                      {ProfileData?.first_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 20,
                      backgroundColor: 'gray',
                      height: 0.5,
                    }}
                  />
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}>
                    <Text style={styles.textLeft}>Last name</Text>
                    <Text style={styles.textRight}>
                      {ProfileData?.last_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 20,
                      backgroundColor: 'gray',
                      height: 0.5,
                    }}
                  />
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}>
                    <Text style={styles.textLeft}>Email ID</Text>
                    <Text style={styles.textRight}>{ProfileData?.email}</Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 20,
                      backgroundColor: 'gray',
                      height: 0.5,
                    }}
                  />
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}>
                    <Text style={styles.textLeft}>Phone No</Text>
                    <Text style={styles.textRight}>{ProfileData?.mobile}</Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 20,
                      backgroundColor: 'gray',
                      height: 0.5,
                    }}
                  />
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingLeft: 10,
                      paddingRight: 10,
                    }}>
                    <Text style={styles.textLeft}>Address</Text>
                    <Text style={styles.textRight}>{ProfileData?.address}</Text>
                  </View>
                  {/* <View
                  style={{
                    marginVertical: 20,
                    backgroundColor: 'gray',
                    height: 0.5,
                  }}
                /> */}
                </View>
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: width,
    // height: height,
    // padding: 20,
    backgroundColor: '#E5E5E5',
  },
  loading: {
    flex: 1,
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // top: 0,
    // bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonPay: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F67A08',
    backgroundColor: '#F67A08',
  },
  button: {
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 7,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F67A08',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    // color: 'white',
  },
  rect: {
    width: '100%',
    // height: 510,
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 18,
    paddingHorizontal: 10,
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
    // marginTop: 84,
    // alignSelf: 'center',
  },
  textRight: {
    width: '50%',
    textAlign: 'right',
    fontFamily: fonts.semibold,
  },
  textLeft: {
    width: '50%',
    color: 'rgba(19, 46, 91, 0.6)',
    fontFamily: fonts.regular,
  },
  loremIpsum: {
    // fontFamily: 'roboto-regular',
    color: 'rgba(243,63,63,1)',
    // marginTop: 22,
    // marginLeft: 20,
  },
  item: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 15,
    marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontFamily: fonts.regular,
  },
  timer: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 10,
    color: '#B1B1B1',
  },
  image: {
    flex: 1,
    // position: 'absolute',
    height: '100%',
    width: '100%',
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
  elevation: {
    elevation: 20,
    shadowColor: 'rgba(0, 0, 0, 0.4)',
  },
  titleText: {
    fontSize: 22,
    fontFamily: fonts.semibold,
    color: 'white',
  },
});

export default EditProfileScreen;
