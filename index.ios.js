/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import Triangle from 'react-native-triangle';

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
  RefreshControl
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
        }}
        style={{flex: 1}}
        navigationBarHidden={true}
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
      // this.setState({
      //   message: JSON.stringify(err)
      console.log(err)
      // })
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
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 40, marginBottom: 5}}>Poke</Text><Text style={{fontSize: 40, marginBottom: 5, color: '#FF585B'}}>Finder</Text>
      </View>
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

  back() {
    this.props.navigator.pop();
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.textBig, {color: '#FF585B'}]}>Register</Text>
        <Text style={{color: 'red'}}>
          {this.state.message}
        </Text>
        <View style={{width:width*.7}}>
          <TextInput
            style={{height: 40, textAlign: "center", borderColor: 'black', borderWidth: 1}}
            placeholder="Choose a username"
            onChangeText={(text) => this.setState({username: text})} value={this.state.username}
          />
          <TextInput
            style={{height: 40, textAlign: "center", borderColor: 'black', borderWidth: 1}}
            placeholder="Choose a password"
            onChangeText={(text) => this.setState({password: text})} value={this.state.password} secureTextEntry={true}
          />
        <TouchableOpacity
          onPress={this.submit} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.back} style={[styles.button, styles.buttonBlue]}>
          <Text style={styles.buttonLabel2}>Back to Login</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
});

// <Text style={styles.textMed}>Pick your team</Text>
//           <Picker
//             selectedValue={this.state.team}
//             onValueChange={(text) => this.setState({team: text})}
//             >
//             <Picker.Item label="No team yet" value="Noteam" />
//             <Picker.Item label="Mystic" value="Mystic" />
//             <Picker.Item label="Instinct" value="Instinct" />
//             <Picker.Item label="Valor" value="Valor" />
//           </Picker>

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
      modalVisible: false,
      filtered: false,
      pokemonList: [],
      data: [],
      pokemon: "",
      markers: [],
      location: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    }
  },

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  },

  watchID: (null: ?number),

  refresh() {
    var that = this
    fetch('http://localhost:3000/feed')
    .then((feed) => feed.json())
    .then((feedJson) => {
      console.log(feedJson);
      if (feedJson.success) {
        var reversefeed = feedJson.feed.reverse();
        // console.log("FROM MONGO", reversefeed);
        if(this.state.filtered === true) {
          var array = reversefeed.filter(function(item) {
            return item.pokemon === that.state.pokemon
          })
          // console.log("ARRAY BRO", array);
          this.setState({
            markers: array
          })
        }
        else {
          // console.log("ENTERING ELSE ALL", reversefeed);
          this.setState({
            markers: reversefeed
          })
        }
      }
    }).catch((err) => console.log(err))
  },

  onTyping(text) {
    var pokemonComplete = this.state.pokemonList.filter(function (pokemon) {
      return pokemon.toLowerCase().startsWith(text.toLowerCase())
    })

    this.setState({
      data: pokemonComplete,
      pokemon: text
    });
  },

  all() {
    this.setState({
      filtered: false,
      // SET POKEMON TO EMPTY STRING?
    })
    return this.refresh()
  },

  filter(pokeList, pokemon) {
    if (pokeList.indexOf(pokemon) === -1) {
      return Alert.alert('Please enter a valid pokemon name');
    }
    this.setState({
      filtered: true
    })
    return this.refresh();
  },

  componentDidMount() {
    setInterval(this.refresh, 6*10*1000);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
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
          latitude: position.coords.latitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
      })
    });
    var pokemonList = ["All"];
    fetch('http://localhost:3000/pokemon')
    .then((pokemon) => pokemon.json())
    .then((pokemonJson) => {
      console.log(pokemonJson);
      if (pokemonJson.success) {
        for (var i = 0; i < pokemonJson.pokemon.length; i ++) {
          var pokemon = pokemonJson.pokemon[i];
          pokemonList.push(pokemon.name);
        }

        this.setState({
          pokemonList: pokemonList
        });
      }
    }).catch((err) => console.log(err));

  },

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  },

  logout() {
    console.log('logout');
    fetch('http://localhost:3000/logout')
    .then((logout) => logout.json())
    .then((logoutJson) => {
      if (logoutJson.success) {
        // console.log(logoutJson);
        AsyncStorage.removeItem('user');
        this.props.navigator.pop();
      }
    }).catch((err) => console.log(err));
  },

  render() {
    console.log("STATE OF HOME", this.state.markers);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return (
      <View style={{flex: 1}}>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View>
            <TouchableOpacity 
            onPress={this.logout}
            >
              <Text>Logout</Text>
            </TouchableOpacity>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Back</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>
        <View style={{flexDirection: 'row', marginTop: 22, position: 'absolute', top: 0, zIndex: 999}}>
          <TouchableHighlight
            onPress={() => {
            this.setModalVisible(true)}}
            style={styles.buttonSettings}
            >
              <Text style={styles.buttonLabel}>o</Text>
          </TouchableHighlight>
          <AutoComplete
            autoCorrect={false}
            onSelect={this.onTyping}
            onTyping={this.onTyping}
            autoCompleteFontSize={15}
            autoCompleteTableBorderWidth={1}
            autoCompleteRowHeight={25}
            autoCompleteTableBackgroundColor='white'
            maximumNumberOfAutoCompleteRows={10}
            style={styles.filterautocomplete}
            suggestions={this.state.data}
            placeholder='Type Pokemon'
          />
          <TouchableOpacity
          style={styles.buttonPost}
          onPress={this.filter.bind(this, this.state.pokemonList, this.state.pokemon)}
          >
            <Text style={styles.buttonLabel}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
          style={styles.buttonAll}
          onPress={this.all}
          >
            <Text style={styles.buttonLabel}>All</Text>
          </TouchableOpacity>
        </View>
        <View style={{backgroundColor: 'white', width: 50, height: 50}}>
        </View>
        <Map location={this.state.location} markers={this.state.markers}/>
        <Feed location={this.state.location} markers={this.state.markers} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh} pokemonList={this.state.pokemonList} filter={this.filter}/>
      </View>
    )
  }
})


