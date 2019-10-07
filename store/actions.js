// import _ from 'lodash';
import C from './constants'
import HydraService from '../services/HydraService';
// import ProductsService from '../services/productsService';
// import redditService from '../../services/reddit';

import {
  Alert
} from 'react-native';

export function filter() {
  return async(dispatch, getState) => {
    try {
      // dispatch({ type: C.TOPICS_FETCHED, data: {} });
    } catch (error) {
      console.error(error);
    }
  };
}

export function register(user, password) {
  return async(dispatch, getState) => {
    try {
      const res = await HydraService.getInstance().register(user, password)
      return res
    } catch (error) {
      console.error(error);
    }
  }
}

export function getToken(user, password) {
  return async(dispatch, getState) => {
    try {
      const res = HydraService.getInstance().getToken(user, password)
      return res
    } catch (error) {
      console.error(error);
    }
  }
}

export function login(user, token) {
  return async(dispatch, getState) => {
    try {
      const res = await HydraService.getInstance().login(user, token)
      console.log(res)
      // dispatch({type: C.SIGN_IN, user: id, token: res})
      return res
    } catch (error) {
      console.error(error);
    }
  }
}


export function updateAllThings(things) {
  return async(dispatch, getState) => {
    try {
      dispatch({
        type: C.UPDATE_ALL_THINGS,
        things
      })
    } catch (error) {
      console.error(error);
    }
  };
}


export function changeValue({systemId, thingId, itemId, value}) {
  return async(dispatch, getState) => {
    try {
      HydraService.getInstance().changeValue(thingId, itemId, value, systemId)
      // dispatch({
      //   type: C.ITEM_CHANGE_VALUE,
      //   thingId,
      //   itemId,
      //   value,
      //   systemId
      // })
    } catch (error) {
      console.error(error)
    }
  };
}

export function runMethod({systemId, thingId, methodId, parameters}) {
  return async(dispatch, getState) => {
    try {
      HydraService.getInstance().runMethod(thingId, methodId, parameters, systemId)
      // dispatch({
      //   type: C.ITEM_CHANGE_VALUE,
      //   thingId,
      //   methodId,
      //   arguments
      // })
    } catch (error) {
      console.error(error)
    }
  }
}

export function addDevice(id) {
  return async(dispatch, getState) => {
    dispatch({
      type: C.ADD_SYSTEM,
      id,
    })
    // try {
    //   const hydra = HydraService.getInstance()
    //   if(hydra.isConnected()){
    //     // отправляем запрос в облако
    //     const res = await hydra.addDevice(id)
    //     console.log(res)
    //     if(res){
    //       Alert.alert('Устройство успешно добавлено')
    //       // обновить список devices
    //     }else{
    //       Alert.alert('Ошибка добавления')
    //     }
    //   }
    // } catch (error) {
    //   console.error(error)
    // }
  }
}

// только если устройство онлайн!
export function renameDevice(id, name) {
  return async(dispatch, getState) => {
    try {
      const hydra = HydraService.getInstance()
      if(hydra.isConnected()){
        const res = await hydra.renameDevice(id, name)
        console.log(res)
        if(res){
        }else{
          Alert.alert('Ошибка')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}

export function deleteDevice(id) {
  return async(dispatch, getState) => {
    try {
      const hydra = HydraService.getInstance()
      if(hydra.isConnected()){
        const res = await hydra.deleteDevice(id)
        console.log(res)
        if(res){
          Alert.alert('Устройство успешно удалено')
          dispatch({
            type: C.DELETE_SYSTEM,
            id,
          })
        }else{
          Alert.alert('Ошибка удаления')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
}

