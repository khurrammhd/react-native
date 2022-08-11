import React, {Component, useState, useEffect, useRef} from 'react';
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
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {
  API_URL,
  config,
  showErrorMessage,
  showSuccessMessage,
} from '../utils/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage, hideMessage} from 'react-native-flash-message';
import {fonts} from '../utils/constant';
import {
  CreditCardInput,
  CardView,
  CreditCard,
  LiteCreditCardInput,
} from 'react-native-credit-card-input';
import Stripe from 'react-native-stripe-api';
import Loader from '../components/Loader';
import {moderateScale} from 'react-native-size-matters';
import fetch from '../services/fetch';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

function Login(props) {
  const {navigation, route} = props;
  console.log('route', route);
  var CCInput = useRef(null);
  var cardHolderRef = useRef(null);
  var expiryRef = useRef(null);
  var cvvRef = useRef(null);
  const [Loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);
  const [user_token, setUserToken] = useState('');
  const [data, setData] = useState(route.params.Data);
  const [coinApply, setCoinApply] = useState(route.params.coinApply);
  const [totalAmount, setTotalAmount] = useState(route.params.total);

  const client = new Stripe(config.stripe_api_key);

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        // We have data!!
        const userData = JSON.parse(value);
        setUserToken(userData?.token);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    _retrieveData();
  }, []);

  function onSubmit() {
    console.log('pay now clicked');

    if (form && form.status) {
      if (form.status.number == 'incomplete') {
        showErrorMessage('Please Enter Card Number');
      } else if (form.status.number == 'invalid') {
        showErrorMessage('Please Enter Valid Card Number');
      } else if (form.status.expiry == 'incomplete') {
        showErrorMessage('Please Enter Card Expiry Date');
      } else if (form.status.expiry == 'invalid') {
        showErrorMessage('Please Enter Valid Card Expiry');
      } else if (form.status.cvc == 'incomplete') {
        showErrorMessage('Please Enter Card CVV');
      } else if (form.status.cvc == 'invalid') {
        showErrorMessage('Please Enter valid Card CVV');
      } else if (form.status.name == 'incomplete') {
        showErrorMessage('Please Enter Card holder Name');
      } else {
        CallApiforPay();
      }
    } else {
      showErrorMessage('Please Enter Credit Card Details');
    }
  }

  async function CallApiforPay() {
    let formattedCardNumber = form.values.number.replace(/ /g, '');
    let formattedCardExpiry = form.values.expiry.split('/');
    console.log('card details: ', formattedCardNumber);
    console.log('card details: ', formattedCardExpiry);
    console.log('card details: ', form.values.cvc);
    console.log('card details: ', form.values.name);
    // console.log("card details: ", planId)

    setLoading(true);

    try {
      // Create a Stripe token with new card infos
      const token = await client.createToken({
        number: formattedCardNumber,
        exp_month: formattedCardExpiry[0],
        exp_year: formattedCardExpiry[1],
        cvc: form.values.cvc,
      });

      console.log('token', token);
      if (token.error) {
        showErrorMessage(token.error.message);
        setLoading(false);
      } else {
        // token.id
        setLoading(true);
        const formData = new FormData();
        formData.append('package_id', data.id);
        formData.append('payment_type', 'online');
        formData.append('transaction_amount', totalAmount);
        formData.append('coin_apply', coinApply ? 1 : 0);
        formData.append('payment_token', token.id);

        fetch
          .post(
            API_URL + '/user/payment',
            formData,
            'POST',
            'formData',
            user_token,
          )
          .then(result => {
            setLoading(false);
            console.log('result', result);
            if (result.status && result.status == 200) {
              setLoading(false);
              showSuccessMessage(result.message);
              navigation.pop();
            } else {
              showErrorMessage(result.message);
            }
          })
          .catch(error => {
            console.log('error', error);
            setLoading(false);
            showErrorMessage(error.message);
          });
        setLoading(false);
      }
      console.log('token: ', token);
    } catch (e) {
      setLoading(false);
      console.log('card token error: ', e);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.MainContainer}
      behavior="padding"
      enabled={Platform.OS == 'ios'}>
      <SafeAreaView style={styles.container}>
        {Platform.OS === 'ios' ? (
          <StatusBar backgroundColor={'#132E5B'} barStyle="light-content" />
        ) : (
          <StatusBar backgroundColor={'#132E5B'} barStyle="light-content" />
        )}
        <View style={[styles.titleBarContainer, styles.elevation]}>
          {Loading && (
            <View>
              <Loader />
            </View>
          )}
          <TouchableOpacity
            onPress={() => navigation.pop()}
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
            <Text style={styles.titleText}>Payment</Text>
          </View>
        </View>
        <ImageBackground
          source={require('../assets/images/mapback.png')}
          resizeMode="cover"
          style={styles.image}>
          <View style={{flex: 1, paddingHorizontal: moderateScale(5)}}>
            <View style={{height: 0}}>
              <LiteCreditCardInput
                ref={ref => (CCInput = ref)}
                onChange={form => {
                  console.log('form: ', form);
                  setForm(form);
                }}
              />
            </View>
            <View height={20} />
            <CreditCardInput
              ref={ref => (CCInput = ref)}
              allowScroll
              requiresName
              onChange={form => {
                console.log('form: ', form);
                setForm(form);
              }}
            />
          </View>
          <TouchableOpacity
            style={[styles.buttonProceed, {marginBottom: 20}]}
            onPress={() => {
              onSubmit();
            }}>
            <Text
              style={[styles.text, {color: 'white', fontFamily: fonts.bold}]}>
              Proceed
            </Text>
          </TouchableOpacity>
        </ImageBackground>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    // height: height,
    // padding: 20,

    backgroundColor: '#E5E5E5',
  },
  titleText: {
    fontSize: 22,
    fontFamily: fonts.semibold,
    color: 'white',
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
  image: {
    flex: 1,
    // position: 'absolute',
    height: '100%',
    width: '100%',
  },
  buttonProceed: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F67A08',
    backgroundColor: '#F67A08',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    // color: 'white',
  },
});

export default Login;