var Map = React.createClass({

  render() {
    // console.log("MARKERS YO", this.props.markers);
    return (
      <MapView 
        style={{flex: 1}}
        region={{
          latitude: this.props.location.latitude,
          longitude: this.props.location.longitude,
          latitudeDelta: this.props.location.latitudeDelta,
          longitudeDelta: this.props.location.longitudeDelta
        }}
        showsUserLocation={true}
      >
      {this.props.markers.map(function(marker, i) {
        var timeAgo = ((Date.now() - new Date(marker.time).getTime()) / 60000)
        return (<MapView.Marker
          coordinate={{
            latitude: parseFloat(marker.location.latitude),
            longitude: parseFloat(marker.location.longitude)
          }}
          title={marker.pokemon}
          key={i}
          description={Math.floor(timeAgo.toString()) + ' minute(s) ago'}
        />)
      })}</MapView>
    )
  }
})

var Feed = React.createClass({
  getInitialState() {
    return {
      modalVisible1: false,
      pokemon: '',
      pokemonList: [],
      data: [],
      pokemonObj: {},
      pokeNames: [],
      refreshing: false
    }
  },
  // _onRefresh() {
  //   this.setState({refreshing: true});
  //   this.props.refresh()
  //   this.setState({refreshing: false});
  // },
  componentDidMount() {
    var pokeNames = [];
    var pokemonList = [];
    fetch('http://localhost:3000/pokemon')
    .then((pokemon) => pokemon.json())
    .then((pokemonJson) => {
      console.log(pokemonJson);
      if (pokemonJson.success) {
        for (var i = 0; i < pokemonJson.pokemon.length; i ++) {
          var pokemon = pokemonJson.pokemon[i];
          // pokemonList.push(pokemon.name);
          pokemonList.push(pokemon);
          pokeNames.push(pokemon.name);
        }

        this.setState({
          pokemonList: pokemonList,
          pokeNames: pokeNames
        });
      }
    }).catch((err) => console.log(err));
  },

  setModalVisible1(visible) {
    this.setState({modalVisible1: visible});
  },

  onTyping(text) {
    var pokemonComplete = this.state.pokemonList.filter(function (pokemon) {
      return pokemon.name.toLowerCase().startsWith(text.toLowerCase())
    })
    // if (this.state.pokeNames.indexOf(text)) {
    //   var pkmn = this.state.pokemonList[this.state.pokeNames.indexOf(text)]
    //   this.setState({
    //     data: pokemonComplete,
    //     pokemon: text,
    //     pokemonObj: pkmn
    //   })
    // } else {
      this.setState({
        data: pokemonComplete,
        pokemon: text
      });
    // }
  },

  onSelect(pokemon) {
    var pkIndex = -1;
    for (var i = 0; i < this.state.pokemonList.length; i++) {
      var pkmn = this.state.pokemonList[i]
      // if (pokemon.name.startsWith(this.state.pokemon)) {
      if (pkmn.name === pokemon) {
        pkIndex = i;
        break;
      }
    }

    if (pkIndex !== -1) {
      var pkmn = this.state.pokemonList[pkIndex];
      // console.log('[POKEMONNAME]', pokemon);
      pkmn.types = pkmn.types.toString();
      this.setState({
        pokemon: pokemon,
        pokemonObj: pkmn
      })
    }
  },

  post() {
    if (this.state.pokeNames.indexOf(this.state.pokemon) === -1) {
      return Alert.alert('Please enter a valid pokemon name');
    }
    // console.log("Current state", this.state);
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
        this.setState({
          pokemonObj: {},
          pokemon: ''
        });
        this.props.refresh();
        this.setModalVisible1(!this.state.modalVisible1);
      } else {
        console.log('error');
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },

  render() {
    // console.log("Feed state upon render", this.state);
    return (
      <View style={{flex:1, borderTopWidth: 1, borderColor: 'black'}}>
        <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible1}
        onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <Map location={this.props.location} markers={this.props.markers} feed={this.props.feed} />
          <View style={[styles.containerAuto, {borderColor: 'black', borderTopWidth: 1}]}>
            <Text style={[{position: 'absolute', top: 5, left: 7}, {fontSize: 15, marginTop: 5}]}>Enter:</Text>
            <AutoComplete
              autoCorrect={false}
              onSelect={this.onSelect}
              onTyping={this.onTyping}
              autoCompleteFontSize={15}
              autoCompleteTableBorderWidth={1}
              autoCompleteRowHeight={25}
              maximumNumberOfAutoCompleteRows={10}
              autoCompleteTableBackgroundColor='white'
              style={[styles.autocomplete, {marginTop: 5}]}
              suggestions={this.state.data.map((p) => { return p.name})}
              placeholder='Pokemon Name'
              />
            <View>
              <TouchableOpacity
              style={[styles.buttonPost, {position: 'absolute', top: -30, right: 7}]}
              onPress={this.post}
              >
                <Text style={styles.buttonLabel}>Post</Text>
              </TouchableOpacity>
            </View>
            <View>
              {(Object.keys(this.state.pokemonObj).length !== 0) ?
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Image source={{uri: 'http://localhost:3000/images/'+this.state.pokemonObj.name.toLowerCase()+'.png'}}
                         style={{width: 250, height: 250}} />
                  <View style={{position: 'absolute', top: 90, right: 20}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold'}}>Name: </Text><Text>{this.state.pokemonObj.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold'}}>No: </Text><Text>{this.state.pokemonObj.number}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold'}}>Type: </Text><Text>{this.state.pokemonObj.types}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold'}}>Rarity: </Text><Text>{this.state.pokemonObj.rarity}</Text>
                    </View>
                  </View>
                </View>
                  <TouchableHighlight style={[styles.button, styles.buttonBlue, {marginTop: 11}]} onPress={() => {
                    this.setModalVisible1(!this.state.modalVisible1)
                  }}>
                    <Text style={styles.buttonLabel2}>Back to live feed</Text>
                  </TouchableHighlight>
              </View>
            : <View>
                <TouchableHighlight style={[styles.button, styles.buttonBlue, {marginTop: 261}]}
                                    onPress={() => {this.setModalVisible1(!this.state.modalVisible1)}}
                >
                  <Text style={styles.buttonLabel2}>Back to live feed</Text>
                </TouchableHighlight>
              </View>
              }
            </View>
          </View>
        </Modal>
        <ListView
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        dataSource={this.props.feed}
        renderRow={(rowData) => {
          var rating = null;
          var col = 'black';
          var prefix = '';
          if (rowData.rating > 0) {
            col = "#669966";
            prefix = "+";
          }
          else if (rowData.rating < 0) {
            col = '#FF585B';
          }
          rating = <Text style={{marginTop: 4, fontSize: 25, marginRight: 1, color: col}}>{prefix + rowData.rating}</Text>
          // if (rowData.rating > 0) {
          //   rating = <Text style={{marginTop: 1, fontSize: 30, marginRight: 1, color: '#669966'}}>{"+" + rowData.rating}</Text>
          // } else if (rowData.rating < 0) {
          //   rating = <Text style={{marginTop: 1, fontSize: 30, marginRight: 1, color: '#FF585B'}}>{rowData.rating}</Text>
          // } else {
          //   rating = <Text style={{marginTop: 1, fontSize: 30, marginRight: 1, color: 'black'}}>{rowData.rating}</Text>
          // }
          if (rowData.vote) console.log("You voted", rowData.pokemon, rowData.vote);
          return (
            <Post rowData={rowData} rating={rating} location={this.props.location} refresh={this.props.refresh} vote={rowData.vote} pokemonList={this.props.pokemonList} filter={this.props.filter}/>
          )
          }
        } />
        <TouchableHighlight style={[styles.button, styles.buttonRed]} onPress={() => {
          this.setModalVisible1(true)
        }}>
          <Text style={styles.buttonLabel}>Post</Text>
        </TouchableHighlight>
      </View>
    )
  }
});

