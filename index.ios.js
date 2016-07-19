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
  Alert,
  Picker,
  StatusBar
} from 'react-native';

// const DropDown = require('react-native-dropdown');
// const {
//   Select,
//   Option,
//   OptionList,
//   updatePosition
// } = DropDown;

var reactNative = require('react-native');

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

var Register = React.createClass({
  getInitialState() {
    return {
      username: "",
      password: "",
      team: "",
      message: ""
    }
  },

  submit() {
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
        team: this.state.team
      })
    })
    .then((response) => response.json())
    .then((responseJSON) => {
      console.log("OBKECT", responseJSON)
      if(responseJSON.success) {
        this.props.navigator.pop()
      } else {
        this.setState({
          message: responseJSON.error
        });
      }
    }).catch((error) => {
      console.log(error)
    });
  },

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
          <Picker
            selectedValue={this.state.language}
            onValueChange={(lang) => this.setState({language: lang})}>
            <Picker.Item label="Java" value="java" />
            <Picker.Item label="JavaScript" value="js" />
          </Picker>
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

var Home = React.createClass({
  render() {
    return (
    <View style={styles.container}>
      <Text style={styles.textBig}>PokeMe! Home</Text>
    </View>
    )
  }
})






var Pokegame = React.createClass({
  getInitialState() {
    return {
      username: "",
      password: "",
      message: ""
    }
  },

  register() {
    this.props.navigator.push({
      component: Register,
      title: 'Register'
    });
  },

  submit() {
    fetch('http://localhost:3000/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    }).then((response) => (response.json()))
    .then((response) => {
      if(response.success) {
        this.props.navigator.push({
          component: Home,
          title: "Home"
        })
      }
      else {
        this.setState({
          message: response.error
        })
      }
    })
  },

  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    })
  },

  random() {
    console.log("ON PRESS WORKS")
  },

  render() {
    return <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
    }}>
      <Text style={{fontSize: 40, fontWeight: 'bold', color: 'yellow', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 1, textShadowColor: 'blue', marginBottom: 5}}>PokeFinder!</Text>
      <Text>Please sign in</Text>
      <View style={{width:width*.7}}>
        <TextInput
          style={{height: 30, textAlign: "center", borderColor: 'black', borderWidth: 1}}
          placeholder="Username"
          onChangeText={(username) => this.setState({username})} value={this.state.username}
        />
        <TextInput
          style={{height: 30, textAlign: "center", borderColor: 'black', borderWidth: 1}}
          placeholder="Password"
          onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}
        />
        <TouchableOpacity
          onPress={this.submit} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
            <Text style={styles.buttonLabel2}>Register</Text>
          </TouchableOpacity>
        <Text>
          {this.state.message}
        </Text>
      </View>
    </View>
  }
})

// var Start = React.createClass({
//   getInitialState() {
//     return {
//       color: '#ffcccc',
//       textColor: 'white'
//     }
//     // return null;
//   },
//   componentDidMount() {
//     this.setState({color: 'red', textColor: 'white'})
//   },
//   render() {
//     return (
//       <View style={{flex: 1}}>
//         <NavigatorIOS
//           initialRoute={{
//             component: Pokegame,
//             title: "Pokegame"
//           }}
//           style={{flex: 1}}
//           titleTextColor={this.state.textColor}
//           tintColor={this.state.textColor}
//           barTintColor={this.state.color}
//         />
//         <StatusBar
//           barStyle={this.state.textColor === 'white' ? 'light-content' : null}
//         />

//      </View>

//     );

//   }
// });

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
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonRed: {
    backgroundColor: '#FF585B',
  },
  buttonBlue: {
    backgroundColor: 'white'
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  buttonLabel2: {
    textAlign: 'center',
    fontSize: 16
  }
});

AppRegistry.registerComponent('Pokegame', () => Pokegame);
