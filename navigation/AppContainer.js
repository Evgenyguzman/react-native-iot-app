import React from 'react';

// import DeviceScreen from "../screens/DeviceScreen";
// import DevicesScreen from "../screens/DevicesScreen";
// import LoginScreen from "../screens/LoginScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import {
  Button
} from 'react-native';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { DevicesScreenContainer, LoginScreenContainer, DeviceScreenContainer } from '../containers/containers';
import { createStackNavigator } from 'react-navigation-stack';

const AuthenticationNavigator = createStackNavigator({
  Login: {
    screen: LoginScreenContainer,
    path: 'login',
  },
  ForgotPassword: ForgotPasswordScreen,
},{
  initialRouteName: 'Login',
  defaultNavigationOptions: {
    
  },
  navigationOptions: {

  },
});

const SystemNavigator = createStackNavigator({
  Devices: {
    screen: DevicesScreenContainer,
    path: 'devices',
    navigationOptions: () => ({
      title: 'Устройства'
    })
  },
  Device: {
    screen: DeviceScreenContainer,
    path: 'device/:id',
  }
},{
  initialRouteName: 'Devices',
  onTransitionStart: () => {
    console.log('transition start')
  },
  defaultNavigationOptions: {
    
  },
  navigationOptions: {

  },
});

const AppNavigator = createSwitchNavigator({
  Auth: AuthenticationNavigator,
  System: SystemNavigator
},{
  initialRouteName: 'System'
});

export default AppContainer = createAppContainer(AppNavigator);
