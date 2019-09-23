import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

export default class ForgotPasswordScreen extends React.Component {
  
  static navigationOptions = (props) => {
    return({
      headerStyle: {
        backgroundColor: '#804C2F'
      },
      headerTitleStyle: {
        color: '#FFF',
      }
    }) 
  }

  render() {

    const { navigate } = this.props.navigation;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text>Забыли пароль</Text>
          <View>
            <Button
            title="Go back"
            onPress={() => 
                this.props.navigation.navigate('Login')
            }
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  _handleForgotPassword = () => {
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scene: {
    flex: 1,
  }
});
