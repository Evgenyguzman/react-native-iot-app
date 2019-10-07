import { connect } from 'react-redux'
import { ManualControl, Sensors, Heating, Warming, HeaterAuto, Mixer, Evaporation, Safety } from '../components/views/main/cards'
import { changeValue, runMethod } from '../store/actions'


export const SensorsContainer = connect(
  (state, props) => {
    let {items} = state.panel
    items = items[props.id]
    
    let temperatures = []
    if(items['temperature1']) temperatures.push(items['temperature1'])
    if(items['temperature2']) temperatures.push(items['temperature2'])
    if(items['temperature3']) temperatures.push(items['temperature3'])
    if(items['temperature4']) temperatures.push(items['temperature4'])
    if(items['temperature5']) temperatures.push(items['temperature5'])
    if(items['temperature6']) temperatures.push(items['temperature6'])
    let pressures = []
    if(items['pressure1']) temperatures.push(items['pressure1'])
    if(items['pressure2']) temperatures.push(items['pressure2'])
    
    return({
      temperatures,
      pressures
    })
  },
  dispatch => ({
    async onAction() {
      // dispatch()
    }
  })
)(Sensors)

export const ManualControlContainer = connect(
  (state, props) => {
    let {items} = state.panel
    items = items[props.id]
    return({
      // heaterPower: 50,
      heaterPower: items['heater-power'],
      // heaterPower: state.panel.items[state.panel.info.deviceId]['heater-power'],
      coolerPower: items['cooler-power'],
      shellFilling: items['shell-filling'],
      distributeValve1: items['distribute-valve-1'],
      distributeValve2: items['distribute-valve-2'],
      distributeValve3: items['distribute-valve-3']
      // etc: etc
    })
  },
  (dispatch, props) => ({
    async onChangeValue(item, value) {
      dispatch(changeValue({thingId: item.thingId , itemId: item.id , value: value, systemId: props.id }))
    }
  })
)(ManualControl)

// export const WarmingContainer = connect(
//   (state, props) => {
//     let {items} = state.panel
//     items = items[props.id]
//     return({
//       bmState: items['bm-state'],
//       temperature: items['temperature'],
//       warmingTemperature: items['warming-temperature'],
//       warmingDelay: items['warming-delay'],
//       warmingStartTime: items['warming-start-time'], 
//     })
//   },
//   dispatch => ({
//     async onAction() {
//       // dispatch()
//     }
//   })
// )(Warming)

// export const BoilingContainer = connect(
//   (state, props) => {
//     let {items} = state.panel
//     items = items[props.id]
//     return({
      // bmState: items['bm-state'],
      // temperature: items['temperature'],
      // boilingTime: items['boiling-time'],
      // boilingTemperature: items['boiling-temperature'],
      // boilingStartTime: items['boiling-start-time'],
      // hopTime1: items['hop-time-1'],
      // hopTime2: items['hop-time-2'],
//     })
//   },
//   dispatch => ({
//     async onAction() {
//       // dispatch()
//     }
//   })
// )(Boiling)

// export const CoolingContainer = connect(
//   (state, props) => {
//     let {items} = state.panel
//     items = items[props.id]
//     return({
      // bmState: items['bm-state'],
      // temperature: items['temperature'],
      // coolingTemperature: items['cool-temperature'],
//     })
//   },
//   dispatch => ({
//     async onAction() {
//       // dispatch()
//     }
//   })
// )(Cooling)

export const HeaterAutoContainer = connect(
  (state, props) => {
    let {items, methods} = state.panel
    // console.log(methods)
    items = items[props.id]
    methods = methods[props.id]

    const programsIds = [1,2,3,4,5,6,7,8,9,10] 
    const stepsIds = [1,2,3,4,5,6,7,8] 

    const programs = programsIds.reduce((sum, id)=>{
      sum[id] = {
        stepsQty: items[`bm-p-${id}-steps`],
        name: items[`bm-p-${id}-name`],
        steps: stepsIds.map(sid=>{
          return {
            temp: items[`bm-p-${id}-s-${sid}-temp`],
            time: items[`bm-p-${id}-s-${sid}-time`],
            on: items[`bm-p-${id}-s-${sid}-on`],
            off: items[`bm-p-${id}-s-${sid}-off`],
          }
        })
      }
      return sum
    }, {})

    return({
      state: items['bm-state'],
      program: items['bm-program'],
      step: items['bm-step'],
      temperature: items['temperature'],
      warmingTemperature: items['warming-temperature'],
      warmingDelay: items['warming-delay'],
      warmingStartTime: items['warming-start-time'],
      boilingTime: items['boiling-time'],
      boilingTemperature: items['boiling-temperature'],
      boilingStartTime: items['boiling-start-time'],
      hopTime1: items['hop-time-1'],
      hopTime2: items['hop-time-2'],
      coolingTemperature: items['cool-temperature'],
      programs: programs,
      stop: methods['bm-stop'],
      warm: methods['warm'],
      brew: methods['brew'],
      boil: methods['boil'],
      cool: methods['cool']
    })
  },
  (dispatch, props) => ({
    async onChangeValue(item, value) {
      dispatch(changeValue({thingId: item.thingId , itemId: item.id , value: value, systemId: props.id }))
    },
    async onChangeValues(items, values) {
      items.forEach((item, i) => {
        dispatch(changeValue({thingId: item.thingId , itemId: item.id , value: values[i], systemId: props.id }))
      })
    },
    async onRunMethod(thingId, methodId, parameters) {
      dispatch(runMethod({thingId: thingId, methodId: methodId, parameters: parameters, systemId: props.id }))
    }
  })
)(HeaterAuto)

