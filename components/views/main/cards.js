import React from 'react';
import { View, Text, Button, Switch, Slider, Alert, ScrollView, StyleSheet, TouchableOpacity, Modal, Picker } from 'react-native';
import { ToggleSwitch, DiscreteSensor, NumberSlider, NumberWithPopup, Tabs, withTitle, MultipleNumberSlider, HeaderMedium, TimePicker, HeaderLarge, MultipleItemsSlider, AnalogSensor, HeaderSmall, ChooserWithRename, StepsTable, ButtonWithConfirm } from '../../ui';
import { LinearGradient } from 'expo-linear-gradient';

import ModalDropdown from 'react-native-modal-dropdown';
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCog, faTimes } from '@fortawesome/free-solid-svg-icons'

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


export class Sensors extends React.Component {
  
  render(){
    // const { temperature1, temperature2, temperature3, temperature4, temperature5, temperature6, pressure1, pressure2 } = this.props
    const { temperatures, pressures } = this.props
    return (
      <View>
        <HeaderMedium>Температура</HeaderMedium>
        {
          temperatures.map((item) => 
            <AnalogSensor key={item.id} item={item} measure='˚C' />
          )
        }
        {(temperatures.length === 0) ? <HeaderSmall>Датчики отсутствуют</HeaderSmall> : null}
        <HeaderMedium>Давление</HeaderMedium>
        {
          pressures.map((item) => 
            <AnalogSensor key={item.id} item={item} measure='бар' />
          )
        }
        {(pressures.length === 0) ? <HeaderSmall>Датчики отсутствуют</HeaderSmall> : null}
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
    const {state, onRunMethod, stop} = this.props
    if(state.value != 0){
      return <ButtonWithConfirm 
        title="Остановить" 
        actionTitle="Остановить"
        onAction={()=>{onRunMethod(stop.thingId, stop.id, {})}}
      />
    }
    return (
      <View>
        <BrewingTabs {...this.props} />
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
  render(){
    const active = 1
    const components = {
      'heating': <Warming {...this.props} />,
      'pauses': <Brewing {...this.props} />,
      'brewing': <Boiling {...this.props} />,
      'cooling': <Cooling {...this.props} />,
    }
    // return <Text>Text</Text>
    return <Tabs data={{routes: this.routes, components: components, active}} />
  }
}

// разогрев
export class Warming extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      delay: new Date(),
    }
    this.onStart = this.onStart.bind(this)
  }

  onStart(){
    const {onRunMethod, warm} = this.props
    const date = this.state.delay
    const now = new Date()
    console.log(date, now)
    const delay = date - now
    onRunMethod(warm.thingId, warm.id, {delay: delay.toString()})
  }

  render() {
    const {state, temperature, warmingTemperature, warmingDelay, warmingStartTime, onChangeValue, onRunMethod, warm, stop} = this.props
    return (
      <View>
        <NumberSlider item={warmingTemperature} onChange={(value)=>onChangeValue(warmingTemperature, value)} />
        <TimePicker name="Задержка" value={this.state.delay} onChange={(value)=>this.setState({delay: value})} />
        <ButtonWithConfirm 
          title="Начать" 
          actionTitle="Начать"
          onAction={()=>{this.onStart()}}
        />
      </View>
    )
  }
}

// паузы
export class Brewing extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isModalVisible: false
    }
  }

  render(){

    const { state, program, step, programs, onChangeValue, onChangeValues, onRunMethod, brew, stop } = this.props
    // const steps = this.heater.programs[this.heater.status.program].steps

    return(
      <View>
        <ChooserWithRename label="Рецепт" item={program} items={programs} onChange={(value)=>onChangeValue(program, value)} />
        <StepsTable 
          stepsQty={programs[program.value].stepsQty} 
          steps={programs[program.value].steps} 
          activeStep={step.value} 
          parametersIds={['temp', 'time', 'on', 'off']} 
          onChangeStep={(items, values)=>{onChangeValues(items, values)}}
          onChooseStep={(value)=>{onChangeValue(step, value)}}
          onChangeItem={(item, value)=>{onChangeValue(item, value)}}
        />

        <ButtonWithConfirm 
          title="Начать" 
          actionTitle="Начать"
          onAction={()=>{onRunMethod(brew.thingId, brew.id, {})}}
        />

      </View>
    )
  }
}
// кипячение
export class Boiling extends React.Component {
  render() {
    const {state, temperature, boilingTime, boilingTemperature, boilingStartTime, hopTime1, hopTime2, onChangeValue, onChangeValues, onRunMethod, boil, stop} = this.props
    return (
      <View>
        <NumberSlider item={boilingTemperature} onChange={(value)=>onChangeValue(boilingTemperature, value)} />
        <NumberSlider item={boilingTime} onChange={(value)=>onChangeValue(boilingTime, value)} />
        <MultipleItemsSlider name="Засыпь хмеля" items={[hopTime1, hopTime2]} onChange={(values)=>onChangeValues([hopTime1, hopTime2], values)} />
        <ButtonWithConfirm 
          title="Начать" 
          actionTitle="Начать"
          onAction={()=>{onRunMethod(boil.thingId, boil.id, {})}}
        />
      </View>
    )
  }
}

