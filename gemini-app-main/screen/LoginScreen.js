import React, { Component, useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { API_URL, config, showErrorMessage, showSuccessMessage } from '../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { fonts } from '../utils/constant';
import Loader from '../components/Loader';
import fetch from '../services/fetch';
import { CommonActions } from '@react-navigation/native';
import PushNotification from "react-native-push-notification";
import { CustomTextInput } from '../components/TextInput';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
function Login(props) {
  const { navigation } = props
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [userData, setUserData] = useState();
  const [Loading, setLoading] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  var passwordRef = useRef()

  useEffect(() => {
    Enablenotification()
  }, [])

  function Enablenotification() {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
        setDeviceToken(token.token)
        setDeviceType(token.os)
        AsyncStorage.setItem("device_token", JSON.stringify(token))
      },


      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log("ACTION:", notification.action);
        console.log("onAction:", notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.log("onRegistrationError", err.message);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified if permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       * - if you are not using remote notification or do not have Firebase installed, use this:
       *     requestPermissions: Platform.OS === 'ios'
       */
      requestPermissions: true,
    });

  }

  function onPressLogin() {
    if (Email == '') {
      showErrorMessage("Please Enter Email Address")
    } else if (config.EMAIL_REG.test(Email) === false) {
      showErrorMessage('Please Enter Valid Email Address')
    } else if (Password == '') {
      showErrorMessage("Please Enter Password")
    } else {
      callApiforLogin()
    }

  }

  function callApiforLogin() {
    setLoading(true)
    let formData = new FormData();
    formData.append('email', Email);
    formData.append('password', Password);
    formData.append('device_type', deviceType);
    formData.append('device_id', deviceToken);
    fetch.post(API_URL + '/login', formData, "POST", "formData", "")
      .then((result) => {
        setLoading(false)
        console.log("result", result)
        if (result.status && result.status == 200) {
          setLoading(false)
          showSuccessMessage(result.message)
          AsyncStorage.setItem('usertoken', JSON.stringify(result.data))
          setTimeout(() => {
            navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  { name: 'MainScreen' },
                ],
              })
            );
          }, 1000)
        } else {
          showErrorMessage(result.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log("error", error)
        setLoading(false)
        showErrorMessage(error.message)
      })

  }


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      enabled>
      <ScrollView style={styles.container}>
        {Loading && (
          <View>
            <Loader />
          </View>
        )}
        {/* <View style={styles.container}> */}
        <View style={styles.rectStack}>
          <View style={styles.rect} />
          <View style={styles.rect2}>
            <View style={styles.imageStack}>
              <Image
                source={require('../assets/images/Gemini_logo.png')}
                resizeMode="contain"
                style={styles.image}
              />
              <Image
                source={require('../assets/images/login-bg.png')}
                resizeMode="contain"
                style={styles.image3}
              />
            </View>
          </View>
        </View>
        <View>
          <View height={35}></View>
          <Text style={styles.login}>Login</Text>
          <View height={20}></View>
          <Text style={styles.loremIpsum}>
            Please enter your email id and password {'\n'}to login in your
            account
          </Text>
          <View height={20}></View>
          <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
            <View height={20}></View>
            <CustomTextInput
              value={Email}
              onChangeText={value => setEmail(value)}
              placeholder="Email Address"
              keyboardType={"email-address"}
              icon={require('../assets/icons/email2.png')}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                passwordRef.focus()
              }}
              blurOnSubmit={false}
            />
            <View height={20} />
            <CustomTextInput
              textInputRef={(ref) => passwordRef = ref}
              returnKeyType={"done"}
              value={Password}
              onChangeText={value => setPassword(value)}
              placeholder="Password"
              secureTextEntry={!showPassword}
              icon={require('../assets/icons/lock.png')}

            />
          </View>
          <View height={20}></View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ForgetPassword')}>
            <Text style={styles.forgetPassword}>Forgot Password?</Text>
          </TouchableOpacity>
          <View style={{ padding: 20 }}>
            <TouchableOpacity onPress={() => {
              onPressLogin()
            }} style={styles.button}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dontHaveAccountRow}>
            <Text style={styles.dontHaveAccount}>Don’t have account?</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Signup')}>
              <Text style={styles.sing}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View height={20} />
        </View>
        {/* </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: 'flex',
    backgroundColor: '#132E5B',
  },
  SectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 50,
    width: '100%',
    borderRadius: 8,
    // margin: 10,
  },
  ImageStyle: {
    alignSelf: 'flex-end',
    padding: 10,
    margin: 5,
    height: 20,
    width: 20,
    display: 'flex',
    justifyContent: 'flex-end',
    // resizeMode: 'stretch',
    // alignItems: 'center',
  },
  rect: {
    // top: 49,
    left: 11,
    // width: 346,
    height: 122,
    position: 'absolute',
  },
  button: {
    backgroundColor: '#F67A08',
    // padding: 10,
    // paddingRight: 10,
    // paddingLeft: 20,
    width: '100%',

    height: 50,
    // margin: 20,
    justifyContent: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    // fontWeight: 'bold',
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  rect2: {
    top: 0,
    left: 0,
    width: '100%',
    height: 350,
    position: 'absolute',

    backgroundColor: '#F3F7FA',
    // borderWidth: 1,
    // borderColor: '#000000',
    // borderRadius: 35,
    // margsinLeft: 0,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { height: 15 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  image: {
    top: -40,
    left: 84,
    width: 200,
    height: 200,
    position: 'absolute',
  },
  image3: {
    top: 31,
    // left: 8,
    width: '100%',
    height: 356,
    position: 'absolute',
  },
  imageStack: {
    width: '100%',
    height: 387,
    marginTop: Platform.OS === 'android' ? 0 : 19,
  },
  image2: {
    top: 59,
    left: 0,
    width: 375,
    height: 403,
    position: 'absolute',
  },
  image2_imageStyle: {},
  login: {
    textAlign: 'center',
    // marginTop:-40,
    fontFamily: fonts.semibold,
    color: 'rgba(255,254,254,1)',
    fontSize: 30,
    // marginTop: 368,
    // marginLeft: 148,
  },
  rectStack: {
    width: '100%',
    height: 350,
  },
  loremIpsum: {
    fontFamily: fonts.regular,
    color: 'rgba(255,255,255,1)',
    fontSize: 15,
    display: 'flex',
    textAlign: 'center',
    textAlignVertical: 'center',
    justifyContent: 'center',
    // paddingHorizontal:0,
    // marginTop: 14,
    // marginLeft: 57,
  },
  placeholder: {
    // fontFamily: 'roboto-regular',
    color: 'black',
    height: 50,
    width: '100%',
    borderRadius: 8,
    backgroundColor: 'rgba(247,237,237,1)',
    lineHeight: 20,
    inlineImageLeft: ' ',
    marginTop: 22,
    // marginLeft: 29,
  },
  placeholder1: {
    // fontFamily: 'roboto-regular',
    color: 'rgba(255,255,255,1)',
    height: 41,
    width: 301,
    borderRadius: 8,
    backgroundColor: 'rgba(247,237,237,1)',
    lineHeight: 20,
    inlineImageLeft: '',
    marginTop: 18,
    // marginLeft: 29,
  },
  forgetPassword: {
    fontFamily: fonts.medium,
    color: 'rgba(246,122,8,1)',
    textAlign: 'center',
    // marginTop: 11,
    // fontWeight: 'bold',
    // marginLeft: 132,
  },
  materialButtonGrey: {
    height: 36,
    width: 314,
    borderRadius: 8,
    // backgroundColor: 'rgba(246,122,8,1)',
    marginTop: 10,
    marginLeft: 23,
  },
  dontHaveAccount: {
    fontFamily: fonts.medium,
    color: 'rgba(255,255,255,1)',
  },
  sing: {
    // fontFamily: 'roboto-regular',
    color: 'rgba(246,122,8,1)',
    // fontWeight: 'bold',
    fontFamily: fonts.medium,
    marginLeft: 5,
  },
  dontHaveAccountRow: {
    height: 20,
    flexDirection: 'row',
    // marginTop: 32,
    // alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 84,
    // marginRight: 138,
  },
});

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: ''},
// });

export default Login;
