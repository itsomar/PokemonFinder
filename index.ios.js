/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Dimensions,
  Alert
} from 'react-native';

var reactNative = require('react-native');

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

var Register = React.createClass({
  getInitialState() {
    return {
      username: "",
      password: "",
      message: ""
    }
  },

  // submit() {
  //   fetch('https://hohoho-backend.herokuapp.com/register', {
  // method: 'POST',
  // headers: {
  //   "Content-Type": "application/json"
  // },
  // body: JSON.stringify({
  //   username: this.state.username,
  //   password: this.state.password
  //   })
  // }).then((response) => response.json())
  // .then((responseJSON) => {
  //   console.log("OBKECT", responseJSON)
  //   if(responseJSON.success) {
  //     this.props.navigator.pop()
  //   }
  //   else {
  //     this.setState({
  //       message: responseJSON.error
  //     })
  //
  //   }
  //
  // }).catch((error) => {
  //   console.log(error)
  // })
  //
  // },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <View style={{width:width*.7}}>
          <TextInput
            style={{height: 40, textAlign: "center", borderColor: 'black', borderWidth: 1}}
            placeholder="Enter your username"
            onChangeText={(text) => this.setState({username: text})} value={this.state.username}
          />
          <TextInput
            style={{height: 40, textAlign: "center", borderColor: 'black', borderWidth: 1}}
            placeholder="Enter your password"
            onChangeText={(text) => this.setState({password: text})} value={this.state.password} secureTextEntry={true}
          />
        <TouchableOpacity
          onPress={this.submit} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
        <Text>
          {this.state.message}
        </Text>
      </View>
      </View>
    );
  }
});

var Pokegame = React.createClass({
  getInitialState() {
    return {
      username: "",
      password: "",
      message: ""
    }
  },
  //
  // submit() {
  //   fetch('https://hohoho-backend.herokuapp.com/login', {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({
  //       username: this.state.username,
  //       password: this.state.password
  //     })
  //   }).then((response) => (response.json()))
  //   .then((response) => {
  //     if(response.success) {
  //       this.props.navigator.push({
  //         component: Users,
  //         title: "Users",
  //         rightButtonTitle: 'Messages',
  //         onRightButtonPress: this.messages
  //       })
  //     }
  //     else {
  //       this.setState({
  //         message: response.error
  //       })
  //     }
  //   })
  // },
  //
  // messages() {
  //   this.props.navigator.push({
  //     component: Messages,
  //     title: "Messages"
  //   })
  // },

  render() {
    return <View style={styles.container}>
      <Text style={styles.textBig}>PokeMe!</Text>
      <Text style={styles.textMed}>Login</Text>
      <View style={{width:width*.7}}>
        <TextInput
          style={{height: 40, textAlign: "center", borderColor: 'black', borderWidth: 1}}
          placeholder="Enter your username"
          onChangeText={(username) => this.setState({username})} value={this.state.username}
        />
        <TextInput
          style={{height: 40, textAlign: "center", borderColor: 'black', borderWidth: 1}}
          placeholder="Enter your password"
          onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={this.submit} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
            <Text style={styles.buttonLabel}>Register</Text>
          </TouchableOpacity>
        <Text>
          {this.state.message}
        </Text>
      </View>
    </View>
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  textBig: {
    fontSize: 36,
    textAlign: 'center',
    margin: 10,
  },
  textMed: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});

AppRegistry.registerComponent('Pokegame', () => Pokegame);