// Охлаждение
export class Cooling extends React.Component {
  render() {
    const {state, temperature, coolingTemperature, onChangeValue, onRunMethod, cool, stop} = this.props
    // console.log(stop)
    return (
      <View>
        <NumberSlider item={coolingTemperature} onChange={(value)=>onChangeValue(coolingTemperature, value)} />
        <ButtonWithConfirm 
          title="Начать" 
          actionTitle="Начать"
          onAction={()=>{onRunMethod(cool.thingId, cool.id, {})}}
        />
      </View>
    )
  }
}

// перегон
export class Evaporation extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      minHeaterPower: props.minHeaterPower.value,
      pickSwitches: props.pickSwitches.value,
      pickTempDelta: props.pickTempDelta.value,
      valveCloseDelay: props.valveCloseDelay.value
    }
  }
  render() {
    const { state, program, step, programs, minHeaterPower, pickSwitches, pickTempDelta, valveCloseDelay, onChangeValue, onChangeValues, onRunMethod, start, stop } = this.props
    // console.log("Evaporation state: ", state)

    // локальные изменения
    const settings = <View>
      <NumberSlider item={minHeaterPower} onChange={(value)=>this.setState({minHeaterPower: value})} />
      <NumberSlider item={pickSwitches} onChange={(value)=>this.setState({pickSwitches: value})} />
      <NumberSlider item={pickTempDelta} onChange={(value)=>this.setState({pickTempDelta: value})} />
      <NumberSlider item={valveCloseDelay} onChange={(value)=>this.setState({valveCloseDelay: value})} />
    </View>

    if(state.value == 1){
      return <ButtonWithConfirm 
        title="Остановить" 
        actionTitle="Остановить"
        onAction={()=>{onRunMethod(stop.thingId, stop.id, {})}}
      />
    }


    return (
      <View>
        <ChooserWithRename label="Рецепт" item={program} items={programs} onChange={(value)=>onChangeValue(program, value)} />
        {/* выбор датчика */}
        <ChooserWithRename 
          label="Датчик" 
          item={programs[program.value].sensor} 
          items={{1:{name: {value:'Дист'}}, 2:{name: {value:'Рект'}}}} 
          onChange={(value)=>onChangeValue(programs[program.value].sensor, value)} 
        /> 
        
        <StepsTable 
          stepsQty={programs[program.value].stepsQty} 
          steps={programs[program.value].steps}
          activeStep={step.value} 
          parametersIds={['mode', 'heater', 'cooler', 'temp', 'time', 'valve']} 
          settings={settings}
          onSaveSettings={()=>{onChangeValues([minHeaterPower, pickSwitches, pickTempDelta, valveCloseDelay], [this.state.minHeaterPower, this.state.pickSwitches, this.state.pickTempDelta, this.state.valveCloseDelay])}}
          onChangeStep={(items, values)=>{onChangeValues(items, values)}}
          onChooseStep={(value)=>{onChangeValue(step, value)}}
          onChangeItem={(item, value)=>{onChangeValue(item, value)}}
        />

        <ButtonWithConfirm 
          title="Начать" 
          actionTitle="Начать"
          onAction={()=>{onRunMethod(start.thingId, start.id, {})}}
        />
        
      </View>
    )
  }
}

// export class EvaporationSettings extends React.Component {
//   constructor(props){
//     super(props)
//     this.state = {
//       minHeaterPower: props.minHeaterPower.value,
//       pickSwitches: props.pickSwitches.value,
//       pickTempDelta: props.pickTempDelta.value,
//       valveCloseDelay: props.valveCloseDelay.value
//     }
//   }
//   render(){
//     // modal must be here !?
//     return(
//       <View>
//         <NumberSlider item={minHeaterPower} onChange={(value)=>this.setState({minHeaterPower: value})} />
//         <NumberSlider item={pickSwitches} onChange={(value)=>this.setState({pickSwitches: value})} />
//         <NumberSlider item={pickTempDelta} onChange={(value)=>this.setState({pickTempDelta: value})} />
//         <NumberSlider item={valveCloseDelay} onChange={(value)=>this.setState({valveCloseDelay: value})} />
//       </View>
//     )
//   }
// }

