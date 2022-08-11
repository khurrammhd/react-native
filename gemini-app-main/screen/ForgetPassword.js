import React, { Component, useState } from 'react';
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
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { moderateScale } from 'react-native-size-matters';
import Loader from '../components/Loader';
import { CustomTextInput } from '../components/TextInput';
import fetch from '../services/fetch';
import { fonts, showErrorMessage, showSuccessMessage } from '../utils/constant';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
import { API_URL } from '../utils/constant';
function ForgetPassword(props) {
  const { navigation } = props
  const [Email, setEmail] = useState('');
  const [Loading, setLoading] = useState(false);

  async function handleSendLink() {
    setLoading(true)
    const formData = new FormData();
    formData.append('email', Email);

    fetch.post(API_URL + '/forgot_password', formData, "POST", "formData", "")
      .then((result) => {
        setLoading(false)
        console.log("result", result)
        if (result.status && result.status == 200) {
          setLoading(false)
          showSuccessMessage(result.message)
          setTimeout(() => {
            navigation.pop()
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


    // let headers = {
    //   'Content-Type': 'multipart/form-data', // this is a imp line
    //   Accept: 'application/json',
    // };
    // let obj = {
    //   method: 'POST',
    //   headers: headers,
    //   body: formData,
    // };

    // await fetch(API_URL + '/forgot_password', obj).then(response =>
    //   response
    //     .json()
    //     .then(data => ({
    //       data: data,
    //       status: response.status,
    //     }))
    //     .then(res => {
    //       // setUserData(res.data.data);
    //       // console.log('res.data.data', res.data);
    //       setEmail('');

    //       alert(res?.data?.message);
    //     })
    //     .catch(e => console.log(e)),
    // );
  };
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.container}> */}
      <View style={styles.rectStack}>
        {Loading && (
          <View>
            <Loader />
          </View>
        )}
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
        <Text style={styles.login}>Forget Passowrd</Text>
        <View height={20}></View>
        <Text style={styles.loremIpsum}>
          Please enter your email address, which is associated with this account
        </Text>
        <View height={20}></View>
        <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
          <CustomTextInput
            placeholder="Email Address"
            onChangeText={value => setEmail(value)}
            value={Email}
            keyboardType={"email-address"}
            icon={require('../assets/icons/email2.png')}
          />
        </View>
        <TouchableOpacity onPress={() => {
          if (Email == "") {
            showErrorMessage("Please Enter Email")
          }
          else {
            handleSendLink()
          }
        }} style={styles.button}>
          <Text style={styles.buttonText}>Send Link</Text>
        </TouchableOpacity>
        <View style={styles.dontHaveAccountRow}>
          <Text style={styles.dontHaveAccount}>Back to</Text>
          <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
            <Text style={styles.sing}>Login</Text>
          </TouchableOpacity>
        </View>
        <View height={50}></View>
      </View>
      {/* </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // display: 'flex',
    backgroundColor: '#132E5B',
    // paddingBottom:100
  },
  rect: {
    // top: 49,
    left: 11,
    width: '100%',
    height: 122,
    position: 'absolute',
  },
  button: {
    backgroundColor: '#F67A08',
    // padding: 10,
    // paddingRight: 10,
    // paddingLeft: 20,
    height: 50,
    margin: 20,
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: moderateScale(30)
  },
  buttonText: {
    color: 'white',
    fontFamily: fonts.medium,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
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
  rect2: {
    top: 0,
    left: 0,
    width: '100%',
    height: 410,
    position: 'absolute',
    backgroundColor: '#F3F7FA',
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    marginLeft: 0,

    ...Platform.select({
      ios: {
        shadowColor: '#fff',
        shadowOffset: { height: 10 },
        shadowOpacity: 0.6,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  image: {
    top: 0,
    // left: 84,
    width: width - 200,
    height: 200,
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
  },
  image3: {
    top: 100,
    // left: 8,
    width: '100%',
    height: 356,
    position: 'absolute',
  },
  imageStack: {
    width: '100%',
    height: 387,
    // marginTop: Platform.OS === 'android' ? 0 : 19,
  },
  image2: {
    top: 90,
    left: 0,
    width: width,
    height: height,
    position: 'absolute',
  },
  image2_imageStyle: {},
  login: {
    textAlign: 'center',
    // marginTop:-40,
    // fontFamily: 'roboto-regular',
    color: 'rgba(255,254,254,1)',
    fontSize: 30,
    fontFamily: fonts.semibold,
    // marginTop: 368,
    // marginLeft: 148,
  },
  rectStack: {
    width: '100%',
    height: 440,
  },
  loremIpsum: {
    fontFamily: fonts.regular,
    color: 'rgba(255,255,255,1)',
    fontSize: 15,
    display: 'flex',
    textAlign: 'center',
    // textAlignVertical: 'center',
    // justifyContent: 'center',
    // width: "80%",
    paddingHorizontal: 20,
    // paddingHorizontal:0,
    // marginTop: 14,
    // marginLeft: 57,
  },
  placeholder: {
    // fontFamily: 'roboto-regular',
    color: 'black',
    // height: 41,
    // width: 301,
    height: 50,
    borderRadius: 8,
    width: '100%',
    backgroundColor: 'rgba(247,237,237,1)',
    // lineHeight: 20,
    inlineImageLeft: ' ',
    // marginTop: 22,
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
    // marginTop: 18,
    // marginLeft: 29,
  },
  forgetPassword: {
    // fontFamily: 'roboto-regular',
    color: 'rgba(246,122,8,1)',
    // marginTop: 11,
    marginLeft: 132,
  },
  materialButtonGrey: {
    height: 36,
    width: 314,
    borderRadius: 8,
    // backgroundColor: 'rgba(246,122,8,1)',
    // marginTop: 10,
    marginLeft: 23,
  },
  dontHaveAccount: {
    fontFamily: fonts.medium,
    // fontFamily: 'roboto-regular',
    color: 'rgba(255,255,255,1)',
  },
  sing: {
    fontFamily: fonts.medium,
    marginLeft: 5,
    color: 'rgba(246,122,8,1)',
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  dontHaveAccountRow: {
    // height: 20,
    flexDirection: 'row',
    // marginTop: 32,
    // alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical:10
    // marginLeft: 84,
    // marginRight: 138,
  },
});

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: ''},
// });

export default ForgetPassword;
