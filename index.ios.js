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

// HOME/MAP/FEED
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

  watchID: (null: ?number),

  componentDidMount: function() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          longitude: position.coords.longitude,
          latitude: position.coords.latitude
        });
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 10000}
    );
    this.watchId = navigator.geolocation.watchPosition((position) => {
      this.setState({
        longitude: position.coords.longitude,
        latitude: position.coords.latitude
      })
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchId);
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
        showsUserLocation={true}
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


// class Feed extends Component {
//   constructor(props) {
//     super(props);
//     this.socket = io('ws://localhost:3000', {jsonp: false, transports: ['websocket']});
//     // this.socket = io;
//     // this.socket = new WebSocket('ws://localhost:3000');
//     // this.socket.connect();
//     this.state = {
//       pokemon: '',
//       postList: []
//     }
//   }
// // var Feed = React.createClass({
//   // initialState: {
//   //   pokemon: '',
//   //   postList: []
//   // }
//   componentDidMount() {
//     console.log("[1] Feed mouting.")
//     console.log("[2] Socket connected ??: ", this.socket.connected);
//     console.log("[3] Socket: ", this.socket);
//     // this.socket.error((err) => {
//     //   console.log("[Socket error] ", err);
//     // })
//     this.socket.on('update', (data) => {
//       console.log("Got something from server: ", data);
//       // trigger list reload
//       // add data yo your list view
//       this.setState({
//         postList: []
//       })
//     })
//   }


var FeedView = React.createClass({
  render() {
    return (<ListView
        enableEmptySections={true}
        dataSource={this.props.feed}
        renderRow={(rowData) => {
          return (<TouchableOpacity
            style={{
              backgroundColor: 'white',
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 3,
              padding: 2,
              paddingLeft: 10,
              paddingRight: 10
            }}>
            <Text>{rowData.pokemon + ' was spotted ' + Math.floor((Date.now() - new Date(rowData.time).getTime()) / 60000) + ' minutes ago'}</Text>
          </TouchableOpacity>)
        }
    } />)
  }
})

var Feed = React.createClass({
  getInitialState() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.refresh()
    return({
      pokemon: '',
      feed: ds.cloneWithRows([])
    })
  },
  refresh() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('http://localhost:3000/feed')
    .then((feed) => feed.json())
    .then((feedJson) => {
      console.log(feedJson);
      if (feedJson.success) {
        var reversefeed = feedJson.feed.reverse();
        this.setState({
          feed: ds.cloneWithRows(reversefeed)
        })
      }
    }).catch((err) => console.log(err))
  },
  componentDidMount() {
    setInterval(this.refresh, 6*10*1000);
  },
  post() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('http://localhost:3000/post', {
      headers: {
         "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        pokemon: this.state.pokemon
      })
    })
    .then((post) => post.json())
    .then((postJson) => {
      if(postJson) {
        // var reversefeed = feed.reverse();
        var feed = [].concat(postJson);
        feed.concat(this.state.feed);
        // var update = reversefeed.concat(postJson);
        this.setState({
          feed: ds.cloneWithRows(feed),
          pokemon: ''
        });
        this.refresh();
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
      <View>
        <FeedView feed={this.state.feed} />
        <View style={{width:width*.9}}>
          <TextInput
            style={{height: 25, textAlign: "center", borderColor: 'black', borderWidth: 1}}
            placeholder="Enter Pokemon"
            onChangeText={(pokemon) => this.setState({pokemon})} value={this.state.pokemon}
          />
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
