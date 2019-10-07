import React from 'react';
import { View, Text, Button, Switch, Slider, Alert, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// import { ToggleSwitch, DiscreteSensor, NumberSlider, NumberWithPopup, Tabs } from '../../ui';
// import { LinearGradient } from 'expo-linear-gradient';

// import ModalDropdown from 'react-native-modal-dropdown';
// import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';
import { StatusBar, HeaterManual, HeaterAuto, MixerManual, Brewer, Evaporation, Safety, MixerAuto, Brewing, BrewingTabs, Mixer, SettingsPopup, Sensors } from './cards';
import { Card } from '../../ui';
import { ManualControlContainer, SensorsContainer, HeaterAutoContainer, SafetyContainer, MixerContainer, EvaporationContainer } from '../../../containers/uiContainers';

export class DpLitePlus extends React.Component {
  constructor(){
    super()

  }
  render() {

    // формируем необходимые группы данных
    const things = this.props.things
    // const temp = things[2].items[0].value

    // создаем statusBarItems в зависимости от состояния системы и другие группы
    const statusBarItems = []
    const heaterManualItems = []
    const heaterAutoItems = []
    const mixerManualItems = []
    const mixerAutoItems = []

    return (
      <View style={{
        flex: 1
      }}>
        {/* topbar */}
        <StatusBar items={statusBarItems} onAction={this.props.onAction}></StatusBar>
        <ScrollView style={{
          flex: 1,
          paddingBottom: 120,
          backgroundColor: '#f6f6f6'
        }}>
          {/* ручной нагрев */}
          <Card header={{title: 'Ручной нагрев'}}><HeaterManual items={heaterManualItems} onAction={this.props.onAction}></HeaterManual></Card>
          {/* автоматический нагрев */}
          <Card header={{title: 'Варка'}}><HeaterAuto items={heaterAutoItems} onAction={this.props.onAction}></HeaterAuto></Card>
          {/* мешалка */}
          <Card header={{title: 'Мешалка'}}><Mixer items={mixerManualItems} onAction={this.props.onAction}></Mixer></Card>
          <SettingsPopup />
        </ScrollView>
        
      </View>
    )
  }
}



export class DpPro extends React.Component {
  constructor(){
    super()

  }
  render() {

    const heaterAutoItems = []

    return (
      <View style={{
        flex: 1
      }}>
        <ScrollView style={{
          flex: 1,
          paddingBottom: 120,
          backgroundColor: 'f6f6f6'
        }}>
          {/* topbar */}
          {/* <StatusBar onAction={this.props.onAction}></StatusBar> */}
          <Card header={{title: 'Датчики'}} isActive={true}><SensorsContainer id={this.props.system.id} /></Card>
          {/* ручное управление клапанами, насосом */}
          <Card header={{title: 'Ручное управление'}}><ManualControlContainer id={this.props.system.id} onAction={this.props.onAction}></ManualControlContainer></Card>
          {/* варка */}
          <Card header={{title: 'Варка'}}><HeaterAutoContainer id={this.props.system.id} onAction={this.props.onAction}></HeaterAutoContainer></Card>
          {/* перегон */}
          <Card header={{title: 'Перегон'}}><EvaporationContainer id={this.props.system.id} onAction={this.props.onAction}></EvaporationContainer></Card>
          {/* Правила безопасности */}
          <Card header={{title: 'Безопасность'}}><SafetyContainer id={this.props.system.id} onAction={this.props.onAction}></SafetyContainer></Card>
          {/* автоматическая мешалка */}
          <Card header={{title: 'Мешалка'}}><MixerContainer id={this.props.system.id} onAction={this.props.onAction}></MixerContainer></Card>
          <SettingsPopup />
          <Card header={{title: 'Идет автонастройка'}} isActive={true} disabled={true}>
            <View>
              <Button title="Остановить" />
            </View>
          </Card>
        </ScrollView>
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