export const MixerContainer = connect(
  (state, props) => {
    let {items, methods} = state.panel
    items = items[props.id]
    methods = methods[props.id]
    return({
      state: items['mixer-state'],
      regime: items['mixer-regime'],
      offTime: items['mixer-off-time'],
      onTime: items['mixer-on-time'],
      startTime: items['mixer-start-time'],
      totalTime: items['mixer-total-time'],
      off: methods['off'],
      delayed: methods['delayed'],
      periodic: methods['periodic'],
    })
  },
  (dispatch, props) => ({
    async onChangeValue(item, value) {
      dispatch(changeValue({thingId: item.thingId, itemId: item.id, value: value, systemId: props.id }))
    },
    async onRunMethod(thingId, methodId, parameters) {
      dispatch(runMethod({thingId: thingId, methodId: methodId, parameters: parameters, systemId: props.id }))
    }
  })
)(Mixer)


export const SafetyContainer = connect(
  (state, props) => {
    let {items} = state.panel
    items = items[props.id]
    return({
      state: items['sm-state'],
      heaterMaxPower: items['heater-max-power'],
      boilerTemperatureLimit: items['boiler-temperature-limit'],
      atmTemperatureLimit: items['atm-temperature-limit'],
      outTemperatureLimit: items['out-temperature-limit'],
      waterSupplyTemperatureLimit: items['water-supply-temperature-limit'],
      shellTemperatureLimit: items['shell-temperature-limit'],
      boilerPressureLimit: items['boiler-pressure-limit'],
      shellPressureLimitMin: items['shell-pressure-limit-min'],
      shellPressureLimitMax: items['shell-pressure-limit-max'],
    })
  },
  (dispatch, props) => ({
    async onChangeValue(item, value) {
      dispatch(changeValue({thingId: item.thingId , itemId: item.id , value: value, systemId: props.id }))
    },
    async onChangeValues(items, values) {
      items.forEach((item, i) => {
        dispatch(changeValue({thingId: item.thingId , itemId: item.id , value: values[i], systemId: props.id }))
      })
    }
  })
)(Safety)

export const EvaporationContainer = connect(
  (state, props) => {
    let {items, methods} = state.panel
    items = items[props.id]
    methods = methods[props.id]

    const programsIds = [1,2,3,4,5,6,7,8,9,10] 
    const stepsIds = [1,2,3,4,5,6,7,8] 

    const programs = programsIds.reduce((sum, id)=>{
      sum[id] = {
        stepsQty: items[`pm-p-${id}-steps`],
        sensor: items[`pm-p-${id}-sensor`],
        name: items[`pm-p-${id}-name`],
        steps: stepsIds.map(sid=>{
          return {
            mode: items[`pm-p-${id}-s-${sid}-mode`],
            heater: items[`pm-p-${id}-s-${sid}-heater`],
            cooler: items[`pm-p-${id}-s-${sid}-cooler`],
            temp: items[`pm-p-${id}-s-${sid}-temp`],
            time: items[`pm-p-${id}-s-${sid}-time`],
            valve: items[`pm-p-${id}-s-${sid}-valve`],
          }
        })
      }
      return sum
    }, {})

    return({
      state: items['pm-state'],
      program: items['pm-program'],
      step: items['pm-step'],
      minHeaterPower: items['min-heater-power'],
      pickSwitches: items['pick-switches'],
      pickTempDelta: items['pick-temp-delta'],
      valveCloseDelay: items['valve-close-delay'],
      programs,
      start: methods['pm-start'],
      stop: methods['pm-stop'],
    })
  },
  (dispatch, props) => ({
    async onChangeValue(item, value) {
      dispatch(changeValue({thingId: item.thingId , itemId: item.id , value: value, systemId: props.id }))
    },
    async onChangeValues(items, values) {
      items.forEach((item, i) => {
        dispatch(changeValue({thingId: item.thingId , itemId: item.id , value: values[i], systemId: props.id }))
      })
    },
    async onRunMethod(thingId, methodId, parameters) {
      dispatch(runMethod({thingId: thingId, methodId: methodId, parameters: parameters, systemId: props.id }))
    }
  })
)(Evaporation)

// export const PID = connect(
//   (state, props) => {
//     let {items} = state.panel
//     items = items[props.id]
//     return({
//       pidP: items['pid-p'],
//       pidI: items['pid-i'],
//       pidD: items['pid-d'],
//       pidAutoSetTemperature: items['pid-auto-set-temperature'],
//     })
//   },
//   dispatch => ({
//     async onAction() {
//       // dispatch()
//     }
//   })
// )()