// export class ItemsGroup extends React.Component {
//   render(){
//     return(
//       <View>

//       </View>
//     )
//   }
// }





export class ManualControl extends React.Component {
  render() {
    // console.log(this.props)
    const {heaterPower, coolerPower, shellFilling, distributeValve1, distributeValve2, distributeValve3, onChangeValue} = this.props
    return (
      <View>
        <View>
          <NumberSlider item={heaterPower} onChange={(value)=>onChangeValue(heaterPower, value)}/>
          <NumberSlider item={coolerPower} onChange={(value)=>onChangeValue(coolerPower, value)}/>
          <ToggleSwitch item={shellFilling} onChange={(value)=>onChangeValue(shellFilling, value)}/>
        </View>
        <View>
          <HeaderMedium>Распределительные клапаны</HeaderMedium>
          <View>
            <ToggleSwitch item={distributeValve1} onChange={(value)=>onChangeValue(distributeValve1, value)}></ToggleSwitch>
            <ToggleSwitch item={distributeValve2} onChange={(value)=>onChangeValue(distributeValve2, value)}></ToggleSwitch>
            <ToggleSwitch item={distributeValve3} onChange={(value)=>onChangeValue(distributeValve3, value)}></ToggleSwitch>
          </View>
        </View>
      </View>
    )
  }
}

export class Safety extends React.Component {
  // глобальные правила безопасности
  render() {
    const {state, heaterMaxPower, boilerTemperatureLimit, atmTemperatureLimit, outTemperatureLimit, waterSupplyTemperatureLimit, shellTemperatureLimit, boilerPressureLimit, shellPressureLimitMin, shellPressureLimitMax, onChangeValue, onChangeValues} = this.props
    
    return (
      <View>
        <HeaderMedium>Нагреватель</HeaderMedium>
        <NumberWithPopup item={heaterMaxPower} name={'Максимальная мощность'} value={100} onChange={(value)=>onChangeValue(heaterMaxPower, value)}></NumberWithPopup>
        <HeaderMedium>Температура</HeaderMedium>
        <NumberWithPopup item={boilerTemperatureLimit} name={'В котле'} value={100} onChange={(value)=>onChangeValue(boilerTemperatureLimit, value)}></NumberWithPopup>
        <NumberWithPopup item={atmTemperatureLimit} name={'ТСА'} value={100} onChange={(value)=>onChangeValue(atmTemperatureLimit, value)}></NumberWithPopup>
        <NumberWithPopup item={outTemperatureLimit} name={'Продукт на выходе'} value={100} onChange={(value)=>onChangeValue(outTemperatureLimit, value)}></NumberWithPopup>
        <NumberWithPopup item={waterSupplyTemperatureLimit} name={'Подача воды'} value={100} onChange={(value)=>onChangeValue(waterSupplyTemperatureLimit, value)}></NumberWithPopup>
        <NumberWithPopup item={shellTemperatureLimit} name={'В рубашке'} value={100} onChange={(value)=>onChangeValue(shellTemperatureLimit, value)}></NumberWithPopup>
        <HeaderMedium>Давление</HeaderMedium>
        <NumberWithPopup item={boilerPressureLimit} name={'В котле'} value={100} onChange={(value)=>onChangeValue(boilerPressureLimit, value)}></NumberWithPopup>
        <MultipleItemsSlider name="В рубашке" items={[shellPressureLimitMin, shellPressureLimitMax]} onChange={(values)=>onChangeValues([shellPressureLimitMin, shellPressureLimitMax], values)}/>
      </View>
    )
  }
}




export class Mixer extends React.Component {
  render(){
    return (
      <View>
        <MixerManual {...this.props} />
        <MixerAuto {...this.props} />
      </View>
    )
  }
}

export class MixerManual extends React.Component {
  render() {
    // вкл/откл мешалки (Switch)
    const {state, regime, onChangeValue} = this.props
    return (
    <View>
      <ToggleSwitch item={state} name="Ручное управление" onChange={(value)=>onChangeValue(state, value)}/>
    </View>
    )
  }
}
export class MixerAuto extends React.Component {
  routes = [
    { key: 'timer', title: 'Таймер' },
    { key: 'periodic', title: 'Период' },
  ]
  render() {
    // отложенное и периодическое включение
    const active = 0
    const components = {
      'timer': <MixerTimer {...this.props} />,
      'periodic': <MixerPeriodic {...this.props} />,
    }
    return (
      <View>
        <Tabs name="Автоматическое управление" data={{routes: this.routes, components: components, active}} />
      </View>
    )
  }
}


