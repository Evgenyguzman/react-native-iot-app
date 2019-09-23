import React from 'react';
import {
  Platform,
  ScrollView,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View, 
  Alert,
  // Image,
  ImageBackground
} from 'react-native';
import { Keyboard } from 'react-native'
import { WebBrowser } from 'expo';

import Image from 'react-native-remote-svg'

import { TabView, TabBar } from 'react-native-tab-view';

import HydraService from '../services/HydraService';

import C from '../store/constants'

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'Вход' },
        { key: 'second', title: 'Регистрация' },
      ],
      signIn_id: '',
      signIn_password: '',
      signUp_id: '',
      signUp_password: ''
    };
  }

  render() {

    console.log('login')

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> */}
        <ImageBackground 
          source={require('../assets/images/bm.jpg')} 
          style={{width: '100%', height: '100%' }}
          imageStyle={{opacity: 0.5, overlayColor: 'rgba(255,255,255,0.5)'}}>
          
          <TabView
            style={{flex: 1}}
            navigationState={this.state}
            renderTabBar = {(props) => {
              // console.log(props)
              return(
                <TabBar
                  {...props}
                  // scrollEnabled
                  indicatorStyle={{backgroundColor: '#FAF9F7'}}
                  style={{backgroundColor: '#804C2F', paddingTop: 20}}
                  // tabStyle={{ }}
                  // labelStyle={{ color: '#fff', }}
                />
              )
            }}
            renderScene = {({ route }) => {
              switch (route.key) {
                case 'first':
                  return <SignIn _handleSignIn={(id, password)=>{this._handleSignIn(navigate, id, password)}} _handleForgotPassword={()=>{this._handleForgotPassword(navigate)}} />;
                case 'second':
                  return <SignUp _handleSignUp={(id, password)=>{this._handleSignUp(id, password)}} />;
                default:
                  return null;
              }
            }}
            onIndexChange={index => this.setState({ index })}
            initialLayout={{ width: Dimensions.get('window').width, height: 200 }}
          />

          <View style={styles.welcomeContainer} >
            <Image
              source={ require('../assets/images/logo.png')}
              style={{ width: 200, height: 150 }}
            />
          </View>

        </ImageBackground>

        {/* </ScrollView> */}

      </View>
    );
  }

  componentWillMount() {
    // const state = this.props.screenProps.store.getState()
    // console.log(this.props)
  }

  _handleSignIn =  async (navigate, id='test0', password='test0') => {
    const hydra = HydraService.getInstance()
    if(hydra.isConnected()){
      const res = await hydra.getToken(id, password)
      if(res){
        // записываем в store
        this.props.onSignIn({type: C.SIGN_IN, user: id, token: res})
        navigate('Devices', { id: id, token: res })
      }else {
        console.log('error get token')
        Alert.alert('Invalid data.');
      }
    }else{
      console.log('no connect')
    }
  }

  _handleSignUp = async (id, password) => {
    const hydra = HydraService.getInstance()
    if(hydra.isConnected()){
      const res = await hydra.register(id, password)
      if(res === 0){
        console.log('success')
        Alert.alert('Success.');
      }else if(res === 1){
        console.log('user exists')
        Alert.alert('User exists.');
      }else {
        console.log('error')
        Alert.alert('Invalid data.');
      }
    }else{
      console.log('no connect')
    }
  }

  _handleForgotPassword = (navigate) => {
    navigate('ForgotPassword', { user: 'user' })
  }

}


class SignIn extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      id: undefined,
      password: undefined
    }

  }

  render(){
    return(
    // получаем из store user и maybe password
    // вставляем их в input
    
    <View onPress={Keyboard.dismiss} style={[styles.scene, { backgroundColor: 'rgba(255,255,255,.8)', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
      <DismissKeyboardView>
        <TextInput
          placeholder = "Email"
          placeholderTextColor = '#000'
          style={{width: 300, height: 40, backgroundColor: '#fff', color: '#000', fontFamily: 'montserrat', paddingLeft: 20, marginTop: 5}}
          editable = {true}
          maxLength = {40}
          onChangeText={(id) => {this.setState({id})}}
          value={this.state.id}
        />
      </DismissKeyboardView>
      <TextInput
        placeholder = "Пароль"
        placeholderTextColor = '#000'
        style={{width: 300, height: 40, backgroundColor: '#fff', color: '#000', fontFamily: 'montserrat', paddingLeft: 20, marginTop: 5, marginBottom: 20}}
        editable = {true}
        maxLength = {40}
        onChangeText={(password) => {this.setState({password})}}
        value={this.state.password}
        secureTextEntry={true}
      />
      <Button
        onPress={()=>{ 
          console.log('signIn')
          console.log(this.state)
          // console.log(this.id)
          // console.log(this.id._lastNativeText)
          // console.log(this.textInput.value)

          // console.log(this.refs.password)
          // console.log(this.refs.id)
          this.props._handleSignIn(this.state.id, this.state.password) 
        }}
        title="Вход"
        color='#000'
        accessibilityLabel="Вход в систему"
        style={{
          fontFamily: 'segoe-ui-light'
        }}
      />
      <Button
        onPress={()=>{ this.props._handleForgotPassword() }}
        title="Забыли пароль?"
        color="#000"
        accessibilityLabel="Восстановление пароля"
      />
    </View>
    )
  
  }
}

class SignUp extends React.Component {
  // console.log(props)
  constructor(props){
    super(props)
    this.state = {
      id: undefined,
      password: undefined
    }
  }

  render(){
    return(

    <View style={[styles.scene, { backgroundColor: 'rgba(0,0,0,.8)', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
      <TextInput
        placeholder = "Email"
        placeholderTextColor = '#fff'
        // style={{width: 300, height: 40, backgroundColor: '#000', color: '#fff', fontFamily: 'montserrat', paddingLeft: 20, marginTop: 3}}
        editable = {true}
        maxLength = {40}
        onChangeText={(id) => {this.setState({id})}}
        value={this.state.id}
      />
      <TextInput
        placeholder = "Пароль"
        placeholderTextColor = '#fff'
        style={{width: 300, height: 40, backgroundColor: '#000', color: '#fff', fontFamily: 'montserrat', paddingLeft: 20, marginTop: 5, marginBottom: 20}}
        editable = {true}
        maxLength = {40}
        onChangeText={(password) => {this.setState({password})}}
        value={this.state.password}
        secureTextEntry={true}
      />
      <Button
        onPress={()=>{ 
          console.log('signUp') 
          this.props._handleSignUp(this.state.id, this.state.password)
        }}
        title="Регистрация"
        color="#fff"
        accessibilityLabel="Зарегистрировать учетную запись"
      />
    </View>
    )

  }
  
}

const DismissKeyboardHOC = (Comp) => {
  return ({ children, ...props }) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...props}>
        {children}
      </Comp>
    </TouchableWithoutFeedback>
  );
};
const DismissKeyboardView = DismissKeyboardHOC(View)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    flex: 0.5,
    // backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  scene: {
    flex: 1,
  }
});
