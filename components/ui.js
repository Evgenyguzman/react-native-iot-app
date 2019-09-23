import React from 'react'
import { Button, View, Text, Switch, Slider, Modal, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'

import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'

import DateTimePicker from "react-native-modal-datetime-picker";

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation:4,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "grey",
    shadowOpacity: 0.5,
    shadowRadius: 10
  },
  item: {
    padding: 5
  }
})

export const withTitle = ({title, component}) => {
  return (
    <View>
      <Text>{title}</Text>
      {component}
    </View>
  )
}

export class Card extends React.Component {
  state = {
    isActive: this.props.isActive || false
  }
  render(){
    const {isActive} = this.state
    return(
      <View style={styles.card}>
        <View 
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <HeaderLarge>{this.props.header.title}</HeaderLarge>
          <TouchableOpacity onPress={() => {this.setState({isActive: !isActive})}}>
            <FontAwesomeIcon 
              icon={faAngleDown}
              color="#fbc531" 
              size={32} 
              transform={{ rotate: isActive ? 180 : 0 }} />
          </TouchableOpacity>
        </View>
        {
          (isActive)
          ? 
            <View>{this.props.children}</View>
          :
            null
        }
      </View>
    )
  }
}

const headerStyles = StyleSheet.create({
  large: {
    marginBottom: 0,
    fontFamily: 'montserrat-bold',
    fontSize: 25,
    color: 'grey'
  },
  medium: {
    marginVertical: 10,
    fontFamily: 'montserrat-bold',
    fontSize: 20,
    color: 'grey'
  }
})
export class HeaderLarge extends React.Component {
  render(){
    return <Text style={headerStyles.large}>{this.props.children}</Text>
  }
}
export class HeaderMedium extends React.Component {
  render(){
    return <Text style={headerStyles.medium}>{this.props.children}</Text>
  }
}

export class ToggleSwitch extends React.Component {
  render() {
    const {name, value, disabled} = this.props
    return (
      <View style={styles.item}>
        <Text>{name}</Text>
        <Switch value={value} disabled={disabled} onValueChange={(value)=>{this.props.onChange(value)}}/>
      </View>
    )
  }
}

export class NumberSlider extends React.Component {

  state = {
    valueChanging: false,
    value: [5]
  }

  valuesChangeStart = () => {
    this.setState({
      valueChanging: true,
    })
  }

  valuesChange = values => {
    let newValues = [0];
    newValues[0] = values[0];
    this.setState({
      value: newValues,
    })
  }

  valuesChangeFinish = () => {
    this.setState({
      valueChanging: false,
    })
  }

  render() {
    const {name, value, min=0, max=100, step=1, disabled} = this.props
    return( 
      <View style={styles.item}>
        <Text>{name + ' ' + this.state.value}</Text>
        <MultiSlider
          values={this.state.value}
          sliderLength={250}
          step={step}
          min={min}
          max={max}
          onValuesChangeStart={this.valuesChangeStart}
          onValuesChange={this.valuesChange}
          onValuesChangeFinish={this.valuesChangeFinish}
        />
      </View>
    )
  }
}

export class MultipleNumberSlider extends React.Component {

  state = {
    values: [30, 70],
  }

  valuesChange = values => {
    this.setState({
      values: values,
    })
  }
  
  render() {
    const {name, value, min=0, max=100, step=1, disabled} = this.props
    return( 
      <View style={styles.item}>
        <Text>{name + ' ' + this.state.values[0] + '/' + this.state.values[1]}</Text>
        <MultiSlider
          values={[
            this.state.values[0],
            this.state.values[1],
          ]}
          sliderLength={250}
          onValuesChange={this.valuesChange}
          min={min}
          max={max}
          step={step}
          allowOverlap={false}
          snapped
        />
      </View>
    )
  }
}

export class NumberWithPopup extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value: this.props.value,
      modalVisible: false,
    }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
          style={{flex: 1}}
        >
          <Text>{this.props.name}</Text>
          <Text>{this.state.value}</Text>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{ 
            flex: 1, 
            flexDirection: 'column', 
            justifyContent: 'center',
            alignItems: 'center',}}>
            <View>
              <Text style={{textAlign: 'center'}}>{this.props.name}</Text>
              <Text style={{textAlign: 'center'}}>{this.state.value}</Text>
              <Slider style={{width: 200, height: 50}} value={this.state.value} step="1" minimumValue="0" maximumValue="100" onValueChange={(value)=>{this.setState({value})}}/>
              <TouchableOpacity
                // style={{ width: 200, height: 50}}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={{textAlign: 'center'}}>Подтвердить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

export class TimePicker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      value: new Date()
    }
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true })
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false })
  }

  handleDatePicked = date => {
    console.log("A date has been picked: ", date)
    this.setState({value: date})
    this.hideDateTimePicker();
  }

  render(){
    const {name} = this.props
    return (
      <View>
        <Text>{name}</Text>
        <Button title={"Выбрать время " + this.state.value} onPress={this.showDateTimePicker} />
        <DateTimePicker
          mode="datetime"
          date={this.state.value}
          minimumDate={new Date()}
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </View>
    )
  }
}

export class DiscreteSensor extends React.Component {
  render() {
    return <Switch value={this.props.value} disabled={true}/>;
  }
}

export class Tabs extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      index: props.data.active
    }
  }

  render() {
    return (
      <TabView
        style={{flex: 1}}
        navigationState={this.state}
        navigationState={{
          index: this.state.index,
          routes: this.props.data.routes
        }}
        renderTabBar = {(props) => {
          return(
            <TabBar
              {...props}
              scrollEnabled
              indicatorStyle={{backgroundColor: '#FAF9F7'}}
              style={{backgroundColor: '#804C2F', paddingTop: 20}}
            />
          )
        }}
        renderScene = {({ route }) => {
          return this.props.data.components[route.key]
        }}
        onIndexChange={index => this.setState({ index })}
        initialLayout={{ width: Dimensions.get('window').width, height: 200 }}
      />
    )

  }
}

// есть компоненты, которые передают изменения на облако, есть те, которые локальные -> делаем все локальные

// Клапан (без popup)
// Температура readonly (с tooltip)
// Температура задание (с popup)
// 

// Number - чтение
// NumberWithPopup - задание  
// Switch - чтение 
// Switch  - запись