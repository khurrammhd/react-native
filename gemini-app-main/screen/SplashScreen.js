import React, { useState, useEffect } from 'react';
import { StyleSheet, StatusBar, Image, View, Text, Platform } from 'react-native';

import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Splash(props) {
  // console.log("props", props)
  const { navigation } = props;

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        // console.log('value', value);
        navigation.replace('MainScreen');
      } else {
        navigation.replace('Login');
      }
    } catch (error) {
      navigation.replace('Login');
      console.log(error);
    }

    if (Platform.OS == 'ios') SplashScreen.hide();
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  return null;
}

const styles = StyleSheet.create({
  splash: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
