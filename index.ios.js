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
  StatusBar,
  AsyncStorage,
  Image
} from 'react-native';

var reactNative = require('react-native');
var MapView = require('react-native-maps')

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
    console.log("ENTERED FUNCTION");
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
          <Text style={styles.textMed}>Pick your team</Text>
          <Picker
            selectedValue={this.state.team}
            onValueChange={(text) => this.setState({team: text})}>
            <Picker.Item label="No team yet" value="Noteam" />
            <Picker.Item label="Mystic" value="Mystic" />
            <Picker.Item label="Instinct" value="Instinct" />
            <Picker.Item label="Valor" value="Valor" />
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
      <View style={{flex: 1}}>
        <Map />
        <Feed />
      </View>

    )
  }
})



var Map = React.createClass({
  getInitialState() {
    return {
      latitude: "unknown",
      longitude: "unknown",
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
      markers: [{
        latitude: 37.785834,
        longitude: -122.406417
      }]
    }
  },

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("POSITION", position);
        this.setState({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
    navigator.geolocation.watchPosition((position) => {
      this.setState({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      })
    });
  },

  render() {
    return (
      <MapView style={{
        flex: 1}}
        region={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        onRegionChange={this.onRegionChange}
        showsUserLocation={true}
        initialRegion={{
          latitude: this.state.latitude,
          longitude: this.state.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
      {this.state.markers.map(marker => (
        <MapView.Marker
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
          title={marker.title}
          description={marker.description}
        />
      ))}</MapView>
    )
  }
})

          // image={require('./001.png')}

var Feed = React.createClass({
  getInitialState() {
    return {
      pokemon: ''
    }
  },
  post() {
    fetch('https://localhost:3000/post', {
      headers: {
         "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        pokemon: this.state.pokemon
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.success) {

      } else {
        console.log(responseJson.error);
      }
    })
    .catch((err) => {
    /* do something if there was an error with fetching */
      console.log(err);
    });
  },
  render() {
    return (
    <View>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <Text>Placeholder</Text>
      <View style={{width:width*.7}}>
        <TextInput
          style={{height: 30, textAlign: "center", borderColor: 'black', borderWidth: 1}}
          placeholder="Enter Pokemon"
          onChangeText={(pokemon) => this.setState({pokemon})} value={this.state.pokemon}
        />
        <TouchableOpacity style={[styles.button, styles.buttonPost]} onPress={this.post}><Text style={styles.buttonLabel}>Post</Text></TouchableOpacity>
      </View>
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

  componentDidMount() {
    AsyncStorage.getItem('user')
  .then(result => {
    var parsedResult = JSON.parse(result);
    var username = parsedResult.username;
    var password = parsedResult.password;
    if (username && password) {
      this.setState({
        username: username,
        password: password
      })
      return this.submit()
    }
    // Don't really need an else clause, we don't do anything in this case.
  })
  .catch(err => {
    this.setState({
      message: JSON.stringify(err)
    })
  })
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
        AsyncStorage.setItem('user', JSON.stringify({
          username: this.state.username,
          password: this.state.password
      }));
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
    console.log("state upon render", this.state);
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

var Start = React.createClass({
  render() {
    return (
        <NavigatorIOS
          initialRoute={{
            component: Pokegame,
            title: "Pokegame"
          }} style={{flex: 1}}
        />
    )
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
  buttonPost: {
    backgroundColor: 'orange'
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

AppRegistry.registerComponent('Pokegame', () => Start);
