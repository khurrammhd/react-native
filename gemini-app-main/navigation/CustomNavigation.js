import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screen/LoginScreen';
import Signup from '../screen/SignupScreen';
import ForgetPassword from '../screen/ForgetPassword';
import Tabber from './TabNavigations';
import PointScreen from '../screen/PointScreen';
import ShippingScreen from '../screen/ShippingScreen';
import EditProfileScreen from '../screen/EditProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Splash from '../screen/SplashScreen';
import PaymentScreen from '../screen/PaymentScreen';
import FlashMessage from "react-native-flash-message";
let navScreen = '';

export default function CustomNavigation({ navigation }) {
  const Stack = createStackNavigator();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ForgetPassword"
          component={ForgetPassword}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MainScreen"
          component={Tabber}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PointScreen"
          component={PointScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShippingScreen"
          component={ShippingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <FlashMessage position="top" />
    </View>
  );
}
