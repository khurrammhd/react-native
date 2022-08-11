import React, {Component, useState, useEffect, useRef} from 'react';
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
  TextInput,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {color} from 'react-native-reanimated';
import {colors, fonts, showSuccessMessage} from '../utils/constant';
import Loader from '../components/Loader';
import {API_URL} from '../utils/constant';
import fetch from '../services/fetch';
import {showMessage} from 'react-native-flash-message';
import {CustomTextInput} from '../components/TextInput';
import {moderateScale, verticalScale} from 'react-native-size-matters';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
function EditProfileScreen(props) {
  const {navigation} = props;
  const [Data, setData] = useState(props?.route?.params?.profileDetails);
  const [token, setToken] = useState();
  const [Loading, setLoading] = useState(false);
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country_code, setCountryCode] = useState('');
  // console.log("props",Data)

  var emailRef = useRef();
  var lastNameRef = useRef();
  var addressRef = useRef();
  var phoneRef = useRef();
  var CPasswordRef = useRef();

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        // We have data!!
        const userData = JSON.parse(value);
        setToken(userData?.token);
        // getProfileData(userData?.token);

        // console.log('_retrieveData', JSON.parse(value));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    _retrieveData();
    setUserData();
  }, []);
  //  console.log("userData?.token",token)

  function setUserData() {
    setFirstName(Data.first_name);
    setLastName(Data.last_name);
    setEmail(Data.email);
    setPhone(Data.mobile);
    setAddress(Data.address);
    setCountryCode(Data.country_code);
  }

  const handleSaveData = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    formData.append('mobile', phone);
    formData.append('country_code', country_code);
    formData.append('email', email);
    formData.append('address', address);

    fetch
      .post(API_URL + '/user/editProfile', formData, 'POST', 'formData', token)
      .then(result => {
        setLoading(false);
        console.log('result', result);
        if (result.status && result.status == 200) {
          setLoading(false);
          showSuccessMessage(result.message);
          AsyncStorage.setItem('usertoken', result.data);
          setTimeout(() => {
            navigation.pop();
          }, 2000);
        } else {
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoading(false);
      });
  };
  const onBackPress = () => {
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
          }}>
          <Image
            resizeMode="cover"
            source={require('../assets/icons/left-back.png')} //Change your icon image here
            style={{height: 25, width: 25}}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: ' #132E5B',
            // color:"white"
          }}>
          <Text style={styles.titleText}>Edit Profile</Text>
        </View>
      </View>
      <ImageBackground
        source={require('../assets/images/mapback.png')}
        resizeMode="cover"
        style={styles.image}>
        <ScrollView style={{paddingHorizontal: moderateScale(5)}}>
          <View
            style={{
              paddingVertical: 10,
              width: '100%',
              paddingHorizontal: 15,
              marginTop: 15,
              justifyContent: 'center',
            }}>
            <Text style={styles.title}>First Name</Text>
            <CustomTextInput
              returnKeyType={'next'}
              onSubmitEditing={() => {
                lastNameRef.focus();
              }}
              blurOnSubmit={false}
              containerStyle={styles.item}
              textInputStyle={styles.textInputStyle}
              value={first_name}
              onChangeText={text => {
                setFirstName(text);
              }}
              placeholder={'First Name'}
            />
          </View>

          <View
            style={{
              paddingVertical: 10,
              width: '100%',
              paddingHorizontal: 15,

              justifyContent: 'center',
            }}>
            <Text style={styles.title}>Last Name</Text>
            <CustomTextInput
              textInputRef={ref => (lastNameRef = ref)}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                emailRef.focus();
              }}
              blurOnSubmit={false}
              containerStyle={styles.item}
              textInputStyle={styles.textInputStyle}
              value={last_name}
              onChangeText={text => {
                setLastName(text);
              }}
              placeholder={'Last Name'}
            />
          </View>
          <View
            style={{
              paddingVertical: 10,
              width: '100%',
              paddingHorizontal: 15,

              justifyContent: 'center',
            }}>
            <Text style={styles.title}>Email ID</Text>
            <CustomTextInput
              textInputRef={ref => (emailRef = ref)}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                phoneRef.focus();
              }}
              blurOnSubmit={false}
              containerStyle={styles.item}
              textInputStyle={styles.textInputStyle}
              value={email}
              onChangeText={text => {
                setEmail(text);
              }}
              keyboardType={'email-address'}
              placeholder={'Email ID'}
            />
          </View>
          <View
            style={{
              paddingVertical: 10,
              width: '100%',
              paddingHorizontal: 15,

              justifyContent: 'center',
            }}>
            <Text style={styles.title}>Phone No</Text>
            <CustomTextInput
              textInputRef={ref => (phoneRef = ref)}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                addressRef.focus();
              }}
              blurOnSubmit={false}
              containerStyle={styles.item}
              textInputStyle={styles.textInputStyle}
              value={phone}
              onChangeText={text => {
                setPhone(text);
              }}
              keyboardType={'phone-pad'}
              placeholder={'Phone No'}
            />
          </View>
          <View
            style={{
              paddingVertical: 10,
              width: '100%',
              paddingHorizontal: 15,

              justifyContent: 'center',
            }}>
            <Text style={styles.title}>Address</Text>
            <CustomTextInput
              textInputRef={ref => (addressRef = ref)}
              returnKeyType={'done'}
              containerStyle={[styles.item, {height: verticalScale(80)}]}
              textInputStyle={[
                styles.textInputStyle,
                {height: verticalScale(80)},
              ]}
              value={address}
              onChangeText={text => {
                setAddress(text);
              }}
              multiline={true}
              numberOfLines={4}
              placeholder={'Address'}
              textAlignVertical={'top'}
            />
          </View>
          <View></View>
        </ScrollView>
        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 15,
            paddingBottom: 20,
            color: '#F67A08',
          }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleSaveData()}>
            <Text
              style={[styles.text, {color: 'white', fontFamily: fonts.bold}]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
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

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#F67A08',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    // fontWeight: 'bold',
    letterSpacing: 0.25,
    // color: 'white',
  },
  item: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    // marginVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
    marginTop: 5,
    height: verticalScale(45),
  },
  title: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: '#F67A08',
    left: Platform.OS === 'android' ? 4 : 0,
    marginLeft: 10,
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
  textInputStyle: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: moderateScale(14),
    color: 'black',
  },
});

export default EditProfileScreen;
