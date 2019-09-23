import { connect } from 'react-redux'
// import { ThingsListWithRouter } from '../components/ui/things-list';

import C from '../store/constants'
import LoginScreen from '../screens/LoginScreen';
import DevicesScreen from '../screens/DevicesScreen';
import DeviceScreen from '../screens/DeviceScreen';
// import { Item } from '../components/ui/items';
// import { changeValue, runMethod } from '../redux/actions';
// import { Method } from '../components/ui/methods';
// import { ManagePanel } from '../components/ui/manage-panel';

export const LoginScreenContainer = connect( 
    state => ({
        store: state
    }),
    dispatch =>
    ({
        async onSignIn(message) {
          dispatch(message)  
        }
    })
)(LoginScreen)

export const DevicesScreenContainer = connect(
  state => ({
    store: state
  }),
  dispatch => ({
    async onQuit() {
      dispatch({
        type: C.QUIT
      })
    }
  })
)(DevicesScreen)

export const DeviceScreenContainer = connect(
  state => ({
    store: state
  }),
  dispatch => ({
    async onQuit() {
      dispatch({
        type: C.QUIT
      })
    }
  })
)(DeviceScreen)