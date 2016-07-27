/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import React, { Component } from 'react';
import Triangle from 'react-native-triangle';
import Swiper from 'react-native-swiper';

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
  RefreshControl,
  TabBarIOS
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
      <Text style={{color: '#a9a9a9'}}>Please sign in</Text>
      <View style={{width:width*.7}}>
        <TextInput
          style={{height: 30, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
          placeholder="Username"
          onChangeText={(username) => this.setState({username})} value={this.state.username}
        />
        <TextInput
          style={{height: 30, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
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
            style={{height: 40, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
            placeholder="Choose a username"
            onChangeText={(text) => this.setState({username: text})} value={this.state.username}
          />
          <TextInput
            style={{height: 40, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
            placeholder="Choose a password"
            onChangeText={(text) => this.setState({password: text})} value={this.state.password} secureTextEntry={true}
          />
          <Text style={[styles.textMed, {color: '#a9a9a9'}]}>Pick your team</Text>
          <Picker
            selectedValue={this.state.team}
            onValueChange={(text) => this.setState({team: text})}
            >
            <Picker.Item label="No team yet" value="Noteam" />
            <Picker.Item label="Mystic" value="Mystic" />
            <Picker.Item label="Instinct" value="Instinct" />
            <Picker.Item label="Valor" value="Valor" />
          </Picker>

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


// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
// HOME/MAP/FEED// HOME/MAP/FEED// HOME/MAP/FEED
var TitleText = React.createClass({
  render() {
      return (
        <Text style={{ fontSize: 48, color: 'white' }}>
          {this.props.label}
        </Text>
      )
    }
  })


  var Profile = React.createClass({
    render() {
      var teamImg = null;
      if (this.props.team) {
        teamImg = (<Image source={{uri: 'http://localhost:3000/images/'+this.props.team.toLowerCase()+'.png'}}
               style={{width: 230, height: 230, alignItems: 'center'}}>
          <Text style={{backgroundColor: 'rgba(0,0,0,0)'}}>{this.props.username} | {this.props.team}</Text>
        </Image>)
      }
      return (
        <View style={{backgroundColor: '#f5fcff', flex: 1, borderTopWidth: 1, borderColor: '#d3d3d3', alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 40, marginBottom: 5, backgroundColor: 'rgba(0,0,0,0)'}}>Poke</Text>
            <Text style={{fontSize: 40, marginBottom: 5, backgroundColor: 'rgba(0,0,0,0)', color: '#FF585B'}}>Finder</Text>
          </View>
          {teamImg}
          <TouchableOpacity onPress={this.props.logout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      )
    }
  })


var Home = React.createClass({
  getInitialState() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("POSITIONYO", position)
        this.refresh(position.coords.longitude, position.coords.latitude)
        this.setState({
          region: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          },
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
    )
    this.watchId = navigator.geolocation.watchPosition((position) => {
      this.setState({
        location: {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
      })
    })

    return {
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 0,
      modalVisible: false,
      filteredOne: {
        on: false,
        id: undefined
      },
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
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    }
  },

  changeRegion(region) {
    this.setState({
      region:{
        latitude: region.latitude || this.state.location.latitude,
        longitude: region.longitude || this.state.location.longitude,
        latitudeDelta: region.latitudeDelta || this.state.location.latitudeDelta,
        longitudeDelta: region.longitudeDelta || this.state.location.longitudeDelta
      }
    })
  },

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  },

  watchID: (null: ?number),

  viewStyle() {
    return {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }
  },

  refresh(lng, lat) {
    console.log("Calling refresh...LONG", this.state.location.longitude, "LAT: ", this.state.location.latitude);
    console.log("location: ", lng || this.state.location.longitude, ", ", lat || this.state.location.latitude);
    var that = this
    fetch('http://localhost:3000/feed?longitude=' + this.state.location.longitude + "&latitude=" + this.state.location.latitude)
    .then((feed) => feed.json())
    .then((feedJson) => {
      console.log("current feed: ", feedJson);
      console.log(feedJson);
      if (feedJson.success) {
        var reversefeed = feedJson.feed.reverse();
        // console.log("FROM MONGO", reversefeed);
        if(this.state.filteredOne.on === true) {
          console.log('[FILTERED_POKEMON]', this.state.filteredOne);
          var array = reversefeed.filter(function(item) {
            console.log("ITEM", item)
            return item._id === that.state.filteredOne.id
          })
          this.setState({
            markers: array
          })
        } else if(this.state.filtered === true) {
          console.log('[ALLFILTER]', this.state.filtered)
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
      filteredOne: ({
        on: false,
        id: undefined
      })
      // SET POKEMON TO EMPTY STRING?
    })
    pokemon = ''
    return this.refresh()
  },
  filter(pokeList, pokemon, placeholder, id) {
    if (id) {
      this.setState({
        filteredOne: {
          on: true,
          id: id
        }
      })
    } else if (pokeList.indexOf(pokemon) === -1) {
      return Alert.alert('Please enter a valid pokemon name');
    } else if (pokeList.indexOf(pokemon) > -1) {
      this.setState({
        filtered: true
      })
    }
    // if (pokeList.indexOf(pokemon) === -1) {
    //   return Alert.alert('shit');
    // }
    // this.setState({
    //   filtered: true
    // })
    // console.log('WHY AM I DEFINED??????', placeholder)
    // console.log('WHAT ABOUT ME?????????', id)
    return this.refresh();
  },

//will mount everytime its rerendered??
  componentWillMount() {

    this.refresh()
    setInterval(this.refresh, 6*10*1000);

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

  _renderContent: function(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
  },

  logout() {
    console.log('logout');
    fetch('http://localhost:3000/logout')
    .then((logout) => logout.json())
    .then((logoutJson) => {
      if (logoutJson.success) {
        // console.log(logoutJson);
        AsyncStorage.removeItem('user');
        console.log("Navigating away");
        // this.props.navigator.push({
        //   component: Pokegame,
        //   title: 'Pokegame'
        // });

        this.props.navigator.pop()
      }
    }).catch((err) => console.log(err));
  },

  render() {
    // console.log("STATE OF HOME", this.state.markers);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

              // selectedIcon={require('./img/navigation2.png')}

    return (
      <View>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >

          <View style={[styles.container,{marginTop: 22}]}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 40, marginBottom: 5}}>Poke</Text><Text style={{fontSize: 40, marginBottom: 5, color: '#FF585B'}}>Finder</Text>
            </View>
            <TouchableOpacity
            onPress={this.logout}
            >
              <Text>Logout</Text>
            </TouchableOpacity>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Cancel</Text>
            </TouchableHighlight>


          </View>
        </Modal>

        <View style={{backgroundColor: 'white', width: 50, height: 50}}>
        </View>
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
        <View style={{height: height*9/20}}>
          <Map location={this.state.location} region={this.state.region} changeRegion={this.changeRegion} markers={this.state.markers}/>
        </View>
        <View style={{height: height*38/80}}>
          <TabBarIOS
            unselectedTintColor="yellow"
            translucent={false}
            tintColor="white"
            barTintColor="black">
            <TabBarIOS.Item
              icon={require('./pokeballnav.png')}
              renderAsOriginal
              selected={this.state.selectedTab === 'redTab'}
              title="Pokemon"
              onPress={() => {
                this.setState({
                  selectedTab: 'redTab',
                  notifCount: this.state.notifCount + 1,
                });
              }}>
              <Swiper
                loop={false}
                index={1}
                showsPagination={false}>
                <View style={{height: height*19/40}}>
                  <TitleText label="Right" />
                </View>
                <View style={{height: height*19/40}}>
                  <Feed location={this.state.location} region={this.state.region} changeRegion={this.changeRegion} markers={this.state.markers} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh} pokemonList={this.state.pokemonList} filter={this.filter}/>
                </View>
                <View>
                  <Right location={this.state.location} refresh={this.refresh} />
                </View>
              </Swiper>
            </TabBarIOS.Item>
            <TabBarIOS.Item
              renderAsOriginal
              icon={require('./pokegymnav.png')}
              title="Gyms"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'greenTab',
                  presses: this.state.presses + 1
                });
              }}>
              <Swiper
                loop={false}
                index={1}
                showsPagination={false}>
                <View>
                  <Profile username={this.state.username} team={this.state.team} logout={this.logout}/>
                </View>
                <View style={{height: height*128/320}}>
                  <Feed location={this.state.location} region={this.state.region} changeRegion={this.changeRegion} markers={this.state.markers} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh} pokemonList={this.state.pokemonList} filter={this.filter}/>
                </View>
                <View>
                  <Right location={this.state.location} refresh={this.refresh} />
                </View>
              </Swiper>
            </TabBarIOS.Item>
          </TabBarIOS>
        </View>
      </View>
    )
  }
})

var Map = React.createClass({

  getInitialState() {
    return {
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
      latitudeDelta: this.props.location.latitudeDelta,
      longitudeDelta: this.props.location.longitudeDelta
    };
  },
  componentWillReceiveProps(newProps) {
    this.setState(newProps.region)
  },

  onRegionChange(region) {
    this.props.changeRegion(region)
  },

  nav() {
    this.props.changeRegion({
        latitude: this.props.location.latitude,
        longitude: this.props.location.longitude,
        latitudeDelta: this.props.location.latitudeDelta,
        longitudeDelta: this.props.location.longitudeDelta
    })
  },

  render() {

    return (
      <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        onRegionChange={this.onRegionChange}
        region={{latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: this.state.latitudeDelta,
                longitudeDelta: this.state.longitudeDelta}}
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
          image={require('./pokeball.png')}
        />)
      })}</MapView>
      <TouchableOpacity style={styles.blue} onPress={this.nav}>
        <Image source={require('./img/navigation2.png')} style={{width: 35, height: 35}}/>
      </TouchableOpacity>
      </View>
    )
  }
})

