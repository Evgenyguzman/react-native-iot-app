import React from 'react';
import { View, Text, Button, Switch, Slider, Alert, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
// import { ToggleSwitch, DiscreteSensor, NumberSlider, NumberWithPopup, Tabs } from '../../ui';
// import { LinearGradient } from 'expo-linear-gradient';

// import ModalDropdown from 'react-native-modal-dropdown';
// import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';
import { StatusBar, HeaterManual, HeaterAuto, MixerManual, Brewer, Evaporation, ValvesManual, Safety, MixerAuto, Brewing, BrewingTabs, Mixer } from './cards';
import { Card } from '../../ui';

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
          <StatusBar onAction={this.props.onAction}></StatusBar>
          {/* ручной нагрев */}
          <Card header={{title: 'Ручной нагрев'}}><HeaterManual onAction={this.props.onAction}></HeaterManual></Card>
          {/* варка */}
          <Card header={{title: 'Варка'}}><HeaterAuto items={heaterAutoItems} onAction={this.props.onAction}></HeaterAuto></Card>
          {/* перегон */}
          <Card header={{title: 'Перегон'}}><Evaporation onAction={this.props.onAction}></Evaporation></Card>
          {/* ручное управление клапанами, насосом */}
          <Card header={{title: 'Ручное управление'}}><ValvesManual onAction={this.props.onAction}></ValvesManual></Card>
          {/* Правила безопасности */}
          <Card header={{title: 'Безопасность'}}><Safety onAction={this.props.onAction}></Safety></Card>
          {/* автоматическая мешалка */}
          <Card header={{title: 'Мешалка'}}><Mixer onAction={this.props.onAction}></Mixer></Card>
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