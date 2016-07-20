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


//MAKES NAVIGATOR WORK
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

//LOGIN and REGISTER BUTTON
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
//LOGOUT

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

// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED

var Home = React.createClass({
  getInitialState() {
    this.refresh()
    console.log("INITIAL STATE", this.state);
    return {
      markers: [],
      location: {
        latitude: "unknown",
        longitude: "unknown",
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    }
  },

  watchID: (null: ?number),

  refresh() {
    fetch('http://localhost:3000/feed')
    .then((feed) => feed.json())
    .then((feedJson) => {
      console.log(feedJson);
      if (feedJson.success) {
        var reversefeed = feedJson.feed.reverse();
        console.log("FROM MONGO", reversefeed);
        this.setState({
          markers: reversefeed
        })
      }
    }).catch((err) => console.log(err))
  },

  componentDidMount: function() {
    setInterval(this.refresh, 6*10*1000);
    console.log("[MOUNTING]")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          }
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
    this.watchId = navigator.geolocation.watchPosition((position) => {
      this.setState({
        location: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        }
      })
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchId);
  },

  render() {
    console.log("STATE OF HOME", this.state.markers);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={{flex: 1}}>
        <Map location={this.state.location} markers={this.state.markers}/>
        <Feed location={this.state.location} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh}/>
      </View>
    )
  }
})


var Map = React.createClass({

  render() {
    console.log("MARKERS YO", this.props.markers);
    return (
      <MapView style={{flex: 1}}
        region={{
          latitude: this.props.location.latitude,
          longitude: this.props.location.longitude,
          latitudeDelta: this.props.location.latitudeDelta,
          longitudeDelta: this.props.location.longitudeDelta
        }}
        showsUserLocation={true}
      >
      {this.props.markers.map(marker => (
        <MapView.Marker
          coordinate={{
            latitude: marker.location.latitude,
            longitude: marker.location.longitude
          }}
          title={marker.pokemon}
          description={marker.description}
        />
      ))}</MapView>
    )
  }
})

var Feed = React.createClass({

  getInitialState() {
    return({
        pokemon: ''
    })
  },

  post() {
    fetch('http://localhost:3000/post', {
      headers: {
         "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        pokemon: this.state.pokemon,
        longitude: this.props.location.longitude,
        latitude: this.props.location.latitude
      })
    })
    .then((post) => post.json())
    .then((postJson) => {
      if(postJson) {
        console.log("[HELLO]", postJson);
        this.props.refresh();
      } else {
        console.log('error');
      }
    })
    .catch((err) => {
    /* do something if there was an error with fetching */
      console.log(err);
    });
  },

  render() {
    console.log("Feed state upon render", this.state);
    return (
      <View style={{flex:1}}>
        <ListView
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        dataSource={this.props.feed}
        renderRow={(rowData) => {
          return (
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 3,
              padding: 2,
              paddingLeft: 10,
              paddingRight: 10
            }}>
            <Text>{rowData.pokemon + ' was spotted ' + Math.floor((Date.now() - new Date(rowData.time).getTime()) / 60000) + ' minute(s) ago'}</Text>
          </TouchableOpacity>)
          }
        } />
        <View style={{width:width}}>
          <Picker
            selectedValue={this.state.pokemon}
            onValueChange={(text) => this.setState({pokemon: text})}>
            <Picker.Item label="Snorlax" value="Snorlax" />
            <Picker.Item label="Pikachu" value="Pikachu" />
            <Picker.Item label="MewTwo" value="MewTwo" />
            <Picker.Item label="Tom" value="Tom" />
          </Picker>
          <TouchableOpacity style={[styles.button, styles.buttonPost]} onPress={this.post}><Text style={styles.buttonLabel}>Post</Text></TouchableOpacity>
        </View>
      </View>
    )
  }
})

// LOGIN OR REGISTER


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