var Right = React.createClass({
  getInitialState() {
    return {
      pokemon: '',
      pokemonList: [],
      data: [],
      pokemonObj: {},
      pokeNames: [],
    }
  },
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
      } else {
        console.log('error');
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },
  render() {
    return (
    <View style={[styles.containerAuto, {borderColor: '#d3d3d3', borderTopWidth: 1}]}>
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
        value={this.state.pokemon}
      />
      <View>
        {(Object.keys(this.state.pokemonObj).length !== 0) ?
        <View>
          <View style={{flexDirection: 'row'}}>
            <Image source={{uri: 'http://localhost:3000/images/'+this.state.pokemonObj.name.toLowerCase()+'.png'}}
                   style={{width: 196, height: 196}} />
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
            <TouchableOpacity
            style={[styles.button, styles.buttonRed]}
            onPress={this.post}
            >
              <Text style={styles.buttonLabel}>Post</Text>
            </TouchableOpacity>
        </View>
      : <View>
          <TouchableOpacity
          style={[styles.button, styles.buttonRed, {marginTop: 196}]}
          onPress={this.post}
          >
            <Text style={styles.buttonLabel}>Post</Text>
          </TouchableOpacity>
        </View>
        }
      </View>
    </View>
    )
  }
})

var Feed = React.createClass({

  render() {
    // console.log("Feed state upon render", this.state);
     //
    //  changeRegion{this.followPost}


    return (
      <View style={{flex: 1, borderTopWidth:1, borderColor: '#d3d3d3', backgroundColor: '#f5fcff'}}>
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
          if (rowData.vote) console.log("You voted", rowData.pokemon, rowData.vote);
          console.log("props", this.props);
          return (
            <Post rowData={rowData} rating={rating} region={this.props.region} location={this.props.location} refresh={this.props.refresh} vote={rowData.vote} pokemonList={this.props.pokemonList} filter={this.props.filter} changeRegion={this.props.changeRegion}/>

          )
          }
        } />
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

  selectPost() {
    // console.log("HEY ROW DATA", this.props.rowData.location)
    console.log("[POST props]", this.props);
    this.props.filter(this.props.pokemonList, null, null, this.props.rowData._id);
    this.props.changeRegion(
      { latitude: this.props.rowData.location.latitude,
        longitude: this.props.rowData.location.longitude,
        latitudeDelta: this.props.region.latitudeDelta,
        longitudeDelta: this.props.region.longitudeDelta,
    })
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
      <View
        style={{
          backgroundColor: '#f6f6f6',
          borderColor: 'rgba(0,0,0,.1)',
          borderBottomWidth: 1,
          padding: 2,
          paddingLeft: 10,
          paddingRight: 10
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.selectPost}>
            <View style={{flexDirection: 'row'}}>
              <Image source={{uri: 'http://localhost:3000/emojis/'+this.props.rowData.pokemon.toLowerCase()+'.png'}}
              style={{width: 40, height: 40}} />
              <View style={{marginLeft: 10, marginTop: 3}}>
                <Text>{this.props.rowData.pokemon + ' seen ' + getDistanceFromLatLonInMiles(this.props.location.latitude,this.props.location.longitude,this.props.rowData.location.latitude,this.props.rowData.location.longitude).toFixed(1) + ' miles away'}</Text>
                <Text>by {this.props.rowData.user.username + ' ' + Math.floor((Date.now() - new Date(this.props.rowData.time).getTime()) / 60000) + ' minute(s) ago '} </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={[{position: 'absolute', right: 5}, {flexDirection: 'row'}]}>
            {this.props.rating}
            {down}
            {up}
          </View>
        </View>
      </View>
    )
  }
})


