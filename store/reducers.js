import C from './constants'
import { combineReducers } from 'redux'

const devices = (state = {}, action) => {
    let new_state = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        // case C.UPDATE_ALL_THINGS:
        //     new_state = action.things
        //     return new_state
        case C.UPDATE_SYSTEMS:
            const systems = action.systems
            // console.log(systems)
             
            new_state = systems.map((system)=>{
                return {
                    id: system['system-id'],
                    name: system['system-name'],
                    // online: system['system-online'],
                    online: true,
                    type: 'dp-pro'
                }
            })
            // console.log(new_state)
            return new_state
        case C.UPDATE_SYSTEM:
            const {id, status, systemType, systemModel} = action
            console.log('Action', action)
            
            new_state = new_state.map((system)=>{
                if(system.id === id){
                    if(status !== undefined){
                        system.online = status
                    }
                    if(systemType !== undefined){
                        // system.type = systemType + '-' + systemModel
                        system.type = 'dp-lite-plus'
                    }
                }
                return system
            })
            // console.log(new_state)
            return new_state
            
        default:
            return state
    }
}


const things = (state = {}, action) => {
    let new_state = JSON.parse(JSON.stringify(state))
    switch (action.type) {
        case C.UPDATE_THINGS:
            // let new_state = JSON.parse(JSON.stringify(state))
            new_state[action.id] = action.things
            // console.log(new_state)
            // console.log(new_state[action.id])
            return new_state
        // case C.QUIT:
        //     return []
        case C.THING_OFFLINE:
            {
                new_state.forEach((thing, i) => {
                    if(thing.id === action.thingId){
                        new_state[i].online = false
                    }
                })
                return new_state
            }
        case C.THING_ONLINE:
            {
                // console.log(action)
                let flag = false
                new_state.forEach((thing, i) => {
                    if(thing.id === action.thing.id){
                        new_state[i] = action.thing
                        new_state[i].online = true
                        flag = true
                    }
                })
                if(!flag){
                    let {thing} = action
                    thing.online = true
                    new_state.push(thing)
                }

                return new_state
            }
        case C.ITEM_CHANGE_STATE:
            {
                if( !new_state || !new_state[action.systemId] ) { 
                    return new_state 
                }
                new_state[action.systemId].forEach((thing, i) => {
                    if(thing.id === action.thingId){
                        thing.items.forEach((item, k) => {
                            if(item.id === action.itemId){
                                new_state[action.systemId][i].items[k].state = action.state
                            }
                        })
                    }
                })
                return new_state
            }
        case C.ITEM_CHANGE_VALUE:
            // let new_state = JSON.parse(JSON.stringify(state))
            // console.log(new_state)
            if( !new_state || !new_state[action.systemId] ) { 
                return new_state 
            }
            new_state[action.systemId].forEach((thing, i) => {
                if(thing.id === action.thingId){
                    thing.items.forEach((item, k) => {
                        if(item.id === action.itemId){
                            new_state[action.systemId][i].items[k].value = action.value
                        }
                    })
                }
            })
            // console.log('value')
            // console.log(new_state)
            // console.log(new_state[action.systemId][2].items[0])
            return new_state
        case C.METHOD_CHANGE_STATE:
            {
                if( !new_state || !new_state[action.systemId] ) { 
                    return new_state 
                }
                new_state[action.systemId].forEach((thing, i) => {
                    if(thing.id === action.thingId){
                        thing.methods.forEach((method, k) => {
                            if(method.id === action.methodId){
                                new_state[action.systemId][i].methods[k].state = action.state
                            }
                        })
                    }
                })
                return new_state
            }
        default :
            return state
    }
}

// const openedThings = (state = {}, action) => {
//     let new_state = JSON.parse(JSON.stringify(state))
//     switch (action.type) {
//         case C.QUIT:
//             return []
//         case C.TOGGLE_THING:
//             // console.log("we are toggle")
//             const pos = state.indexOf(action.thingId)
//             if(pos !== -1){
//                 // unset(new_state[pos])
//                 new_state.splice(pos, 1)
//             }else{
//                 new_state.push(action.thingId)
//             }
//             return new_state
//         default :
//             return state

//     }
// }

// const connections = (state = {}, action) => {
//     switch (action.type) {
//         case C.UPDATE_CONNECTIONS:
//             return action.connections
//         case C.QUIT:
//             return {}
//         default :
//             return state

//     }
// }



const user = (state = {}, action) => {

    switch (action.type) {
        case C.SIGN_IN:
            {
                const { user, token } = action
                return { user, token }
            }
        case C.QUIT:
            return {}
        default:
            return state
    }
}

// const connection = (state = {}, action) => {

//     // let new_state = {}
//     switch (action.type) {
//         case C.SIGN_IN:
//             {
//                 const { host, port } = action
//                 return { host, port }
//             }
//         case C.QUIT:
//             return {}
//         default:
//             return state
//     }
// }


const panel = combineReducers({
    devices,
    things
    // openedThings, 
    // connections 
})

const mainReducer = combineReducers({
    panel,
    user
    // connection
})
export default mainReducer
