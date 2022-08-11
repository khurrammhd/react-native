import React, {Component} from 'react';
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
} from 'react-native';
import {fonts} from '../utils/constant';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');
function NotificationScreen(props) {
  const Item = ({data}) => (
    <View style={styles.item}>
      <View width={'15%'}>
        <Image
          resizeMode="cover"
          source={require('../assets/images/noti-logo.png')} //Change your icon image here
          style={styles.ImageStyle}
        />
      </View>
      <View width={'85%'} style={{paddingLeft: 5}}>
        <Text style={styles.title}>
          {data.text1}
          <Text style={[styles.title, {color: 'orange'}]}>
            {' ' + data.text3}
          </Text>
        </Text>

        <Text style={styles.timer}>{data.text2}</Text>
      </View>
    </View>
  );

  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      text1: 'Your Package is accepted ',
      text2: '10 min ago',
      text3: 'josheph',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      text1: 'Your Package is accepted ',
      text2: '10:34 pm',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: 'Your Package is accepted',
      text2: '20 min ago',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: 'Your Package is deliverd ',
      text2: '10:34 pm',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: 'Third Item Your Package is accepted',
      text2: '10:34 pm',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: '90 points are added in your wallet ',
      text2: '5 min ago',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: 'Your Package is accepted',
      text2: '10:34 pm',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: 'Your Package is accepted',
      text2: '10:34 pm',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: 'Your Package is accepted',
      text2: '3 min ago',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: '90 points are added in your wallet ',
      text2: '5 min ago',
      text3: 'josheph',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      text1: 'Your Package is accepted',
      text2: '10:34 pm',
      text3: 'josheph',
    },

   
  ];
  const renderItem = ({item}) => <Item data={item} />;
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
        <TouchableOpacity
          onPress={() => onBackPress()}
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingVertical: 5,
          }}>
          {/* <IconBackArrow /> */}
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            backgroundColor: ' #132E5B',
            // color:"white"
          }}>
          <Text style={styles.titleText}>Notification</Text>
        </View>
      </View>
      {/* <ImageBackground source={image} resizeMode="cover" style={styles.image}> */}
      <View
        style={{
          paddingVertical: 10,
          width: '100%',
          paddingHorizontal: 15,
          justifyContent: 'center',
          flex: 1,
        }}>
        <ImageBackground
          source={require('../assets/images/mapback.png')}
          resizeMode="cover"
          style={styles.image}
        />
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          // style={{marginBottom:50}}
          contentContainerStyle={{paddingBottom: 100}}
        />
      </View>
    </SafeAreaView>
   
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: width,
    height: height,
    // padding: 20,
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
    position: 'absolute',
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

export default NotificationScreen;
