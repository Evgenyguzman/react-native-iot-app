import React from 'react';

import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";

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
  onTransitionStart: (props) => {
    console.log('transition start', props)
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
