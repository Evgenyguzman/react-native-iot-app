export default class HydraService {

	// singleton
    static instance = null
    static getInstance(){
        if(HydraService.instance === null){
            HydraService.instance = new HydraService()
        }
        return HydraService.instance
	}
	
	isConnected(){
		return (!this.state||this.state==='connecting'||this.state==='disconnected') ? false : true
	}

	isAuthorized(){
		return (this.state==='authorized')
	}

	async connect(address) {
		this.log('connecting...')
		this.state = 'connecting'
		this.socket = new WebSocket(address)
	    this.socket.addEventListener('message', (event) => {
	        this.log('received: ' + event.data)
			let data = JSON.parse(event.data)
			// console.log(data)
	        this.receive(data)
            if (this.state === 'getToken' && data.type === 'get-user-token-reply') {
                this.state = 'login-required'
	        	this.token = data.token
	        	this.resolve(data.token)
            }
            if (this.state === 'login' && data.type === 'login-user-reply') {
	        	this.state = data.success === true ? 'authorized' : 'login-required'
	        	this.resolve(data.success)
            }
            if (this.state === 'register' && data.type === 'register-user-reply') {
	        	this.state = 'login-required'
	        	this.resolve(data.result)
            }
	    })
	    this.socket.addEventListener('open', (event) => {
	    	this.state = 'login-required'
			this.resolve(true)
		})
		this.socket.addEventListener('error', (event) => {
			if (this.state === 'connecting') this.resolve(false)
			// if (this.state === 'authorized') {
			// 	this.onDisconnect()
			// }
			if(this.state !== 'disconnected' && this.state !== 'connecting'){
				this.onDisconnect()
	    		this.state = 'disconnected'
			}
		})
		this.socket.addEventListener('close', (event) => {
			if (this.state === 'connecting') this.resolve(false)
			// if (this.state === 'authorized') {
			// 	this.onDisconnect()
			// }
			if(this.state !== 'disconnected' && this.state !== 'connecting'){
				this.onDisconnect()
	    		this.state = 'disconnected'
			}
		})
	    return new Promise((resolve, reject) => { 
			this.resolve = resolve
			this.reject = reject
		})
    }

    async register(userId, password){
        this.log(this.state)
		if (this.state !== 'login-required') return false
		this.log(`register (${userId}, ${password})...`)
		this.state = 'register'
		// this.userId = userId
		let data = {'type': 'register-user-request', 'id': userId, 'password': password}
		this.socket.send(JSON.stringify(data))
		return new Promise((resolve, reject) => { 
			this.resolve = resolve
			this.reject = reject
		})
    }

    async getToken(userId, password){
        this.log(this.state)
		if (this.state !== 'login-required') return false
		this.log(`get token (${userId}, ${password})...`)
		this.state = 'getToken'
		// this.userId = userId
		let data = {'type': 'get-user-token-request', 'id': userId, 'password': password}
		this.socket.send(JSON.stringify(data))
		return new Promise((resolve, reject) => { 
			this.resolve = resolve
			this.reject = reject
		})
    }

	async login(id, token) {
        this.log(this.state)
		if (this.state !== 'login-required') return false
		this.log(`login (${token})...`)
		this.state = 'login'
		// this.token = token
		let data = {'type': 'login-user-request', 'id': id, 'token': token}
		this.socket.send(JSON.stringify(data))
		return new Promise((resolve, reject) => { 
			this.resolve = resolve
			this.reject = reject
		})
	}

	logout() {
		if (this.state !== 'authorized') return
		this.state = 'login-required'
		this.socket.send(JSON.stringify({'type': 'logout-user-request'}))
    }

	// ____________________ //
	// //system-statuses
	// //system-status
	// 
	// //item-value
	// //item-state
	// //things
	// //method-state
	// //notification
	// 
	// //system-type
	// local-address ?
	// 
	// thing-connected
	// thing-disconnected
	// state ?

	receive(data) {
		switch (data.type) {
			case 'system-statuses': if (this.checkDefined(data, ['system-statuses'])) this.onSystemStatuses(data['system-statuses']); break
			case 'system-status': if (this.checkDefined(data, ['system-status', 'system-id'])) this.onSystemStatus(data['system-status'], data['system-id']); break
			case 'system-info': if (this.checkDefined(data, ['system-type', 'system-model', 'system-version', 'system-id'])) this.onSystemInfo(data['system-type'], data['system-model'], data['system-version'], data['system-id']); break
			case 'state': if (data['thing-connection'] !== undefined && data['user-connection'] !== undefined) this.onHydraState(data['thing-connection'], data['user-connection']); break
			case 'thing-connected': this.onThingOnline(data); break
			case 'things': if (this.checkDefined(data, ['things', 'system-id']) ) this.onThingsData(data.things, data['system-id']); break
			case 'thing-disconnected': if (data.thing !== undefined) this.onThingOffline(data.thing); break
			case 'item-state': if (this.checkDefined(data, ['thing', 'item', 'state', 'system-id'])) this.onItemStateChanged(data.thing, data.item, data.state, data['system-id']); break
			case 'item-value': if (this.checkDefined(data, ['thing', 'item', 'value', 'system-id'])) this.onItemValueChanged(data.thing, data.item, data.value, data['system-id']); break
			case 'method-state': if (this.checkDefined(data, ['thing', 'method', 'state', 'system-id'])) this.onMethodStateChanged(data.thing, data.method, data.state, data['system-id']); break
			case 'notification': if (this.checkDefined(data, ['thing', 'text', 'system-id'])) this.onNotification(data.thing, data.text, data['system-id']); break
			default: break
		}
	}

	log(text) {
		// console.log('Hydra: ' + text)
	}

	onDisconnect() {
		this.log('suddenly disconnected')
	}

    onHydraState(thingConnection, userConnection) {
    }

	onThingsData(things) {
    }

	onThingOffline(thingId) {
    }

	onThingOnline(thing) {
    }

	onItemStateChanged(thingId, itemId, state) {
    }

	onItemValueChanged(thingId, itemId, value){
	}
	
	onMethodStateChanged(thingId, methodId, state){
	}
	
	onNotification(thing, text){
    }

	checkDefined(object, fields) {
		for (let i = 0; i < fields.length; i++)
			if (object[fields[i]] === undefined) return false
		return true
    }
    
    changeValue(thing, item, value){
		this.log(thing, item, value)
        this.socket.send(JSON.stringify({'action': 'set', 'thing': thing, 'item': item, 'value': value}))
	}
	
	runMethod(thing, method, parameters){
		this.log(thing, method, parameters)
        this.socket.send(JSON.stringify({'action': 'call', 'thing': thing, 'method': method, 'arguments': parameters }))
    }

}
