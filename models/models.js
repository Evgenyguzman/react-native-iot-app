export class System {

	constructor(things, type){

    // super(constructor)

    console.log(things)

    if(!type){
      // нужен systemType
      // можно поугадывать
    }else{

      switch(type){
        case 'dp-lite-plus':
          return new DpLitePlus(things)
        case 'dp-pro':
          return new DpPro(things)
        default:
          return undefined
      }

    }
         
	}

}

class DpLitePlus extends System {

  constructor(things){
    // super(constructor)

    const arr = ['mixer', 'trm', 'bm']
    const isExists = things.every((thing)=>{
      return arr.indexOf(thing.id) > -1
    })
    if(isExists && things.length === 3){
      things.type = 'dp-lite-plus'
      things.forEach(thing => {
        if(thing.id === 'mixer'){
          this.mixer = thing
        }
        if(thing.id === 'trm'){
          this.heater = thing
        }
        if(thing.id === 'bm'){
          this.beermachine = thing
        }
      })
    }
    
  }

}

class DpPro extends System {

  constructor(things){
    // super(constructor)

    this.heater = things[2]
    this.mixer = things[0]
    this.beermachine = things[1]

  }

}