import React from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { MonoText } from './StyledText';

import { SwipeRow } from 'react-native-swipe-list-view';


export class DeviceCard extends React.Component {
  render(){
    return(
      <SwipeRow
        disableRightSwipe={true}
        rightOpenValue={-150}
      >
        <View style={styles.standaloneRowBack}>
          <Text>?</Text>
          <TouchableOpacity style={{backgroundColor: 'tomato'}} onPress={()=>{this.props.onRemove()}}><Text style={styles.backTextWhite}>Delete</Text></TouchableOpacity>
        </View>
        <DeviceCardWithoutSwipe {...this.props} />
      </SwipeRow>
    )
  }
}

const styles = StyleSheet.create({
	standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#e7e7e7',
		justifyContent: 'center',
		height: 50,
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: '#e9e9e9',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
  },
  backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75
	},
	backRightBtnLeft: {
		backgroundColor: 'blue',
		right: 75
	},
})

export class DeviceCardWithoutSwipe extends React.Component {
  constructor(props){
    super(props)
  }
  render() {
    const system = this.props.system
    const things = this.props.things
    let temp = '-'
    if(things && things[2]){
      temp = things[2].items[0].value
    }

    // // status = getStatus()
    const status = ['brewing', 'heating']
    let devices = []
    let statusText = ''

    if(status[0] === 'manual'){
      // добавить все температуры, мощность нагрева, откр. холодильника
      statusText = 'Ручное управление'
      devices.push({
        name: 'Температура 1',
        value: temp
      })
      devices.push({
        name: 'Температура 2',
        value: '55.5˚C'
      })
      devices.push({
        name: 'Температура 3',
        value: '25.5˚C'
      })
      devices.push({
        name: 'Мощность',
        value: '50%'
      })
      devices.push({
        name: 'Охладитель',
        value: '50%'
      })
    }else if(status[0] === 'brewing'){
      // датчик
      // мешалка
      devices.push({
        name: 'Температура',
        value: temp
      })
      devices.push({
        name: 'Мешалка',
        value: false
      })
      if(status[1] === 'heating'){
        statusText = 'Идет разогрев'
      }else if(status[1] === 'pauses'){
        statusText = 'Идет затирание'
        // шаг
        devices.push({
          name: 'Шаг',
          value: 3
        })
      }else if(status[1] === 'boiling'){
        statusText = 'Идет кипячение'
      }
    }else if(status[0] === 'evaporation'){
      // мощность тэна
      devices.push({
        name: 'Мощность',
        value: '50%'
      })
      // номер этапа
      devices.push({
        name: 'Шаг',
        value: 3
      })
      if(status[1] === 'distillation'){
        statusText = 'Идет дистилляция'
        // датчик 1
        devices.push({
          name: 'Температура',
          value: '55.5˚C'
        })
      }else if(status[1] === 'rectification'){
        statusText = 'Идет ректификация'
        // датчик 2
        devices.push({
          name: 'Температура',
          value: '25.5˚C'
        })
      }
    }else if(status[0] === 'off'){
    }


    return (
        <TouchableOpacity 
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          marginHorizontal: 10,
          marginVertical: 5,
          backgroundColor: '#804C2F',
          borderRadius: 5,
          position: 'relative',
          elevation:4,
          shadowOffset: { width: 5, height: 5 },
          shadowColor: "black",
          shadowOpacity: 0.5,
          shadowRadius: 10
        }}
      onPress={() => {
        // if(system.online){
          this.props.navigate('Device', {id: system.id})
        // }
      }}>
        <Text style={{color: '#fff'}}>{system.name} <MonoText>{statusText}</MonoText></Text>
        {/* Тут подсказка о статусе работы (выкл, этап варки, этап перегона) */}
        <View style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 10,
          overflow: 'hidden',
          borderTopRightRadius: 5,
          borderBottomRightRadius: 5,
          backgroundColor: (system.online) ? 'green' : 'red'
        }}></View>
        {/* отобразить сформированный массив параметров (числовых и дискретных) */}
        <View style={{
          flex: 1,
          flexWrap: 'wrap'
        }}>
          {
            devices.map((device, i)=>
              <View key={i} style={{
                flex: 2,
                flexDirection: 'column',
                alignItems: 'stretch'
              }}>
                <Text style={{textAlign: 'center'}}>{device.name}</Text>
                <Text style={{textAlign: 'center'}}>{device.value}</Text>
              </View>
            )
          }
        </View>
        
        
      </TouchableOpacity>
    )
  }
}