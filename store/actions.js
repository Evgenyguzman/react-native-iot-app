// import _ from 'lodash';
import C from './constants'
import HydraService from '../services/HydraService';
// import ProductsService from '../services/productsService';
// import redditService from '../../services/reddit';

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
      const res = HydraService.getInstance().login(user, token)
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


export function changeValue({thingId, itemId, value}) {
  return async(dispatch, getState) => {
    try {
      HydraService.getInstance().changeValue(thingId, itemId, value)
      dispatch({
        type: C.ITEM_CHANGE_VALUE,
        thingId,
        itemId,
        value
      })
    } catch (error) {
      console.error(error);
    }
  };
}

export function runMethod({thingId, methodId, parameters}) {
  return async(dispatch, getState) => {
    try {
      HydraService.getInstance().runMethod(thingId, methodId, parameters)
      // dispatch({
      //   type: C.ITEM_CHANGE_VALUE,
      //   thingId,
      //   methodId,
      //   arguments
      // })
    } catch (error) {
      console.error(error);
    }
  };
}
