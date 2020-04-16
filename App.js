import React from 'react'
import { AppState, AsyncStorage, Platform, StatusBar, StyleSheet, View, Text } from 'react-native'
import { AppLoading } from 'expo'
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'

import CloudConnector from './services/CloudConnector'

import storeFactory from './store'
import { Provider } from 'react-redux'
import AppContainer from './navigation/AppContainer'

import {
  setCustomTextInput,
  setCustomText,
} from 'react-native-global-props'

AsyncStorage.clear();
// let store = storeFactory(null)
// let isStoreLoading = true
let store = undefined
AsyncStorage.getItem('completeStore').then((value)=>{
  store = storeFactory(value)
  // isStoreLoading = false
})

// Setting default styles for all Text components.
const customTextProps = {
  style: {
    fontSize: 16,
    // fontFamily: Platform.OS === 'ios' ? 'montserrat' : 'Roboto',
    fontFamily: Platform.OS === 'ios' ? 'montserrat' : 'Roboto',
    color: 'black'
  }
}
const customTextInputProps = {
  style: {
    fontSize: 20,
    fontFamily: 'montserrat',
    paddingLeft: 10
  }
}

const isForOneDevice = true

export default class App extends React.Component {
  
  state = {
    isLoadingComplete: false,
    // isStoreLoading: false,
    // store: {}
  };

  // async componentWillMount() {
    // let store = await storeFactory()
    // this.setState({store})
    // console.log(store.getState()))
  // }

  render() {

    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <Provider store={store}>
            <CloudConnector isLocalhost={isForOneDevice} store={store} />
            <AppContainer />
          </Provider>
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'segoe-ui-light': require('./assets/fonts/SegoeUILight.ttf'),
        'montserrat': require('./assets/fonts/Montserrat.ttf'),
        'montserrat-bold': require('./assets/fonts/MontserratBold.ttf'),
      }).then((res)=>{
        setCustomText(customTextProps);
        setCustomTextInput(customTextInputProps);
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