var Post = React.createClass({
  getInitialState() {
    return ({
      upvoted: (this.props.vote === 'up') || false,
      downvoted: (this.props.vote === 'down') || false
    })
  },
  componentWillReceiveProps(nextProps) {
      this.setState({
        upvoted: (nextProps.vote === 'up') || false,
        downvoted: (nextProps.vote === 'down') || false
      })  
  },
  sendVote(id, vote) {
    fetch('http://localhost:3000/post/' + id, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vote
      })
    })
    .then((rating) => rating.json())
    .then((ratingJson) => {
      if(ratingJson.success) {
        this.props.refresh();
      }
    }).catch((error) => {
      console.log(error)
    });
  },

  render() {
    var downCol = "#FF585B";
    var upCol = "#669966";
    if (this.state.upvoted) {
      upCol = "#ccc";
    }
    if (this.state.downvoted) {
      downCol = "#ccc";
    }

    var down = (
      <TouchableOpacity onPress={this.sendVote.bind(this, this.props.rowData._id, 'down')} style={{marginTop: 5, marginBottom: 5, padding: 7, borderRadius: 5, backgroundColor: downCol}}>
        <Triangle width={15} height={15} color={'white'} direction={'down'}/>
      </TouchableOpacity>
      )

    var up = (
      <TouchableOpacity onPress={this.sendVote.bind(this, this.props.rowData._id, 'up')} style={{marginTop: 5, marginBottom: 5, padding: 7, borderRadius: 5, backgroundColor: upCol}}>
        <Triangle width={15} height={15} color={'white'} direction={'up'}/>
      </TouchableOpacity>
      )
    return (
      <TouchableOpacity

        style={{
          backgroundColor: 'white',
          borderColor: 'black',
          borderBottomWidth: 1,
          padding: 2,
          paddingLeft: 10,
          paddingRight: 10
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image source={{uri: 'http://localhost:3000/emojis/'+this.props.rowData.pokemon.toLowerCase()+'.png'}}
            style={{width: 40, height: 40}} />
          <View style={{marginLeft: 10, marginTop: 3}}>
            <Text>{this.props.rowData.pokemon + ' seen ' + getDistanceFromLatLonInMiles(this.props.location.latitude,this.props.location.longitude,this.props.rowData.location.latitude,this.props.rowData.location.longitude).toFixed(1) + ' mi away'}</Text>
            <Text>by {this.props.rowData.user.username + ' ' + Math.floor((Date.now() - new Date(this.props.rowData.time).getTime()) / 60000) + ' minute(s) ago '} </Text>
          </View>
          <View style={[{position: 'absolute', right: 5}, {flexDirection: 'row'}]}>
            {this.props.rating}
            {down}
            {up}
          </View>
        </View>
      </TouchableOpacity>
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
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: 'black',
    borderWidth: 1
  },
  buttonRed: {
    backgroundColor: '#FF585B'
  },
  buttonBlue: {
    backgroundColor: 'white'
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  buttonPost: {
    backgroundColor: '#FF585B',
    padding: 5
  },
  buttonAll: {
    backgroundColor: '#FF585B',
    borderColor: 'white',
    borderLeftWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  buttonSettings: {
    backgroundColor: '#FF585B',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  },
  buttonLabel2: {
    textAlign: 'center',
    fontSize: 16
  },
  autocomplete: {
    alignSelf: 'stretch',
    height: 30,
    width: 270,
    backgroundColor: '#FFF',
    borderColor: 'lightblue',
    borderWidth: 1,
    marginLeft: 55
  },
  containerAuto: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center'
  },
  filterautocomplete: {
    alignSelf: 'stretch',
    height: 30,
    width: 260,
    backgroundColor: '#FFF',
    borderColor: 'lightblue',
    borderWidth: 1
  }
});

AppRegistry.registerComponent('Pokegame', () => Start);
