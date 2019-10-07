import React, { Component } from 'react';
// import PageTemplate from './pageTemplate';

import C from '../store/constants';
// // import ProductsService from '../services/productsService'

// // import { CatalogContainer } from '../../containers/CatalogContainers';
// import { updateAllThings } from '../../redux/actions';
// import { ThingsListContainer, ManagePanelContainer } from '../../containers/PanelContainers';
import HydraService from './HydraService';



import {
    Text,
    TextInput,
    View,
    Modal
  } from 'react-native';
import { login } from '../store/actions';
// import { System } from '../models/models';

export default class CloudConnector extends Component {


    // устанавливаем связь с облаком по WS
    
    // если не залогинены
        // если есть user и password , то getToken и login 
        // если есть user и token , то login 
    // если залогинены то все норм

    // подписываемся на события и отправляем в actions
    // получаем события из actions и отправляем на облако

    constructor(props){
        super(props)
        this.state = {
            isConnected: false
        }
    }

    render() {
        // const store = this.props.store.getState()
        // const user = store.user
        const {isConnected} = this.state
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={!isConnected}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{ 
                    flex: 1, 
                    flexDirection: 'column', 
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    <Text>НЕТ соединения</Text>
                </View>
            </Modal>
        )
    }


    componentDidMount() {
        this.connectCloud()
    }

    async connectCloud(){

        const state = this.props.store.getState()

        let hydra = HydraService.getInstance()

        // const host = connection.host || 'localhost'
        // const port = connection.port || '3001'
        // const host = '192.168.0.4'
        // const host = '192.168.1.41'
        // const host = '192.168.0.116'
        const host = '89.108.65.199'
        const port = '3001'

        let res = await hydra.connect("ws://" + host + ":" + port)

        if(res){
            // setState
            // console.log("connected")
            this.setState({
                isConnected: true
            })


            // try to login
            console.log(this.props.store.getState().user)
            const {user,token} = this.props.store.getState().user
            if(user && token){
                this.props.store.dispatch(login(user, token))
            }
            
            hydra.onSystemStatuses = (systemStatuses) => {
                console.log('On system statuses', systemStatuses)
                this.props.store.dispatch({
                    type: C.UPDATE_SYSTEMS,
                    systems: systemStatuses
                })
            }

            hydra.onSystemStatus = (systemStatus, systemId) => {
                console.log('On system status', systemStatus, systemId)
                this.props.store.dispatch({
                    type: C.UPDATE_SYSTEM,
                    status: systemStatus,
                    id: systemId
                })
            }

            hydra.onSystemInfo = (systemType, systemModel, systemVersion, systemId) => {
                // console.log('On system info', systemType, systemModel, systemVersion, systemId)
                this.props.store.dispatch({
                    type: C.UPDATE_SYSTEM,
                    systemType,
                    systemModel,
                    systemVersion,
                    id: systemId
                })
            }

            // hydra.onHydraState = (thingConnection, userConnection) => {
                // this.props.store.dispatch({
                //     type: C.UPDATE_CONNECTIONS,
                //     connections: {
                //         thingConnection,
                //         userConnection
                //     }
                // })
            // }
            
            hydra.onThingsData = (things, systemId) => {
                console.log('On things', systemId)

                // const store = this.props.store.getState()
                // const type = store.panel.devices[0].type || undefined
                // const system = new System(things, type)
                // console.log(system)

                // если хреновые things отправляем update-request
                // иначе 
                this.props.store.dispatch({
                    type: C.UPDATE_THINGS,
                    id: systemId,
                    things: things,
                })
            }

            // hydra.onSuccessLogin = () => {
                
            // }

            // hydra.onThingOffline = (thingId) => {
                // this.props.store.dispatch({
                //     type: C.THING_OFFLINE,
                //     thingId
                // })
            // }

            // hydra.onThingOnline = (thing) => {
                // this.props.store.dispatch({
                //     type: C.THING_ONLINE,
                //     thing
                // })
            // }

            hydra.onItemStateChanged = (thingId, itemId, state, systemId) => {
                console.log('On item state change')
                this.props.store.dispatch({
                    type: C.ITEM_CHANGE_STATE,
                    thingId,
                    itemId,
                    state,
                    systemId
                })
            }

            hydra.onItemValueChanged = (thingId, itemId, value, systemId) => {
                console.log('On item change', thingId, itemId, value, systemId)
                this.props.store.dispatch({
                    type: C.ITEM_CHANGE_VALUE,
                    thingId,
                    itemId,
                    value,
                    systemId
                })
            }

            hydra.onMethodStateChanged = (thingId, methodId, state, systemId) => {
                this.props.store.dispatch({
                    type: C.METHOD_CHANGE_STATE,
                    thingId,
                    methodId,
                    state,
                    systemId
                })
            }

            hydra.onNotification = (thingId, text, systemId) => {
                // this.setState({
                //     notification: {
                //         thing: thingId,
                //         text: text
                //     }
                // })
            }


            hydra.onDisconnect = () => {
                // не работает
                console.log("disconnect")
                this.setState({isConnected: false})
                setTimeout(()=>{
                    this.connectCloud()
                }, 10000)
            }

        }else{
            // try to reconnect
            console.log("no connect")
            setTimeout(()=>{
                this.connectCloud()
            }, 10000)
        }

    }
    
    onQuit(params='') {
        HydraService.getInstance().logout()
        this.props.store.dispatch({
            type: C.QUIT
        })
        // this.props.history.push("/login" + params)
    }

}
