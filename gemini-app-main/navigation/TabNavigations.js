import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ForgetPassword from '../screen/ForgetPassword';
import Signup from '../screen/SignupScreen';
import HomeScreen from '../screen/HomeScreen';
import NotificationScreen from '../screen/NotificationScreen';
import ProfileScreen from '../screen/ProfileScreen';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { colors } from '../utils/constant';
const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');
export default function Tabber() {
  const screenOptions = {
    showLabel: false,
    tabBarStyle: {
      // position: 'absolute',
      // bottom: 5,

      // padding: 20,
      // marginLeft: 5,
      // marginRight: 5,
      elevation: 0,
      backgroundColor: 'white',
      borderRadius: 50,
      height: 60,
    },
    tabBarOptions: {
      showLabel: false,
      // tabBarVisible: false,
      // showLabel: false,
      // // showIcon: true,
      // tintColor: 'yellow',
      // activeTintColor: '#aaa',
    },
    // tabBarItemStyle: {
    //   backgroundColor: '#00ff00',
    //   margin: 5,
    //   borderRadius: 15,
    // },
  };
  return (
    <Tab.Navigator {...{ screenOptions }} initialRouteName={"Home"}>
      <Tab.Screen
        name={'Home'}
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          // tabBarLabel: 'Sale',

          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            return (
              <Image style={{ height: 23, width: 23, resizeMode: "contain" }} source={focused ? require("../assets/icons/orange_home.png") : require("../assets/icons/home.png")} />
            );
          },
        }}
      />
      <Tab.Screen
        name={'Notification'}
        component={NotificationScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          // tabBarLabel: 'Sale',
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            return (
              <Image style={{ height: 23, width: 23, resizeMode: "contain" }} source={focused ? require("../assets/icons/orange_notification.png") : require("../assets/icons/notification.png")} />

            );
          },
        }}
      />
      <Tab.Screen
        name={'Profile'}
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          // tabBarLabel: 'Sale',
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            return (
              <Image style={{ height: 23, width: 23, resizeMode: "contain" }} source={focused ? require("../assets/icons/orange_user.png") : require("../assets/icons/user2.png")} />

            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
