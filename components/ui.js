import React from 'react'
import { Button, View, Text, TextInput, Switch, Slider, Modal, TouchableOpacity, Dimensions, StyleSheet } from 'react-native'
import { TabView, TabBar } from 'react-native-tab-view'

import MultiSlider from '@ptomasroos/react-native-multi-slider'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faAngleUp, faAngleDown, faPlus, faMinus, faCog, faCogs, faTimes } from '@fortawesome/free-solid-svg-icons'

import DateTimePicker from "react-native-modal-datetime-picker";

import RadioForm from 'react-native-simple-radio-button';

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
    const {disabled=false} = this.props
    return(
      <View style={styles.card}>
        <View 
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <HeaderLarge>{this.props.header.title}</HeaderLarge>
          {
            (!disabled)
            ?
              <TouchableOpacity 
                onPress={() => {this.setState({isActive: !isActive})}}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5
                }}
              >
                <FontAwesomeIcon 
                  icon={faAngleDown}
                  color="#fbc531" 
                  size={32} 
                  transform={{ rotate: isActive ? 180 : 0 }} 
                />
              </TouchableOpacity>
            :
              null
          }
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
  },
  small: {
    marginVertical: 5,
    fontFamily: 'montserrat',
    fontSize: 15,
    color: 'black'
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
export class HeaderSmall extends React.Component {
  render(){
    return <Text style={headerStyles.small}>{this.props.children}</Text>
  }
}

export class IconButton extends React.Component {
  render(){
    return(
      <TouchableOpacity 
        onPress={this.props.onPress}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 5
        }}
      >
        <FontAwesomeIcon 
          icon={this.props.icon}
          color="#fbc531" 
          size={32} 
        />
      </TouchableOpacity>
    )
  }
}

export class AnalogSensor extends React.Component {
  render(){
    const {item, measure} = this.props
    if(!item) return null
    const {name, value} = item
    return(
      <View>
        <Text>{name + ': ' + value + ' ' + measure}</Text>
      </View>
    )
  }
}

export class ToggleSwitch extends React.Component {
  constructor(props){
    super(props)
    const item = props.item
    if(!item) return
    this.state = {
      type: (item.value == 'on' || item.value == 'off') ? 'string' : 'integer' 
    }
    this.onValueChange = this.onValueChange.bind(this)
  }

  onValueChange(value){
    if(this.state.type === 'string') {
      value = (value) ? 'on' : 'off'
    }else{
      value = (value) ? '1' : '0'
    }
    this.props.onChange(value)
  }

  render() {
    const {item} = this.props
    if(!item) return null
    const {name, value, disabled} = item
    let formatValue = (this.state.type === 'string' ? (value == 'on') : (value == '1'))
    return (
      <View style={styles.item}>
        <Text>{name}</Text>
        <Switch value={formatValue} disabled={disabled} onValueChange={this.onValueChange}/>
      </View>
    )
  }
}

