import React, { Component, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar, Platform
} from 'react-native';
import { API_URL, config, showErrorMessage, showSuccessMessage } from '../utils/constant';
import PhoneInput from 'react-native-phone-number-input';
import { fonts } from '../utils/constant';
import { useHeaderHeight } from '@react-navigation/elements';
import Loader from '../components/Loader';
import fetch from '../services/fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { moderateScale } from 'react-native-size-matters';
import { CustomTextInput } from '../components/TextInput';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
function Signup(props) {
  const { navigation } = props
  const headerHeight = useHeaderHeight();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [CPassword, setCPassword] = useState('');
  const [Loading, setLoading] = useState(false);
  const [country_code, setCountryCode] = useState("+1242");
  const [Details, setDetails] = useState();

  var emailRef = useRef()
  var lastNameRef = useRef()
  var addressRef = useRef()
  var passwordRef = useRef()
  var CPasswordRef = useRef()

  function onPressSubmit() {
    console.log("country_code", country_code)
    if (firstName == "") {
      showErrorMessage("Please Enter First Name")
    } else if (lastName == "") {
      showErrorMessage("Please Enter Last Name")
    } else if (Email == '') {
      showErrorMessage("Please Enter Email Address")
    } else if (config.EMAIL_REG.test(Email.trim()) === false) {
      showErrorMessage('Please Enter Valid Email Address')
    } else if (phone == "") {
      showErrorMessage('Please Enter Phone Number')
    // } else if (address == '') {
    //   showErrorMessage("Please Enter Address")
    } else if (Password == '') {
      showErrorMessage("Please Enter Password")
    } else if (CPassword == '') {
      showErrorMessage("Please Enter Confirm Password")
    } else if (CPassword != Password) {
      showErrorMessage("Password Does Not Match")
    } else {
      callApiforRegister()
    }
  }

  function callApiforRegister() {
    setLoading(true)
    const formData = new FormData();
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('mobile', phone);
    formData.append('country_code', '+1242');
    formData.append('email', Email);
    formData.append('device_type', Platform.OS);
    formData.append('device_id', 'vip_user');
    formData.append('password', Password);
    formData.append('push_token', '');
    formData.append('address', address);

    fetch.post(API_URL + '/signup', formData, "POST", "formData", "")
      .then((result) => {
        console.log("result", result)
        setLoading(false)
        if (result.status && result.status == 200) {
          setLoading(false)
          showSuccessMessage(result.message)
          callApiforLogin()
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

  function callApiforLogin() {
    let formData = new FormData();
    formData.append('email', Email);
    formData.append('password', Password);
    formData.append('device_type', Platform.OS);
    formData.append('device_id', 'test1');
    fetch.post(API_URL + '/login', formData, "POST", "formData", "")
      .then((result) => {
        console.log("result", result)
        if (result.status && result.status == 200) {
          // showSuccessMessage(result.message)
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
      // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#132E5B' }}
    // enabled={false}
    // keyboardVerticalOffset={headerHeight}
    >

      <StatusBar backgroundColor={'#132E5B'} barStyle="dark-content" />
      {/* <View style={styles.container}> */}
      <ScrollView style={{ flex: 1 }}>
        {Loading && (
          <View>
            <Loader />
          </View>
        )}
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
                source={require('../assets/images/bg-3x.png')}
                resizeMode="contain"
                style={styles.image3}
              />
            </View>
          </View>
        </View>
        <View>
          <View height={35}></View>
          <Text style={styles.login}>Sign Up</Text>
          <View height={20}></View>
          <Text style={styles.loremIpsum}>Please create your account</Text>
          <View height={20}></View>
          <View
            style={{
              alignItems: 'center',
              paddingHorizontal: 20,
              // marginTop: 10,
            }}>

            <CustomTextInput
              returnKeyType={"next"}
              onSubmitEditing={() => {
                lastNameRef.focus()
              }}
              blurOnSubmit={false}
              value={firstName}
              onChangeText={value => setFirstName(value)}
              placeholder="First Name"
              icon={require('../assets/icons/profile2.png')}
            />
            <View height={20}></View>

            <CustomTextInput
              textInputRef={(ref) => lastNameRef = ref}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                emailRef.focus()
              }}
              blurOnSubmit={false}
              value={lastName}
              onChangeText={value => setLastName(value)}
              placeholder="Last Name"
              icon={require('../assets/icons/profile2.png')}
            />
            <View height={20}></View>

            <CustomTextInput
              textInputRef={(ref) => emailRef = ref}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                addressRef.focus()
              }}
              blurOnSubmit={false}
              value={Email}
              onChangeText={value => setEmail(value)}
              placeholder="Email Address"
              icon={require('../assets/icons/email2.png')}
              keyboardType={"email-address"}
            />
            <View height={20}></View>

            <View style={styles.SectionStyle}>
              <PhoneInput
                style={{
                  flex: 1,
                  fontFamily: fonts.regular,
                  paddingHorizontal: 10,
                  width: '80%',
                }}
                // disableArrowIcon
                // ref={phoneInput}
                defaultValue={phone}
                defaultCode="BS"
                layout="first"
                onChangeText={e => {
                  setPhone(e)
                }}
                containerStyle={{ justifyContent: 'center', height: '90%' }}
                // onChangeFormattedText={text => {
                //   setFormattedValue(text);
                // }}
                textInputStyle={{ alignItems: 'center', justifyContent: 'center', height: 50 }}
                textContainerStyle={{ paddingBottom: 10, paddingTop: 10, backgroundColor: "white" }}
                onChangeCountry={(country) => {
                  console.log("country", country)
                  setCountryCode(country.callingCode.length > 0 ? country.callingCode[0] : "+1242")
                }}
                countryPickerProps={{
                  countryCodes: ['BS'],
                }}
              // withDarkTheme
              // withShadow
              // autoFocus
              />
              <View style={{ width: '10%', paddingRight: moderateScale(8) }}>
                <Image
                  resizeMode="contain"
                  source={require('../assets/icons/mobile.png')} //Change your icon image here
                  style={styles.ImageStyle}
                />
              </View>
            </View>
            <View height={20}></View>

            <CustomTextInput
              textInputRef={(ref) => addressRef = ref}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                passwordRef.focus()
              }}
              blurOnSubmit={false}
              value={address}
              onChangeText={value => setAddress(value)}
              placeholder="Address"
              icon={require('../assets/icons/locations.png')}
            />
            <View height={20}></View>

            <CustomTextInput
              textInputRef={(ref) => passwordRef = ref}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                CPasswordRef.focus()
              }}
              blurOnSubmit={false}
              value={Password}
              onChangeText={value => setPassword(value)}
              placeholder="Password"
              secureTextEntry
              icon={require('../assets/icons/lock.png')}
            />

            <View height={20}></View>
            <CustomTextInput
              textInputRef={(ref) => CPasswordRef = ref}
              returnKeyType={"done"}
              value={CPassword}
              onChangeText={value => setCPassword(value)}
              placeholder="Confirm Password"
              secureTextEntry
              icon={require('../assets/icons/lock.png')}
            />
          </View>
          <View height={12}></View>
          <View style={{ paddingHorizontal: 20 }}>
            <TouchableOpacity onPress={() => onPressSubmit()} style={styles.button}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View height={20}></View>
          <View style={styles.dontHaveAccountRow}>
            <Text style={styles.dontHaveAccount}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Login')}>
              <Text style={styles.sing}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    height: moderateScale(20),
    width: moderateScale(20),
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
    marginTop: moderateScale(20)
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

    backgroundColor: '#F3F7FA',
    // borderWidth: 1,
    // borderColor: '#000000',
    // borderRadius: 35,
    // margsinLeft: 0,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
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
    // width: 301,
    borderRadius: 8,
    backgroundColor: 'rgba(247,237,237,1)',
    lineHeight: 20,
    inlineImageLeft: ' ',
    // marginTop: 22,
    // marginLeft: 29,
  },

  dontHaveAccount: {
    fontFamily: fonts.regular,
    color: 'rgba(255,255,255,1)',
  },
  sing: {
    fontFamily: fonts.regular,
    // fontFamily: 'roboto-regular',
    marginLeft: 5,
    // fontWeight: 'bold',
    color: 'rgba(246,122,8,1)',
  },
  dontHaveAccountRow: {
    height: 20,
    flexDirection: 'row',
    // marginTop: 32,
    marginBottom: 30,
    // alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: 84,
    // marginRight: 138,
  },
});
export default Signup;
