
import React from 'react';
import {
  View,
  Button
} from 'react-native';

export default function withLogout(WrappedComponent) {
  return class extends React.Component {
    // static navigationOptions =  {
    //   header: null
        // headerRight: (
        //   <Button
        //     onPress={() => this.onQuit()}
        //     title="Выйти"
        //     color="#fff"
        //   />
        // ),
    // }
    render() {
      return( 
        <WrappedComponent {...this.props}>
          {/* <View>
            <Button
              title="Выйти"
              onPress={() => 
                  this.props.navigation.navigate('Login')
              }
            />
          </View> */}
        </WrappedComponent>
      )
    }
  }
}