// var TabBarExample = React.createClass({
//   statics: {
//     title: '<TabBarIOS>',
//     description: 'Tab-based navigation.',
//   },
//
//   displayName: 'TabBarExample',
//
//   getInitialState: function() {
//     return {
//       selectedTab: 'redTab',
//       notifCount: 0,
//       presses: 0,
//     };
//   },
//
//   _renderContent: function(color: string, pageText: string, num?: number) {
//     return (
//       <View style={[styles.tabContent, {backgroundColor: color}]}>
//         <Text style={styles.tabText}>{pageText}</Text>
//         <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
//       </View>
//     );
//   },
//
//   viewStyle() {
//     return {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     }
//   },
//
//   render: function() {
//
//     <Swiper
//       loop={false}
//       index={1}
//       showsPagination={false}>
//       <View style={{height: height*19/40}}>
//         <Right location={this.state.location} refresh={this.refresh} />
//       </View>
//       <View style={{height: height*19/40}}>
//         <Feed location={this.state.location} region={this.state.region} changeRegion={this.changeRegion} markers={this.state.markers} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh} pokemonList={this.state.pokemonList} filter={this.filter}/>
//       </View>
//       <View style={this.viewStyle()}>
//         <TitleText label="Right" />
//       </View>
//     </Swiper>
//
//     return (
//       <TabBarIOS
//         unselectedTintColor="yellow"
//         tintColor="white"
//         barTintColor="black">
//         <TabBarIOS.Item
//           title="Blue Tab"
//           icon={require('./pokeball.png')}
//           selected={this.state.selectedTab === 'blueTab'}
//           onPress={() => {
//             this.setState({
//               selectedTab: 'blueTab',
//             });
//           }}>
//           {this._renderContent('#414A8C', 'Blue Tab')}
//         </TabBarIOS.Item>
//         <TabBarIOS.Item
//           systemIcon="history"
//           badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
//           selected={this.state.selectedTab === 'redTab'}
//           onPress={() => {
//             this.setState({
//               selectedTab: 'redTab',
//               notifCount: this.state.notifCount + 1,
//             });
//           }}>
//           {this._renderContent('#783E33', 'Red Tab', this.state.notifCount)}
//         </TabBarIOS.Item>
//         <TabBarIOS.Item
//           icon={require('./pokeball.png')}
//           selectedIcon={require('./img/navigation2.png')}
//           renderAsOriginal
//           title="More"
//           selected={this.state.selectedTab === 'greenTab'}
//           onPress={() => {
//             this.setState({
//               selectedTab: 'greenTab',
//               presses: this.state.presses + 1
//             });
//           }}>
//           {this._renderContent('#21551C', 'Green Tab', this.state.presses)}
//         </TabBarIOS.Item>
//       </TabBarIOS>
//     );
//   },
//
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
    paddingTop: 8,
    paddingBottom: 8,
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
  blue: {
    top: 260,
    left: 18,
    position: 'absolute',
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'white',
    margin: 50,
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
