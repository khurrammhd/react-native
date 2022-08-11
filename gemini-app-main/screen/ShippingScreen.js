import React, {Component, useState, useRef, useEffect} from 'react';
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
  Modal,
  Platform,
  TouchableHighlight,
  PermissionsAndroid,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {color} from 'react-native-reanimated';
import {
  Base_URL,
  API_URL,
  colors,
  fonts,
  showErrorMessage,
  showSuccessMessage,
} from '../utils/constant';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
import Icon1 from 'react-native-vector-icons/AntDesign';
import {moderateScale, scale, verticalScale} from 'react-native-size-matters';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Ionicons';
import {CustomButton} from '../components/Button';
import fetch from '../services/fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

function ShippingScreen(props) {
  const {navigation, route} = props;
  console.log('route', route);
  const [modalVisible, setModalVisible] = useState(false);
  const [radioButton, setradioButton] = useState(0);
  const [coin_apply, setCoinApply] = useState(false);
  const [Data, setData] = useState(props?.route?.params?.expressDetails);
  const [invoiceList, setInvoiceList] = useState([]);
  const [plusImage, setPlusImage] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [invoice, setInvoice] = useState('');
  const [Loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [total, setTotal] = useState('');
  const [paymentType, setPaymentType] = useState('cash');
  const [available_points, setAvailablePoints] = useState('0.00');
  const [coins, setCoins] = useState('');
  const [finalcoins, setFinalCoins] = useState('');
  const [coinInput, setCoinInput] = useState(false);
  const [type, setType] = useState(route.params.type);

  var radio_props = [
    {label: 'Pay by Cash', value: 0},
    {label: 'Pay Online', value: 1},
  ];

  const _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        // We have data!!
        const userData = JSON.parse(value);
        setToken(userData?.token);
        setAvailablePoints(userData.available_coin);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    _retrieveData();
    Icon3.loadFont();
  }, []);

  const onBackPress = () => {
    props.navigation.pop();
  };
  const refRBSheet = useRef();
  const refInvoiceRBSheet = useRef();

  function render({item, index}) {
    return (
      <View style={{margin: moderateScale(5), flex: 1 / 3}}>
        {item.plusImage && invoiceList.length < 5 ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              setShowPicker(true);
              // setImageStatus("Documents")
            }}>
            <View style={styles.viewContainer2}>
              <Icon3 name={'plus'} size={30} color={colors.primary_color} />
              <Text
                bold
                style={{
                  textAlign: 'center',
                  fontSize: moderateScale(13),
                  color: colors.primary_color,
                }}>
                Add Invoice
              </Text>
            </View>
          </TouchableOpacity>
        ) : item.uri ? (
          <View>
            <Image
              style={[styles.ImageContainer1, {position: 'absolute'}]}
              source={require('../assets/images/placeholder.png')}
            />

            {item.type.includes('pdf') ? (
              <View
                style={[
                  styles.viewContainer2,
                  {paddingHorizontal: 5, backgroundColor: '#f2f2f2'},
                ]}>
                <Image
                  style={{
                    height: verticalScale(24),
                    width: scale(24),
                    resizeMode: 'contain',
                  }}
                  source={require('../assets/images/pdf.png')}
                />
                <Text
                  style={{
                    marginTop: moderateScale(5),
                    fontSize: moderateScale(10),
                    fontFamily: fonts.semibold,
                    color: colors.accent_color,
                  }}>
                  {item.name}
                </Text>
              </View>
            ) : (
              <Image style={styles.ImageContainer1} source={{uri: item.uri}} />
            )}
            <View
              style={{
                position: 'absolute',
                justifyContent: 'center',
                height: moderateScale(30),
                width: '100%',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{alignSelf: 'flex-end', marginTop: moderateScale(-20)}}
                onPress={() => {
                  invoiceList.splice(index, 1);
                  let arr = [...invoiceList];
                  setInvoiceList(arr);
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    height: moderateScale(20),
                    width: moderateScale(20),
                    alignSelf: 'flex-end',
                    backgroundColor: 'red',
                    borderRadius: moderateScale(20),
                    alignItems: 'center',
                    left: moderateScale(3),
                  }}>
                  <Icon1
                    name={'delete'}
                    size={12}
                    color={'white'}
                    style={{alignSelf: 'center'}}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          console.log('')
        )}
      </View>
    );
  }

  function closePicker() {
    setShowPicker(false);
  }

  function showCamera(value) {
    if (Platform.OS == 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ])
        .then(result => {
          console.log('result', result);
          if (
            result['android.permission.CAMERA'] == 'granted' &&
            result['android.permission.WRITE_EXTERNAL_STORAGE'] == 'granted'
          ) {
            if (value == 1) {
              openCamera(value);
            } else {
              openGallery();
            }
          } else {
            Alert.alert('Please grant all permission to access this feature');
          }
        })
        .catch(reason => {
          console.log('reason', reason);
        });
    } else {
      if (value == 1) {
        openCamera(value);
      } else {
        openGallery();
      }
    }
  }

  function openCamera(value) {
    launchCamera(
      {
        mediaType: 'photo',
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.5,
      },
      response => {
        console.log('response', response);
        if (response.errorCode) return;
        if (response.didCancel) return;

        setInvoice({
          name: response.type ? 'image.jpg' : 'video.mp4',
          uri: response.uri,
          type: response.type ? 'image/jpeg' : 'video/mp4',
        });
        // invoiceList.push({
        //   name: response.type ? "image.jpg" : "video.mp4",
        //   uri: response.uri,
        //   type: response.type ? 'image/jpeg' : 'video/mp4'
        // })
        // let arr = [...invoiceList]
        // setInvoiceList(arr)
      },
    );
  }

  function openGallery() {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 2000,
        maxWidth: 2000,
        quality: 0.5,
      },
      response => {
        console.log('response', response);
        if (response.errorCode) return;
        if (response.didCancel) return;
        setInvoice({
          name: response.type ? 'image.jpg' : 'video.mp4',
          uri: response.uri,
          type: response.type ? 'image/jpeg' : 'video/mp4',
        });
        // invoiceList.push({
        //   name: response.type ? "image.jpg" : "video.mp4",
        //   uri: response.uri,
        //   type: response.type ? 'image/jpeg' : 'video/mp4'
        // })
        // let arr = [...invoiceList]
        // setInvoiceList(arr)
      },
    );
  }

  async function pickDocuments() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log('res', res);
      let imageUri = decodeURI(res[0].uri);
      console.log(
        res[0].uri,
        res[0].type, // mime type
        res[0].name,
        res[0].size,
      );
      // setDocument({
      //     name: "Documents.pdf",
      //     uri: imageUri,
      //     type: 'application/pdf'
      // })
      setInvoice({
        name: res[0].name,
        uri: imageUri,
        type: 'application/pdf',
      });
      // invoiceList.push({
      //   name: res[0].name,
      //   uri: imageUri,
      //   type: 'application/pdf'
      // })
      // let arr = [...invoiceList]
      // setInvoiceList(arr)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  function CallApiforUploadInvoice() {
    setLoading(true);
    const formData = new FormData();
    formData.append('package_id', Data.id);
    formData.append('invoice_document', invoice);

    fetch
      .post(
        API_URL + '/user/invoiceSubmit',
        formData,
        'POST',
        'formData',
        token,
      )
      .then(result => {
        setLoading(false);
        console.log('result', result);
        if (result.status && result.status == 200) {
          setLoading(false);
          showSuccessMessage(result.message);
        } else {
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoading(false);
      });
  }

  function onPressPay() {
    refRBSheet.current.open();
    setCoinApply(false);
    setTotal(Data.package_price);
    setPaymentType('cash');
    setCoinInput(false);
    setCoins('');
    setFinalCoins('');
  }

  function onPressApplyCoin() {
    let value = true;

    if (coin_apply) {
      setCoinApply(false);
      value = false;
      // totalAmount(value)
    } else {
      setCoinApply(true);
      value = true;
      // totalAmount(value)
    }
  }

  function totalAmount() {
    let total = 0;
    if (coins > parseInt(available_points)) {
      showErrorMessage('Coins should be less than Available Points');
    } else if (
      coins < parseInt(available_points) &&
      coins > parseInt(Data.package_price)
    ) {
      showErrorMessage('Coins should be less than Package Price');
    } else {
      total = parseInt(Data.package_price) - coins;
      setTotal(total.toFixed(2));
      setCoinInput(true);
      setFinalCoins(coins);
    }
  }

  function onPressPaymentMethod(value) {
    if (value == 1) {
      setPaymentType('cash');
    } else {
      setPaymentType('online');
    }
  }

  function CallApiforPay() {
    setLoading(true);
    const formData = new FormData();
    formData.append('package_id', Data.id);
    formData.append('payment_type', paymentType);
    formData.append('transaction_amount', total);
    formData.append('coin_apply', coinInput ? 1 : 0);
    formData.append('payment_token', '');

    fetch
      .post(API_URL + '/user/payment', formData, 'POST', 'formData', token)
      .then(result => {
        setLoading(false);
        console.log('result', result);
        if (result.status && result.status == 200) {
          setLoading(false);
          showSuccessMessage(result.message);
        } else {
          showErrorMessage(result.message);
        }
      })
      .catch(error => {
        console.log('error', error);
        setLoading(false);
        showErrorMessage(error.message);
      });
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
      <View style={[styles.titleBarContainer, styles.elevation]}>
        {Loading && (
          <View>
            <Loader />
          </View>
        )}
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
          <Text style={styles.titleText}>{Data.service_type}</Text>
        </View>
      </View>
      <ImageBackground
        source={require('../assets/images/mapback.png')}
        resizeMode="cover"
        style={styles.image}>
        <ScrollView>
          {/* <ImageBackground source={image} resizeMode="cover" style={styles.image}> */}
          <View
            style={{
              paddingVertical: 10,
              width: '100%',
              paddingHorizontal: 15,

              justifyContent: 'center',
            }}>
            <View style={styles.rect}>
              {/* {DATA.map((value, index) => ( */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <Text style={styles.textLeft}>Tracking No</Text>
                  <Text style={styles.textRight}>{Data.tracking_number}</Text>
                </View>
                <View
                  style={{
                    marginVertical: 20,
                    backgroundColor: 'gray',
                    height: 0.5,
                  }}
                />
              </View>
              {/* <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <Text style={styles.textLeft}>Customer</Text>
                  <Text style={styles.textRight}>{Data.sender}</Text>
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
                  <Text style={styles.textLeft}>Customer Contact</Text>
                  <Text style={styles.textRight}>+1 195 1965 5465</Text>
                </View>
                <View
                  style={{
                    marginVertical: 20,
                    backgroundColor: 'gray',
                    height: 0.5,
                  }}
                />
              </View> */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <Text style={styles.textLeft}>Package Price</Text>
                  <Text style={styles.textRight}>{Data.package_price}</Text>
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
                  <Text style={styles.textLeft}>Package Received Date</Text>
                  <Text style={styles.textRight}>{Data.pickup_date}</Text>
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
                  <Text style={styles.textLeft}>Package Collection Date</Text>
                  <Text style={styles.textRight}>{Data.delivery_date}</Text>
                </View>
                <View
                  style={{
                    marginVertical: 20,
                    backgroundColor: 'gray',
                    height: 0.5,
                  }}
                />
              </View>
              {/* <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <Text style={styles.textLeft}>Pickup Location</Text>
                  <Text style={styles.textRight}>
                    {Data.address}
                  </Text>
                </View>
                <View
                  style={{
                    marginVertical: 20,
                    backgroundColor: 'gray',
                    height: 0.5,
                  }}
                />
              </View> */}
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                  }}>
                  <Text style={styles.textLeft}>Carrier</Text>
                  <Text style={styles.textRight}>{Data.carrier}</Text>
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
                  <Text style={styles.textLeft}>Sender</Text>
                  <Text style={styles.textRight}>{Data.sender}</Text>
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
                  <Text style={styles.textLeft}>Mail Room</Text>
                  <Text style={styles.textRight}>{Data.shelf}</Text>
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
                  <Text style={styles.textLeft}>Special Handling</Text>
                  <Text style={styles.textRight}>{Data.special_handling}</Text>
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
                  <Text style={styles.textLeft}>Service Type</Text>
                  <Text style={styles.textRight}>{Data.service_type}</Text>
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
                  <Text style={styles.textLeft}>Package Condition</Text>
                  <Text style={styles.textRight}>{Data.package_condition}</Text>
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
                  <Text style={styles.textLeft}>Package Status</Text>
                  <Text style={styles.textRight}>{Data.package_status}</Text>
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
                  <Text style={styles.textLeft}>Customer Invoice</Text>

                  {Data.customer_invoice != null ? (
                    <Text
                      style={styles.hyperlinkStyle}
                      onPress={() => {
                        Linking.openURL(
                          'http://docs.google.com/gview?embedded=true&url=' +
                            `${Base_URL + '/' + Data.customer_invoice}`,
                        );
                      }}>
                      Click here
                    </Text>
                  ) : (
                    <Text>No invoice found.</Text>
                  )}
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
                  <Text style={styles.textLeft}>Staff Notes </Text>
                  <Text style={styles.textRight}>{Data.staf_note}</Text>
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

            {type == 'pendding' ? (
              <View>
                <View
                  style={{
                    paddingVertical: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 15,
                  }}>
                  {/* 'package_logged'
                'invoice_submitted'
                'payment_requested'
                'payment_received'
                'on_the_way'
                'ready_for_pickup'
                'package_collected' */}
                  <TouchableOpacity
                    style={styles.button}
                    // disabled={Data.package_status == "payment_requested" || Data.package_status == "payment_received" ||
                    //   Data.package_status == "on_the_way" || Data.package_status == "ready_for_pickup" ||
                    //   Data.package_status == "package_collected" ? true : false}
                    onPress={() => {
                      if (
                        Data.package_status == 'payment_requested' ||
                        Data.package_status == 'payment_received' ||
                        Data.package_status == 'on_the_way' ||
                        Data.package_status == 'ready_for_pickup' ||
                        Data.package_status == 'package_collected'
                      ) {
                        showErrorMessage('You have already uploaded invoice.');
                      } else {
                        refInvoiceRBSheet.current.open();
                        setInvoice('');
                      }
                    }}>
                    <Text
                      style={[
                        styles.text,
                        {color: '#6B6B6B', fontFamily: fonts.bold},
                      ]}>
                      Upload Invoice
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={
                      Data.package_price == '0.00' ||
                      Data.package_status == 'payment_received' ||
                      Data.package_status == 'on_the_way' ||
                      Data.package_status == 'ready_for_pickup' ||
                      Data.package_status == 'package_collected'
                        ? true
                        : false
                    }
                    style={[
                      styles.buttonPay,
                      {
                        backgroundColor:
                          Data.package_price == '0.00' ||
                          Data.package_status == 'payment_received' ||
                          Data.package_status == 'on_the_way' ||
                          Data.package_status == 'ready_for_pickup' ||
                          Data.package_status == 'package_collected'
                            ? 'grey'
                            : '#F67A08',
                      },
                    ]}
                    onPress={() => {
                      onPressPay();
                    }}>
                    <Text
                      style={[
                        styles.text,
                        {color: 'white', fontFamily: fonts.bold},
                      ]}>
                      Pay
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              console.log('')
            )}

            <RBSheet
              height={480}
              width={'100%'}
              ref={refRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={true}
              customStyles={{
                container: {
                  paddingHorizontal: 30,
                  paddingVertical: 10,
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                  width: '100%',
                  // justifyContent: "center",
                  alignItems: 'center',
                },
                draggableIcon: {
                  width: 50,
                  height: 3,
                },
              }}>
              <View
                style={{
                  width: '100%',
                  flex: 1,
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingVertical: 10,
                    width: '100%',
                    flex: 1,
                  }}>
                  <View
                    style={{
                      marginTop: moderateScale(5),
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onPressPaymentMethod(1)}
                      style={styles.radioButton}>
                      <View
                        style={[
                          styles.radioButtonHolder,
                          {
                            borderColor:
                              paymentType == 'cash'
                                ? colors.primary_color
                                : '#CCCCCC',
                          },
                        ]}>
                        {paymentType == 'cash' ? (
                          <View style={styles.radioIcon} />
                        ) : null}
                      </View>
                      <Text style={styles.label}>Pay By Cash</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => onPressPaymentMethod(2)}
                      style={[styles.radioButton]}>
                      <View
                        style={[
                          styles.radioButtonHolder,
                          {
                            borderColor:
                              paymentType == 'online'
                                ? colors.primary_color
                                : '#CCCCCC',
                          },
                        ]}>
                        {paymentType == 'online' ? (
                          <View style={styles.radioIcon} />
                        ) : null}
                      </View>
                      <Text style={styles.label}>Pay By Online</Text>
                    </TouchableOpacity>
                  </View>

                  <View height={25} />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      width: '100%',
                      alignItems: 'center',
                      // paddingLeft: 35,
                    }}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        onPressApplyCoin();
                      }}>
                      <Image
                        style={{
                          height: moderateScale(22),
                          width: moderateScale(22),
                          resizeMode: 'contain',
                        }}
                        source={
                          coin_apply
                            ? require('../assets/images/check.png')
                            : require('../assets/images/uncheck.png')
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.text,
                        {
                          color: 'black',
                          fontFamily: fonts.semibold,
                          marginLeft: moderateScale(10),
                        },
                      ]}>
                      Apply Coins
                    </Text>
                  </View>

                  {coin_apply ? (
                    <View style={styles.SectionStyle}>
                      <View
                        style={{
                          position: 'absolute',
                          width: '100%',
                          height: 50,
                          justifyContent: 'center',
                          alignItems: 'flex-end',
                        }}>
                        <TouchableOpacity
                          style={{width: '25%'}}
                          activeOpacity={0.8}
                          onPress={() => {
                            totalAmount();
                          }}>
                          <View
                            style={{
                              backgroundColor: colors.primary_color,
                              height: verticalScale(30),
                              borderRadius: moderateScale(5),
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{fontFamily: fonts.bold, color: 'white'}}>
                              Submit
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={{
                          // flex: 1,
                          fontFamily: fonts.regular,
                          width: '80%',
                        }}
                        autoCapitalize="none"
                        value={coins}
                        onChangeText={e => {
                          setCoins(e);
                        }}
                        placeholder="Coins"
                        keyboardType="numeric"
                      />
                    </View>
                  ) : (
                    console.log('')
                  )}
                  <View
                    style={{
                      marginTop: moderateScale(15),
                      paddingVertical: 10,
                      width: '100%',
                      // paddingHorizontal: 25,
                      justifyContent: 'center',
                    }}>
                    <View style={[styles.rect, {backgroundColor: '#F3F3F3'}]}>
                      <View style={styles.viewContainer3}>
                        <Text style={styles.textLeftpop}>
                          Total Package Price
                        </Text>
                        <Text style={styles.textRightpop}>
                          {'$' + Data.package_price}
                        </Text>
                      </View>
                      <View style={styles.lineStyle} />
                      {coinInput ? (
                        <View style={styles.viewContainer3}>
                          <Text style={styles.textLeftpop}>Coin Applied</Text>
                          <Text style={styles.textRightpop}>
                            {finalcoins == '' ? '$ 0.00' : '$' + finalcoins}
                          </Text>
                        </View>
                      ) : (
                        console.log('')
                      )}
                      {coinInput ? (
                        <View style={styles.lineStyle} />
                      ) : (
                        console.log('')
                      )}
                      <View style={styles.viewContainer3}>
                        <Text
                          style={[styles.textLeftpop, {fontWeight: 'bold'}]}>
                          Grand Total
                        </Text>
                        <Text
                          style={[styles.textRightpop, {fontWeight: 'bold'}]}>
                          {'$' + total}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.buttonProceed,
                    {marginTop: 15, marginBottom: 5},
                  ]}
                  onPress={() => {
                    if (paymentType == 'cash') {
                      CallApiforPay();
                    } else {
                      navigation.navigate('PaymentScreen', {
                        total,
                        coinApply: coinInput,
                        Data,
                      });
                    }
                    refRBSheet.current.close();
                  }}>
                  <Text
                    style={[
                      styles.text,

                      {color: 'white', fontFamily: fonts.bold},
                    ]}>
                    Proceed
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheet>

            {/* UPLOAD INVOICE */}
            <RBSheet
              height={300}
              width={'100%'}
              ref={refInvoiceRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={true}
              customStyles={{
                container: {
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  borderTopRightRadius: 30,
                  borderTopLeftRadius: 30,
                  width: '100%',
                },
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  flex: 1,
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingVertical: 10,
                    // flex: 1,
                    borderRadius: 15,
                    borderWidth: 1,
                    width: '100%',
                    paddingHorizontal: 10,
                    borderColor: 'lightgrey',
                    height: verticalScale(130),
                  }}>
                  <Text
                    style={{
                      marginBottom: moderateScale(10),
                      marginLeft: moderateScale(10),
                      alignSelf: 'flex-start',
                      fontFamily: fonts.semibold,
                      color: colors.accent_color,
                      fontSize: moderateScale(14),
                    }}>
                    Upload Invoice
                  </Text>
                  {/* <FlatList
                    style={{ width: "100%", flex: 1, marginTop: moderateScale(5) }}
                    data={[...invoiceList, { plusImage }]}
                    // numColumns={3}
                    renderItem={render}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()} /> */}
                  <View style={{flexDirection: 'row'}}>
                    {invoice != '' ? (
                      <View style={{marginRight: moderateScale(15)}}>
                        <Image
                          style={[
                            styles.ImageContainer1,
                            {position: 'absolute'},
                          ]}
                          source={require('../assets/images/placeholder.png')}
                        />

                        {invoice.type.includes('pdf') ? (
                          <View
                            style={[
                              styles.viewContainer2,
                              {
                                paddingHorizontal: 5,
                                backgroundColor: '#f2f2f2',
                              },
                            ]}>
                            <Image
                              style={{
                                height: verticalScale(24),
                                width: scale(24),
                                resizeMode: 'contain',
                              }}
                              source={require('../assets/images/pdf.png')}
                            />
                            <Text
                              numberOfLines={3}
                              ellipsizeMode={'tail'}
                              style={{
                                textAlign: 'center',
                                marginTop: moderateScale(5),
                                fontSize: moderateScale(10),
                                fontFamily: fonts.semibold,
                                color: colors.accent_color,
                              }}>
                              {invoice.name}
                            </Text>
                          </View>
                        ) : (
                          <Image
                            style={styles.ImageContainer1}
                            source={{uri: invoice.uri}}
                          />
                        )}
                        <View
                          style={{
                            position: 'absolute',
                            justifyContent: 'center',
                            height: moderateScale(30),
                            width: '100%',
                            alignItems: 'center',
                          }}>
                          <TouchableOpacity
                            style={{
                              alignSelf: 'flex-end',
                              marginTop: moderateScale(-20),
                            }}
                            onPress={() => {
                              setInvoice('');
                            }}>
                            <View
                              style={{
                                justifyContent: 'center',
                                height: moderateScale(20),
                                width: moderateScale(20),
                                alignSelf: 'flex-end',
                                backgroundColor: 'red',
                                borderRadius: moderateScale(20),
                                alignItems: 'center',
                                left: moderateScale(3),
                              }}>
                              <Icon1
                                name={'delete'}
                                size={12}
                                color={'white'}
                                style={{alignSelf: 'center'}}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      console.log('')
                    )}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => {
                        setShowPicker(true);
                        // setImageStatus("Documents")
                      }}>
                      <View style={styles.viewContainer2}>
                        <Icon3
                          name={'plus'}
                          size={30}
                          color={colors.primary_color}
                        />
                        <Text
                          bold
                          style={{
                            textAlign: 'center',
                            fontSize: moderateScale(13),
                            color: colors.primary_color,
                          }}>
                          Add Invoice
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.buttonProceed, {marginTop: 30}]}
                  onPress={() => {
                    if (invoice == '') {
                      showErrorMessage('Please Add Invoice');
                    } else {
                      refInvoiceRBSheet.current.close();
                      CallApiforUploadInvoice();
                    }
                  }}>
                  <Text
                    style={[
                      styles.text,

                      {color: 'white', fontFamily: fonts.bold},
                    ]}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </RBSheet>
            {/* </View> */}

            <Modal
              visible={showPicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => closePicker()}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  backgroundColor: 'rgba(10, 10, 10, 0.7)',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: Dimensions.get('window').width / 1.3,
                    alignSelf: 'center',
                    borderRadius: moderateScale(10),
                  }}>
                  <View
                    style={{
                      backgroundColor: 'black',
                      padding: moderateScale(12),
                      borderTopEndRadius: moderateScale(10),
                      borderTopStartRadius: moderateScale(10),
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        alignSelf: 'center',
                        fontSize: moderateScale(16),
                      }}>
                      Choose Option
                    </Text>
                    <Icon
                      name="close-circle"
                      size={moderateScale(35)}
                      color={'white'}
                      onPress={() => {
                        closePicker();
                      }}
                      style={{
                        position: 'absolute',
                        end: 6,
                        top: 6,
                        bottom: 0,
                        justifyContent: 'center',
                      }}
                    />
                  </View>
                  <View style={{padding: moderateScale(20)}}>
                    <CustomButton
                      paperTheme={false}
                      buttonStyle={{backgroundColor: colors.primary_color}}
                      icon={require('../assets/images/take_image.png')}
                      textStyle={{fontSize: moderateScale(13)}}
                      title="Take Image"
                      onPress={() => {
                        setTimeout(() => {
                          showCamera(1);
                          closePicker();
                        }, 500);
                      }}
                    />
                    <View height={verticalScale(18)} />
                    <CustomButton
                      paperTheme={false}
                      buttonStyle={{backgroundColor: colors.primary_color}}
                      icon={require('../assets/images/choose_from_gallery.png')}
                      textStyle={{fontSize: moderateScale(13)}}
                      title="Choose from Gallery"
                      onPress={() => {
                        setTimeout(() => {
                          showCamera(2);
                        }, 500);
                        closePicker();
                      }}
                    />
                    <View height={verticalScale(18)} />
                    <CustomButton
                      paperTheme={false}
                      buttonStyle={{backgroundColor: colors.primary_color}}
                      icon={require('../assets/images/choose_from_gallery.png')}
                      textStyle={{fontSize: moderateScale(13)}}
                      title="Choose Document"
                      onPress={() => {
                        setTimeout(() => {
                          pickDocuments();
                        }, 500);
                        closePicker();
                      }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
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

  buttonPay: {
    width: '35%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    // borderWidth: 1,
    // borderColor: '#F67A08',
    backgroundColor: '#F67A08',
  },
  buttonProceed: {
    width: '100%',
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
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 10,
    // marginTop: 84,
    // alignSelf: 'center',
    // ...Platform.select({
    //   ios: {
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.8,
    //     shadowRadius: 2,
    //   },
    //   android: {
    //     elevation: 5,
    //   },
    // }),
  },
  textRight: {
    width: '50%',
    textAlign: 'right',
    fontFamily: fonts.regular,
  },
  textRightpop: {
    width: '30%',
    textAlign: 'right',
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  textLeft: {
    width: '50%',
    color: '#F67A08',
    fontFamily: fonts.regular,
  },
  textLeftpop: {
    width: '70%',
    color: 'black',
    fontFamily: fonts.regular,
    fontSize: 16,
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
  viewContainer2: {
    height: moderateScale(90),
    borderRadius: moderateScale(12),
    backgroundColor: colors.textInput_bgColor,
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(90),
    borderColor: colors.card_border_color,
    // flex: 1
    borderWidth: moderateScale(1),
  },
  ImageContainer1: {
    height: moderateScale(90),
    borderRadius: moderateScale(12),
    resizeMode: 'cover',
    width: moderateScale(90),
    borderColor: colors.card_border_color,
    // flex: 1
    borderWidth: moderateScale(1),
  },
  viewContainer3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
  },
  lineStyle: {
    marginVertical: 15,
    backgroundColor: 'lightgrey',
    height: 0.5,
  },
  radioButton: {
    flexDirection: 'row',
    // margin: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  radioButtonHolder: {
    borderRadius: moderateScale(50),
    borderWidth: moderateScale(2),
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(20),
    width: moderateScale(20),
    borderColor: '#CCCCCC',
  },
  radioIcon: {
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(10),
    width: moderateScale(10),
    backgroundColor: colors.primary_color,
  },
  label: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: 'black',
    fontFamily: fonts.semibold,
  },
  SectionStyle: {
    flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: 'grey',
    height: 50,
    width: '100%',
    borderRadius: 8,
    marginTop: 20,
    paddingLeft: moderateScale(10),
  },
});

export default ShippingScreen;
