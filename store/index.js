import { createStore,
    applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { AsyncStorage } from 'react-native';
// import { createLogger } from 'redux-logger'
import mainReducer from './reducers'
import storeData from './initialState'

// import ProductsService from '../services/productsService'

const logger = store => next => action => {
    let result
    // console.groupCollapsed("dispatching", action.type)
    // console.log('prev state', store.getState())
    // console.log('action', action)
    result = next(action)
    // console.log('next state', store.getState())
    // console.groupEnd()
    return result
}

const saver = store => next => action => {
    let result = next(action)
    let storingValue = JSON.stringify(store.getState())
    AsyncStorage.setItem('completeStore', storingValue);
    // if(action.type === "SIGN_IN" || action.type === "ADD_TOKEN" || action.type === "QUIT" ){
    //     console.log(action)
    //     localStorage['redux-store'] = JSON.stringify(store.getState()) 
    // }
    return result
}


// const loadData = () => {
//     const tables = ["categories", "productPages", "products", "modes", "filters", "parameters"]
//     var data = {}
//     tables.forEach((table) => {
//         ProductsService.getItems(table)
//             .then(json =>
//                 // console.log(json)
//                 data[table] = json
//             )
//     })
//     return data
// }

// const storeFactory = (initialState=storeData) => {
//     return applyMiddleware(logger, saver)(createStore)(
//         combineReducers({colors, sort, active_url, categories, productPages, products, modes, filters, parameters, active_filters, active_filters2, active_data, catalog, product, user}),
//         // (localStorage['redux-store']) ?
//         //     JSON.parse(localStorage['redux-store']) :
//         //     storeData 
//         storeData
//     )
// }
// export default storeFactory


// const loggerMiddleware = createLogger()
 
const storeFactory = (completeStore, initialState=storeData) => {
    // AsyncStorage.clear();
    if (completeStore !== null) {
        initialState = JSON.parse(completeStore) 
    }
    // console.log(initialState)
    return applyMiddleware(thunkMiddleware, saver, logger)(createStore)(
        mainReducer,
        initialState
    )
    // let store = await AsyncStorage.getItem('completeStore').then((value)=>{
    //     if(value){
    //         initialState = JSON.parse(value) 
    //     }
    //     console.log(initialState)
    //     return applyMiddleware(thunkMiddleware, saver)(createStore)(
    //         mainReducer,
    //         initialState
    //     )
    //   }).catch((error)=>{
    //     console.log(error)
    //     // не должно быть такого
    //   })

    // return applyMiddleware(thunkMiddleware, saver)(createStore)(
    //     mainReducer,
    //     // (localStorage['redux-store']) ? JSON.parse(localStorage['redux-store']) : storeData
    //     storeData
    // )
    
} 

export default storeFactory