export class NumberSlider extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      valueChanging: false,
      value: (props.item) ? [parseInt(props.item.value)] : [0]
    }
    this.valuesChangeFinish = this.valuesChangeFinish.bind(this)
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
    this.props.onChange(this.state.value[0])
  }

  render() {
    const {item} = this.props
    if(!item) return null
    const {name, value, measure='', min=0, max=100, step=1, disabled} = item
    return( 
      <View style={styles.item}>
        <Text>{name + ' ' + this.state.value + ' ' + measure}</Text>
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

  constructor(props){
    super(props)
    this.state = {
      valueChanging: false,
      values: [30, 70],
    }
    this.valuesChangeFinish = this.valuesChangeFinish.bind(this)
  }

  valuesChange = values => {
    this.setState({
      values: values,
    })
  }

  valuesChangeFinish = () => {
    this.setState({
      valueChanging: false,
    })
    this.props.onChange(this.state.values)
  }
  
  render() {
    const {item} = this.props
    if(!item) return null
    const {name, value, min=0, max=100, step=1, disabled} = item
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
          onValuesChangeFinish={this.valuesChangeFinish}
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

export class MultipleItemsSlider extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      valueChanging: false,
      values: [parseFloat(props.items[0].value), parseFloat(props.items[1].value)],
    }
    this.valuesChangeFinish = this.valuesChangeFinish.bind(this)
  }

  valuesChange = values => {
    this.setState({
      values: values,
    })
  }

  valuesChangeFinish = () => {
    this.setState({
      valueChanging: false,
    })
    // console.log(this.state.values)
    this.props.onChange(this.state.values)
  }
  
  render() {
    const {items, name} = this.props
    if(!items) return null
    const {min=0, max=100, step=1} = items[0]
    return( 
      <View style={styles.item}>
        <Text>{name + ' ' + this.state.values[0] + '/' + this.state.values[1]}</Text>
        <MultiSlider
          values={this.state.values}
          sliderLength={250}
          onValuesChange={this.valuesChange}
          onValuesChangeFinish={this.valuesChangeFinish}
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
    // console.log(props.item)
    this.state = {
      value: (props.item) ? parseFloat(props.item.value) : 100,
      modalVisible: false,
    }
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    const {item} = this.props
    if(!item) return null
    const {name, value, min=0, max=100, step=1, disabled} = item
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() => {
            this.setModalVisible(true);
          }}
          style={{flex: 1}}
        >
          <Text>{name}</Text>
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
              <Text style={{textAlign: 'center'}}>{name}</Text>
              <Text style={{textAlign: 'center'}}>{this.state.value}</Text>
              <MultiSlider
                values={[this.state.value]}
                sliderLength={250}
                step={1}
                min={0}
                max={100}
                onValuesChangeStart={f=>f}
                onValuesChange={(value)=>{this.setState({value: value[0]})}}
                onValuesChangeFinish={f=>f}
              />
              <TouchableOpacity
                // style={{ width: 200, height: 50}}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                  this.props.onChange(this.state.value)
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
      // value: new Date()
    }
    this.handleDatePicked = this.handleDatePicked.bind(this)
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true })
  }

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false })
  }

  handleDatePicked = date => {
    console.log("A date has been picked: ", date)
    // this.setState({value: date})
    this.props.onChange(date)
    this.hideDateTimePicker()
  }

  render(){
    // const {item} = this.props
    // if(!item) return null
    // console.log("TimePicker:", item)
    // const {name} = item
    return (
      <View>
        {/* <Text>{this.props.name}</Text> */}
        <Button title={"Выбрать время " + this.props.value} onPress={this.showDateTimePicker} />
        <DateTimePicker
          mode="datetime"
          date={this.props.value}
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

export class EditText extends React.Component {
  render(){
    const {item} = this.props
    return(
      <TextInput
        placeholder = {item.name}
        style={{width: 300, height: 40, fontFamily: 'montserrat', paddingLeft: 20, marginTop: 5, marginBottom: 20}}
        editable = {true}
        maxLength = {40}
        onChangeText={(value) => {this.props.onChange(value)}}
        value={item.value}
        secureTextEntry={true}
      />
    )
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

export class ChooserWithRename extends React.Component {
  constructor(props){
    super(props)
    this.radio_props = Object.keys(props.items).map((key)=>{
      return {
        label: props.items[key].name.value,
        value: parseInt(key)
      }
    })
    this.state = {
      isActive: false,
      value: props.item.value
    }
    this.onAction = this.onAction.bind(this)
  }

  onAction(){
    this.setState({isActive: false})
    this.props.onChange(this.state.value)
  }
  
  render(){
    // console.log(this.props.item)
    return(
      <View>
        <View>
          <Text>{ this.props.label + ": " + this.props.items[this.state.value].name.value}</Text>
          <TouchableOpacity onPress={() => {this.setState({isActive: true})}}><Text>Выбрать</Text></TouchableOpacity>
          <SimpleModal 
            isActive={this.state.isActive} 
            title="Выбор рецепта" 
            actionTitle="Выбрать" 
            onAction={this.onAction} 
            onClose={()=>{this.setState({isActive: false})}}>
            {/* radio */}
            <RadioForm
              radio_props={this.radio_props}
              initial={parseInt(this.state.value) - 1}
              onPress={(value) => {this.setState({value:value})}}
            />
          </SimpleModal>
        </View>
      </View>
    )
  }
}

export class StepsTable extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isSettingsActive: false
    }
  }
  render(){
    const {activeStep, steps, stepsQty, parametersIds, settings} = this.props
    return (
      <View>
        {
          (steps.map((step, i)=>{
            if(stepsQty.value > i){
              return(
                <StepEditor key={i} disable={activeStep > (i+1)} index={i+1} step={step} parametersIds={parametersIds} onChange={this.props.onChangeStep} onChooseStep={()=>{this.props.onChooseStep(i+1)}} />
              )
            }else{
              return null
            }
          }
          ))
        }
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <IconButton icon={faPlus} onPress={()=>{this.props.onChangeItem(stepsQty, parseInt(stepsQty.value) + 1)}} />
            <IconButton icon={faMinus} onPress={()=>{this.props.onChangeItem(stepsQty, parseInt(stepsQty.value) - 1)}} />
          </View>
          {
            (settings)
            ?
              <View>
                <IconButton icon={faCogs} onPress={()=>{this.setState({isSettingsActive: true})}} />
                <SimpleModal 
                  isActive={this.state.isSettingsActive} 
                  title="Настройки" 
                  actionTitle="Сохранить" 
                  onAction={()=>{this.setState({isSettingsActive: false}); this.props.onSaveSettings()}} 
                  onClose={()=>{this.setState({isSettingsActive: false})}}
                >
                  {settings}  
                </SimpleModal>
              </View>
            :
              null
          }
        </View>
        
      </View>
    )
  }
}

export class StepEditor extends React.Component {
  constructor(props){
    super(props)
    const values = props.parametersIds.reduce((sum, id) => {
      sum[id] = props.step[id].value
      return sum
    }, {})
    this.state = {
      isActive: false,
      ...values
    }
  }
  render(){
    const {index, step, parametersIds, disable} = this.props
    const items = parametersIds.map(id=>{
      return step[id]
    })
    return(
      <View style={(!disable)?{backgroundColor: 'grey'} : {}}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity onPress={this.props.onChooseStep}>
            <Text>{index}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}} onPress={() => {this.setState({isActive: true})}}>
            {
              parametersIds.map(id=>
                <Text key={id} >{step[id].value}</Text>
              )
            }
          </TouchableOpacity>
        </View>
        <SimpleModal 
          isActive={this.state.isActive} 
          title={"Этап" + index} 
          actionTitle="Сохранить" 
          onAction={()=>{
            this.setState({isActive: false}); 
            const values = parametersIds.map(id=>this.state[id]) 
            console.log('End values: ', values)
            this.props.onChange(items, values)
          }} 
          onClose={()=>{this.setState({isActive: false})}}>

          {
            parametersIds.map(id=>
              <NumberSlider key={id} item={step[id]} onChange={(value)=>this.setState({[id]: value})}/>
            )
          }
          
        </SimpleModal>
      </View>
    )
  }
}

export class SimpleModal extends React.Component {
  render(){
    return(
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.isActive}
        onRequestClose={this.props.onClose}>

        {/* topbar */}
        <View>
          <Text style={{textAlign: 'center'}}>{this.props.title}</Text>
          <TouchableOpacity onPress={this.props.onClose}>
            <Text style={{textAlign: 'center'}}>Закрыть</Text>
          </TouchableOpacity>
        </View>

        {/* main content with action btn */}
        <View style={{ 
          flex: 1, 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {this.props.children}
        </View>
        <View>
          <Button title={this.props.actionTitle} onPress={this.props.onAction} />
        </View>
      </Modal>
    )
  }
}

export class ButtonWithConfirm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      isActive: false
    }
  }
  render(){
    return(
      <View>
        <Button title={this.props.title} onPress={()=>{this.setState({isActive: true})}} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isActive}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
        >
          <View>
            <Text style={{textAlign: 'center'}}>{this.props.title}</Text>
            <IconButton icon={faTimes} onPress={()=>this.setState({isActive: false})} />
          </View>
          <View>
            <Button title={this.props.actionTitle} onPress={()=>{this.props.onAction(); this.setState({isActive: false})}} />
          </View>
        </Modal>
      </View>
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

