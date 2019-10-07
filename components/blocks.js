import React from 'react';
import { View, StyleSheet } from 'react-native';
import HydraService from '../services/HydraService';
import { DpLitePlus, DpPro } from './views/main/views';

export class DeviceUnit extends React.Component {
  constructor(){
    super()

  }
  render() {

    const system = this.props.system
    // const things = this.props.things
    // const system = {
    //   type: 'dp-lite-plus'
    // }
    // console.log('System:', system)
    const things = {
      heater: {

      },
      mixer: {

      }
    }

    let unit = ''
    switch(system.type){
      case 'dp-lite-plus':
        unit = <DpLitePlus system={system} things={things} onAction={this.onAction}></DpLitePlus>
        break
      case 'dp-pro':
        unit = <DpPro system={system} things={things} onAction={this.onAction}></DpPro>
        break
      default:
        break
    }

    // 
    // const things = this.props.things
    return (
      <View style={styles.container}>
        {unit}
      </View>
    )
  }

  onAction(data){
    
    console.log(data)

    // вызываем changeValue and runMethod
    // надо еще systemId ???
    // const hydra = HydraService.getInstance()
    // if(data.action === 'set'){
    //   hydra.changeValue(data.thing, data.item, data.value)
    // }else if(data.action === 'call'){
    //   hydra.runMethod(data.thing, data.method, data.arguments)
    // }
   
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});