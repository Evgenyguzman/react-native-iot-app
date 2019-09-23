import React from 'react';
import { View, Text, Button, Switch, Slider, Alert, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ToggleSwitch, DiscreteSensor, NumberSlider, NumberWithPopup, Tabs, withTitle, MultipleNumberSlider, HeaderMedium, TimePicker } from '../../ui';
import { LinearGradient } from 'expo-linear-gradient';

import ModalDropdown from 'react-native-modal-dropdown';
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

export class StatusBar extends React.Component {
  
  items = [
    {
      name: 'Температура 1',
      icon: 'icon.png',
      value: '25.75',
      measure: '˚C'
    },
    {
      name: 'Температура 2',
      icon: 'icon.png',
      value: '25.5',
      measure: '˚C'
    }
  ]
  
  render() {
    // в зависимости от режима работы - разные отображаемые значения
    // получаем массив arr объектов с полями name, icon, value, linkToItem?
    // в цикле отображаем
    // const items = this.props.items

    return (
      <View style={{
        height: 60,
        // backgroundColor: 'powderblue'
      }}>
        <LinearGradient
          start={{x: 0, y: 0}} end={{x: 1, y: 0}} 
          colors={['#804C2F', '#fff']}
          style={{ flex: 1, padding: 15, alignItems: 'stretch' }}>

          <View style={{
            flex: 1, 
            flexDirection: 'row', 
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            {this.items.map((el, i)=>{
              return(
                <View key={i}>
                  <Text style={{textAlign: 'center'}}>{el.name}</Text>
                  <Text style={{textAlign: 'center'}}>{el.value + ' ' + el.measure}</Text>
                </View>
              )
            })}
          </View>

        </LinearGradient>
        
      </View>
    )
  }
}
export class HeaterManual extends React.Component {
  render() {

    // example
    const heater = {
      name: 'Ручное управление нагревом',
      icon: 'icon.png',
      enabled: true,
      status: {
        value: 'ON',
        enabled: true
      },
      power: {
        label: 'Мощность',
        value: '100',
        measure: '%',
        enabled: true
      }
    
    }

    // вкл/откл ручного режима, смена power (Switch & NumberWithPopup)
    return (
      <View>
        <ToggleSwitch name="Включение" onChange={this.props.onAction}/>
        <NumberSlider name="Мощность нагрева" onChange={this.props.onAction}/>
      </View>
    )
  }
}


export class HeaterAuto extends React.Component {
  render() {
    return (
      <View>
        <Text>Варка</Text>
        <BrewingTabs />
      </View>
    )
  }
}

class BrewingTabs extends React.Component {
  routes = [
    { key: 'heating', title: 'Разогрев' },
    { key: 'pauses', title: 'Паузы' },
    { key: 'brewing', title: 'Кипячение' },
    { key: 'cooling', title: 'Охлаждение' },
  ]
  components = {
    'heating': <Heating />,
    'pauses': <Pauses />,
    'brewing': <Brewing />,
    'cooling': <Cooling />,
  }
  render(){
    const active = 1
    // return <Text>Text</Text>
    return <Tabs data={{routes: this.routes, components: this.components, active}} />
  }
}

// разогрев
class Heating extends React.Component {
  parameters = {
    tempSet: '40',
    delay: '1000' // 1000c задержки
  }
  render() {
    return (
      <View>
        <NumberSlider name="Температура" onChange={this.props.onAction}/>
        <TimePicker name="Задержка" onChange={this.props.onAction} />
      </View>
    )
  }
}

// паузы
class Pauses extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false
    }
  }

  heater = {
    name: 'Паузы',
    icon: 'icon.png',
    enabled: true,
    programs: {
      1:{
        steps: {
          1: {
            time: '15',
            temp: '55'
          },
          2: {
            time: '15',
            temp: '55'
          },
          3: {
            time: '15',
            temp: '55'
          },
          4: {
            time: '15',
            temp: '55'
          },
          5: {
            time: '15',
            temp: '55'
          }
        }
      },
      2:{
        steps: {
          1: {
            time: '15',
            temp: '55'
          },
          2: {
            time: '15',
            temp: '55'
          },
          3: {
            time: '15',
            temp: '55'
          },
          4: {
            time: '15',
            temp: '55'
          },
          5: {
            time: '15',
            temp: '55'
          }
        }
      },
      3:{
        steps: {
          1: {
            time: '15',
            temp: '55'
          },
          2: {
            time: '15',
            temp: '55'
          },
          3: {
            time: '15',
            temp: '55'
          },
          4: {
            time: '15',
            temp: '55'
          },
          5: {
            time: '15',
            temp: '55'
          }
        }
      }
    },
    status: {
      value: 'ON',
      program: 1,
      step: 3,
      temperature: '30'
    },
    power: {
      label: 'Мощность',
      value: '100',
      measure: '%',
      enabled: true
    }
  
  }
  tableHead = ['Шаг', 'Температура', 'Время']
  programs = {
    list: ['Программа 1', 'Программа 2', 'Программа 3'],
    isNamesChangeable: false
  }

  render(){

    const steps = this.heater.programs[this.heater.status.program].steps

    // tableData = [
    //     ['1', '2', '3', '4'],
    //     ['a', 'b', 'c', 'd'],
    //     ['1', '2', '3', '456\n789'],
    //     ['a', 'b', 'c', 'd']
    // ]
    // паузы
    // 3 программы (dropdown?)
    // таблица со значениями
    // кнопка старта/остановки
    // отложенное включение?
    return(
      <View>
        <ModalDropdown defaultValue={'Программа ' + this.heater.status.program} options={this.programs.list} />
        <View>
          <Table>
            <Row data={this.tableHead}></Row>
            <TableWrapper>
            {
              Object.keys(steps).map((i)=>{
                return(
                  <Row key={i} data={[i, steps[i].temp, steps[i].time]} />
                )
              })
            }
            </TableWrapper>
          </Table>
        </View>
        <View>
          <TouchableOpacity onPress={()=>{this.setState({isModalVisible: true})}}>
            <Text>Начать</Text>
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.isModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}>
            <View style={{ 
              flex: 1, 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',}}>
              <Button
                title="Закрыть"
                onPress={() => this.setState({isModalVisible: false}) }
              />
              <TouchableOpacity 
                onPress={() => {
                  const { id, password } = this.state
                  console.log(id, password)
                  // отправляем запрос в облако
                  // реагируем на ответ 
                  // закрываем Modal
                } }
              >
                <Text>Добавить</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      </View>
    )
  }
}
// кипячение
class Brewing extends React.Component {
  render() {
    return (
      <View>
        <NumberSlider name="Температура" onChange={this.props.onAction}/>
        <NumberSlider name="Время" onChange={this.props.onAction}/>
        <MultipleNumberSlider name="Засыпь хмеля" onChange={this.props.onAction}/>
      </View>
    )
  }
}

