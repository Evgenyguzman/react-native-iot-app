import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button
} from 'react-native';
import { DeviceUnit } from '../components/blocks';

export default class DeviceScreen extends React.Component {

  static navigationOptions = ( {navigation} ) => {
    return ({
      // header: null
      title: navigation.state.params.id
    })
  }

  componentWillMount(){
    // console.log(this.props)
    // const {name} = this.props.navigation.state.params
    // ProfileScreen.navigationOptions.title = name
  }

  render() {
    const {id} = this.props.navigation.state.params // либо берем из store
    let {devices, things, items} = this.props.store.panel
    // things = things[id]
    // items = items[id]

    // for (var key in items) {
    //   console.log(items[key].id)
    // }

    let device = {
      id: '',
      type: ''
    }
    device = devices.find(d => {
      return (d.id === id)
    })
    // console.log('Device', device)
    // console.log(id)
    // console.log(this.props)

    // const temp = things[id][2].items[0].value
    // this.props.navigation.state.params = 
    // ProfileScreen.navigationOptions.title = name

    return (
      <View style={styles.container}>
        {/* <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}> */}
         
            {/* <View> 
                <Button
                title="Go back"
                onPress={() => 
                    this.props.navigation.goBack()
                }
                />
            </View> */}
            <View style={styles.container}> 
              {/* <Text style={styles.getStartedText} >{ "This is device " + id + " with type " + device.type } </Text> 
              <Text style={styles.getStartedText} >{ "Temperature is " + temp } </Text> */}
              <DeviceUnit system={device} things={things[id]}></DeviceUnit> 
            </View>

        {/* </ScrollView> */}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});


