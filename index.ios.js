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
  Image,
  Modal,
  TouchableHighlight,
} from 'react-native';

var reactNative = require('react-native');
var MapView = require('react-native-maps');
var AutoComplete = require('react-native-autocomplete');

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function getDistanceFromLatLonInMiles(lat1,lon1,lat2,lon2) {
  lat2 = parseFloat(lat2)
  lon2 = parseFloat(lon2)
  console.log('[OUR LATITUDE]', lat1)
  console.log('[OUR LONGITUDE]', lon1)
  console.log('[FAR LATITUDE]', lat2)
  console.log('[FAR LATITUDE]', lon2)

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 0.621371; // Distance in miles
}


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
        <Feed location={this.state.location} markers={this.state.markers} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh}/>
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


class Feed extends Component {

  constructor(props) {
    var pokemonList = [];
    fetch('http://localhost:3000/pokemon')
    .then((pokemon) => pokemon.json())
    .then((pokemonJson) => {
      console.log(pokemonJson);
      if (pokemonJson.success) {
        for (var i = 0; i < pokemonJson.pokemon.length; i ++) {
          var pokemon = pokemonJson.pokemon[i];
          pokemonList.push(pokemon.name);
        }
      }
    }).catch((err) => console.log(err));
    super(props);
    this.state = {
      pokemon: '',
      modalVisible1: false,
      modalVisible2: false,
      pokemonList,
      data: []
    };
  }

  setModalVisible1(visible) {
    this.setState({modalVisible1: visible});
  }

  setModalVisible2(visible) {
    this.setState({modalVisible2: visible});
  }

  onTyping(text) {
    var pokemonComplete = this.state.pokemonList.filter(function (pokemon) {
      return pokemon.name.toLowerCase().startsWith(text.toLowerCase())
    }).map(function (pokemon) {
      return pokemon.name;
    });

    this.setState({
        data: pokemonComplete
    });
  }

  post() {
    console.log("Current state", this.state);
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
        this.setModalVisible1(!this.state.modalVisible1);
      } else {
        console.log('error');
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    console.log("Feed state upon render", this.state);
    return (
      <View style={{flex:1}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible1}
          onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <Map location={this.props.location} markers={this.props.markers} feed={this.props.feed} />
          <View style={{
            flex:1
          }}>
            <View>
              <Text>POST!</Text>
              <View style={{width:width}}>
                <Text>Search for a Pokemon</Text>
                <AutoComplete onTyping={this.onTyping}
                  suggestions={this.state.data}
                />
                <TouchableOpacity style={[styles.button, styles.buttonPost]} onPress={this.post.bind(this)}><Text style={styles.buttonLabel}>Post</Text></TouchableOpacity>
              </View>

              <TouchableHighlight onPress={() => {
                this.setModalVisible1(!this.state.modalVisible1)
              }}>
                <Text>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible2}
          onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <Map location={this.props.location} markers={this.props.markers} feed={this.props.feed} />
          <View style={{
            flex:1
          }}>
            <View>
              <Text>FILTER!</Text>

              <TouchableHighlight onPress={() => {
                this.setModalVisible2(!this.state.modalVisible2)
              }}>
                <Text>Cancel</Text>
              </TouchableHighlight>

            </View>
          </View>
        </Modal>
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
            <View style={{flexDirection: 'row'}}>
              <Image source={{uri: 'http://localhost:3000/emojis/'+rowData.pokemon.toLowerCase()+'.png'}}
                style={{width: 40, height: 40}} />
              <View style={{marginLeft: 10, marginTop: 3}}>
                <Text>{rowData.pokemon + ' was spotted ' + getDistanceFromLatLonInMiles(this.props.location.latitude,this.props.location.longitude,rowData.location.latitude,rowData.location.longitude).toFixed(1) + ' miles away'}</Text>
                <Text>by {rowData.user.username + ' ' + Math.floor((Date.now() - new Date(rowData.time).getTime()) / 60000) + ' minute(s) ago '} </Text>
              </View>
            </View>
          </TouchableOpacity>)
          }
        } />
        <TouchableHighlight style={[styles.button, styles.buttonRed]} onPress={() => {
          this.setModalVisible1(true)
        }}>
          <Text style={styles.buttonLabel}>Post</Text>
        </TouchableHighlight>
        <TouchableHighlight style={[styles.button, styles.buttonBlue]} onPress={() => {
          this.setModalVisible2(true)
        }}>
          <Text style={styles.buttonLabel2}>Filter</Text>
        </TouchableHighlight>
      </View>
    )
  }
}



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
