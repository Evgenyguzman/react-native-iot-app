import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  Button
} from 'react-native';

import withLogout from './withLogout';

import HydraService from '../services/HydraService';

import C from '../store/constants'
import { DeviceCard } from '../components/cards';
// import { TextInput } from 'react-native-gesture-handler';

export default class DevicesScreen extends React.Component {

  static navigationOptions = (props) => {
    // console.log('nav options')
    // console.log(props)
    return({
      headerStyle: {
        backgroundColor: '#804C2F'
      },
      headerTitleStyle: {
        color: '#FFF',
      },
      headerRight: (
        <Button
          onPress={() => {
            const hydra = HydraService.getInstance()
            hydra.logout()
            props.navigation.navigate('Login', { msg: 'quit' })
          }}
          title="Выйти"
          color="#FFF"
        />
      ),
    }) 
  }

  constructor(props){
    super(props)
    this.state={
      isModalVisible: false,
      id: undefined
    }

    this.addDevice = this.addDevice.bind(this)

  }

  componentWillMount(){
    // console.log(this.props)
    // const {name} = this.props.navigation.state.params
    // ProfileScreen.navigationOptions.title = name
  }

  addDevice = async () => {
    const { id } = this.state
    console.log(id)
    const hydra = HydraService.getInstance()
    if(hydra.isConnected()){
      // отправляем запрос в облако
      const res = await hydra.addDevice(id)
      console.log(res)
      {/* const res = false */}
      // реагируем на ответ
      if(res){
        Alert.alert('Устройство успешно добавлено')
        this.setState({isModalVisible: false})
        this.props.onAdd(id)
        // обновить список devices
      }else{
        Alert.alert('Ошибка добавления')
      }
    }
  }

  // deleteDevice = async (id) => {
  //   console.log(id)
  //   const hydra = HydraService.getInstance()
  //   if(hydra.isConnected()){
  //     const res = await hydra.deleteDevice(id)
  //     console.log(res)
  //     if(res){
  //       Alert.alert('Устройство успешно удалено')
  //     }else{
  //       Alert.alert('Ошибка удаления')
  //     }
  //   }
  // }

  // renameDevice = async (id, name) => {
  //   console.log(id)
  //   const hydra = HydraService.getInstance()
  //   if(hydra.isConnected()){
  //     const res = await hydra.renameDevice(id, name)
  //     console.log(res)
  //     if(res){
  //     }else{
  //       Alert.alert('Ошибка')
  //     }
  //   }
  // }

  render() {
    const store = this.props.store
    const { devices, things } = store.panel

    // things = {}
    // devices = []
    // console.log(things)
    // console.log(things["e696888e-b98f-46a4-ac44-4efb956f80d2"][2].items[0].value)
    // console.log(this.props.screenProps.store.getState())
    // const {name, children} = this.props

    // console.log('devices store')
    
    // структура
    // systems = [
    //   {
    //     id: '',
    //     status: 'online',
    //     type: 'dpliteplus',
    //     things: {}
    //   },
    //   ...
    // ]

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={{
            marginVertical: 10
          }}> 
            {
              devices.map((item, i) => 
                <View key={item.id}>
                  <DeviceCard navigate={this.props.navigation.navigate} system={item} things={things[item.id]} onRemove={()=>{this.props.onDelete(item.id)}} />
                </View>
              )
            }
            {/* Отображаем все устройства и кнопку добавить */}

            <Button
              title="Добавить устройство"
              onPress={() => 
                this.setState({isModalVisible: true})
              }
            />
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.isModalVisible}
              onRequestClose={() => {
                this.setState({isModalVisible: false})
              }}
            >
              <View style={{ 
                flex: 1, 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: 'center',}}
              >
                <Button
                  title="Закрыть"
                  onPress={() => this.setState({isModalVisible: false}) }
                />
                <TextInput
                  placeholder = "Идентификатор"
                  placeholderTextColor = '#fff'
                  style={{width: 300, height: 40, backgroundColor: '#000', color: '#fff', fontFamily: 'montserrat', paddingLeft: 20, marginTop: 5, marginBottom: 20}}
                  editable = {true}
                  maxLength = {40}
                  onChangeText={(id) => {this.setState({id})}}
                  value={this.state.id}
                />
                <TouchableOpacity onPress={this.addDevice} >
                  <Text>Добавить</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </View>
    );
  }

  async componentWillMount(){
    // проверить наличие токена
    // const { id, token } = this.props.navigation.state.params
    const hydra = HydraService.getInstance()
    const state = this.props.store
    // console.log(state.user)

    if(state.user.token){

      setTimeout( async ()=>{
        if(hydra.isConnected()){
          if(!hydra.isAuthorized()){
            const { user, token} = state.user
            const res = await hydra.login(user, token)
            if(res){
              // console.log(res)
              // записываем в store
            }else {
              console.log('error')
              // clear store?
              this.props.navigation.navigate('Login', {msg: 'error login' })
            }
          }
          
        }else{
          console.log('no connect')
        }
      }, 1000)

    }else{
      console.log('no data')
      this.props.navigation.navigate('Login', {msg: 'no data' })
    }

    // console.log(state.user)
   
  }

  onQuit(){
    // clear store
    // navigate to login
    const hydra = HydraService.getInstance()
    hydra.logout()
    this.props.onQuit({type: C.QUIT})
    this.props.navigation.navigate('Login', { msg: 'quit' })

  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  }
});

// export default DevicesScreenWithLogout = withLogout(DevicesScreen)