class MixerTimer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      delay: new Date(),
    }
    this.onStart = this.onStart.bind(this)
  }

  onStart(){
    const {onRunMethod, delayed} = this.props
    // преобразовываем время в задержку
    const date = this.state.delay
    const now = new Date()
    let delay = date - now
    delay = delay / 1000
    delay = Math.round(delay)
    onRunMethod(delayed.thingId, delayed.id, {delay: delay.toString()})
  }

  render(){
    const {startTime, regime, onRunMethod, delayed, off} = this.props
    if(regime.value == 0){
      return (
        <View>
          <TimePicker name="Задержка" value={this.state.delay} onChange={(value)=>this.setState({delay: value})} />
          {/* delay param */}
          <ButtonWithConfirm 
            title="Начать" 
            actionTitle="Начать"
            onAction={()=>{this.onStart()}}
          />
        </View>
      )
    }else if(regime.value == 1){
      return (
        <View>
          {/* Инфо о процессе */}
          <ButtonWithConfirm 
            title="Остановить" 
            actionTitle="Остановить"
            onAction={()=>{onRunMethod(off.thingId, off.id, {})}}
          />
        </View>
      )
    }else{
      return null
    }
  }
}

class MixerPeriodic extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      on: props.onTime.value,
      off: props.offTime.value,
      days: props.totalTime.value
    }
  }
  render(){
    // console.log(this.props)
    const {offTime, onTime, totalTime, regime, onChangeValue, onRunMethod, periodic, off} = this.props
    if(regime.value == 0){
      return (
        <View>
          <NumberSlider item={onTime} name="Время включения" measure="мин" onChange={(value)=>this.setState({on: value.toString()})}/>
          <NumberSlider item={offTime} name="Время отключения" measure="мин" onChange={(value)=>this.setState({off: value.toString()})}/>
          <NumberSlider item={totalTime} name="Период" measure="дн" onChange={(value)=>this.setState({days: value.toString()})}/>
          {/* params */}
          <ButtonWithConfirm 
            title="Начать" 
            actionTitle="Начать"
            onAction={()=>{onRunMethod(periodic.thingId, periodic.id, this.state)}}
          />
        </View>
      )
    }else if(regime.value == 2){
      return (
        <View>
          {/* Инфо о процессе */}
          <ButtonWithConfirm 
            title="Остановить" 
            actionTitle="Остановить"
            onAction={()=>{onRunMethod(off.thingId, off.id, {})}}
          />
        </View>
      )
    }else{
      return null
    }
  }
}

export class SettingsPopup extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      modalVisible: false,
    }

    // получаем данные, изменяем по подтверждению

  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }
  render(){
    return(
      <View style={styles.item}>
        <View
          style={{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}
        >
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true);
            }}
            style={{padding: 20}}
          >
            <FontAwesomeIcon 
              icon={faCog}
              color="#fbc531" 
              size={32}
            />
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {this.setModalVisible(!this.state.modalVisible)}}>
          <View style={{ 
            padding: 25,
            flex: 1, 
            flexDirection: 'column', 
            alignItems: 'stretch',
            justifyContent: 'flex-start'
          }}>
            <View style={{ 
              height: 'auto',
              flex: 1, 
              flexDirection: 'row', 
              justifyContent: 'flex-end',
              alignItems: 'flex-end'
            }}>
              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
                }}>
                <FontAwesomeIcon 
                  icon={faTimes}
                  color="#fbc531" 
                  size={32}
                />
              </TouchableOpacity>
            </View>
            <View>
              <HeaderLarge>Настройки ПИД-регулятора</HeaderLarge>
              <HeaderMedium>Коэффициенты</HeaderMedium>
              {/* меняем по нажатию сохранить */}
              <NumberSlider name="Пропорциональный" onChange={this.props.onAction}/>
              <NumberSlider name="Интегральный" onChange={this.props.onAction}/>
              <NumberSlider name="Дифференцируемый" onChange={this.props.onAction}/>
              <Button title="Сохранить" />
              <HeaderMedium>Автонастройка</HeaderMedium>
              {/* меняем сразу */}
              <NumberSlider name="Уставка" measure="˚C" onChange={this.props.onAction}/>
              <Button title="Начать автонастройку" />
            </View>
          </View>
        </Modal>
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