// Охлаждение
class Cooling extends React.Component {
  render() {
    return (
      <View>
        <NumberSlider name="Температура" onChange={this.props.onAction}/>
      </View>
    )
  }
}

// перегон
export class Evaporation extends React.Component {
  render() {
    return (
      <View>
        
      </View>
    )
  }
}







export class ValvesManual extends React.Component {
  // ручное управление клапанами, насосом
  render() {
    const arr = [
      {
        name: 'Клапан 1',
        icon: 'icon.png',
        value: 'ON',
        enabled: false
      },
      {
        name: 'Клапан 2',
        icon: 'icon.png',
        value: 'OFF',
        enabled: true
      },
      {
        name: 'Насос',
        icon: 'pump.png',
        value: 'ON',
        enabled: true
      }
    ]
    return (
      <View>
        {
          arr.map((el, i)=>{
            return(
              <View key={i}>
                <ToggleSwitch name={el.name} value={(el.value === 'ON')} disabled={!el.enabled} onChange={this.props.onAction}></ToggleSwitch>
              </View>
            )
          })
        }
      </View>
    )
  }
}

export class Safety extends React.Component {
  // глобальные правила безопасности
  render() {
    return (
      <View>
        <HeaderMedium>Температура</HeaderMedium>
        <NumberWithPopup name={'Температура в котле'} value={100}></NumberWithPopup>
        <NumberWithPopup name={'Температура атмосферы РК'} value={100}></NumberWithPopup>
        <NumberWithPopup name={'Температура на выходе'} value={100}></NumberWithPopup>
        <NumberWithPopup name={'Температура подачи воды'} value={100}></NumberWithPopup>
        <NumberWithPopup name={'Температура в рубашке'} value={100}></NumberWithPopup>
        <HeaderMedium>Давление</HeaderMedium>
        <NumberWithPopup name={'Давление в котле'} value={100}></NumberWithPopup>
        <NumberWithPopup name={'Давление в рубашке'} value={100}></NumberWithPopup>
      </View>
    )
  }
}




export class Mixer extends React.Component {
  render(){
    return (
      <View>
        <MixerManual />
        <MixerAuto />
      </View>
    )
  }
}

export class MixerManual extends React.Component {
  render() {
    // вкл/откл мешалки (Switch)
    return (
    <View>
      <ToggleSwitch name="Ручное управление" onChange={this.props.onAction}/>
    </View>
    )
  }
}
export class MixerAuto extends React.Component {
  routes = [
    { key: 'timer', title: 'Таймер' },
    { key: 'periodic', title: 'Период' },
  ]
  components = {
    'timer': <MixerTimer />,
    'periodic': <MixerPeriodic />,
  }
  render() {
    // отложенное и периодическое включение
    const active = 0
    return (
      <View>
        <Tabs name="Автоматическое управление" data={{routes: this.routes, components: this.components, active}} />
      </View>
    )
  }
}


class MixerTimer extends React.Component {
  render(){
    return (
      <View>
        <TimePicker name="Задержка" onChange={this.props.onAction} />
      </View>
    )
  }
}

class MixerPeriodic extends React.Component {
  render(){
    return (
      <View>
        <NumberSlider name="Время включения" onChange={this.props.onAction}/>
        <NumberSlider name="Время отключения" onChange={this.props.onAction}/>
        <NumberSlider name="Период" onChange={this.props.onAction}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

