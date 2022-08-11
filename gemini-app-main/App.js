import React, {useEffect} from 'react';
// import type {Node} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import CustomNavigation from './navigation/CustomNavigation';
import SplashScreen from 'react-native-splash-screen';
import {LogBox, SafeAreaView} from 'react-native';
import { API_URL } from './utils/constant';

const App = () => {
  // return <Signup />;


  LogBox.ignoreAllLogs(true);
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);
  return (
    <SafeAreaView flex={1}>
      <NavigationContainer>
        <CustomNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
};

App.nevi;

export default App;
