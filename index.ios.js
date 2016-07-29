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
  TabBarIOS,
  LinkingIOS
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


// MAKES NAVIGATOR WORK
var Start = React.createClass({
  render() {
    return <NavigatorIOS initialRoute={{component: Pokegame, title: "Pokegame"}} style={{flex: 1}} navigationBarHidden={true} />
  }
});

// LOGIN AND REGISTER VIEW
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
        });
        return this.submit()
      }
    })
    .catch(err => console.log(err))
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
        });
      }
      else {
        this.setState({
          message: response.error
        });
      };
    });
  },

  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register"
    })
  },

  render() {
    // console.log('[HOW MANY]')
    // console.log("state upon render", this.state);
    return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Image style={{alignItems: 'center', marginBottom: 30, height: 220, width: 250}} source={require('./pikachu.png')} />
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 40*height/736, marginBottom: 5*height/736}}>Poke</Text><Text style={{fontSize: 40*height/736, marginBottom: 5*height/736, color: '#FF585B'}}>Finder</Text>
      </View>
      <Text style={{color: '#a9a9a9'}}>Please sign in</Text>
      <View style={{width:width*.7}}>
        <TextInput
          style={{height: 30*height/736, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
          placeholder="Username"
          onChangeText={(username) => this.setState({username})} value={this.state.username}
        />
        <TextInput
          style={{height: 30, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
          placeholder="Password"
          onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}
        />
        <TouchableOpacity onPress={this.submit} style={[styles.button, styles.buttonRed]}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
          <Text style={styles.buttonLabel2}>Register</Text>
        </TouchableOpacity>
        <Text>{this.state.message}</Text>
      </View>
    </View>
    )
  }
})

// REGISTER VIEW
var Register = React.createClass({
  getInitialState() {
    return {
      username: "",
      password: "",
      team: "",
      message: "",
      instinctsize: 110,
      mysticsize: 100,
      valorsize: 100,
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

  enlargeInstinct(){
    this.setState({
      instinctsize: 150,
      mysticsize: 80,
      valorsize: 80,
      team: "Instinct",
    });
  },

  enlargeMystic(){
    this.setState({
      mysticsize: 135,
      instinctsize: 90,
      valorsize: 80,
      team: "Mystic",

    })
  },

  enlargeValor(){
    this.setState({
      valorsize: 125,
      instinctsize: 90,
      mysticsize: 80,
      team: "Valor",
    })
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.textBig, {color: '#FF585B'}]}>Register</Text>
        <Text style={{color: 'red'}}>{this.state.message}</Text>
        <View style={{width:width*.7}}>
          <TextInput
            style={{height: 40*height/736, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
            placeholder="Choose a username"
            onChangeText={(text) => this.setState({username: text})} value={this.state.username}
          />
          <TextInput
            style={{height: 40, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
            placeholder="Choose a password"
            onChangeText={(text) => this.setState({password: text})} value={this.state.password} secureTextEntry={true}
          />
          <Text style={[styles.textMed, {color: '#a9a9a9'}]}>Pick your team</Text>

          <View style={{height: 270}}>
            <TouchableOpacity onPress={this.enlargeInstinct}>
              <Image source={{uri: 'http://localhost:3000/images/instinct.png'}} style={{alignSelf: "center", width: width*this.state.instinctsize/414, height: height*this.state.instinctsize/736, marginBottom: 20}}/>
            </TouchableOpacity>

            <View style={{flexWrap: 'wrap', alignSelf: "center", flexDirection:'row', marginBottom: 50 }}>
              <TouchableOpacity onPress={this.enlargeMystic}>
                <Image source={{uri: 'http://localhost:3000/images/mystic.png'}} style={{marginRight: width*35/414, width: width*(this.state.mysticsize-5)/414, height: height*(this.state.mysticsize-5)/736}}/>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.enlargeValor}>
                <Image source={{uri: 'http://localhost:3000/images/valor.png'}} style={{marginLeft: width*35/414, width: width*this.state.valorsize/414, height: height*this.state.valorsize/736}}/>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={this.submit} style={[styles.button, styles.buttonRed]}>
            <Text style={styles.buttonLabel}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.back} style={[styles.button, styles.buttonBlue]}>
            <Text style={styles.buttonLabel2}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});


var Profile = React.createClass({
  render() {
    var teamImg = null;
    if (this.props.team) {
      teamImg = (<Image source={{uri: 'http://localhost:3000/images/'+this.props.team.toLowerCase()+'.png'}}
                        style={{width: 225*width/414, height: 225*height/736, alignItems: 'center'}} />
                )
    }
    return (
      <View style={{backgroundColor: '#f5fcff', flex: 1, borderTopWidth: 1, borderColor: '#d3d3d3', alignItems: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={{fontSize: 40*height/736, marginBottom: 5*height/736, backgroundColor: 'rgba(0,0,0,0)'}}>Poke</Text>
          <Text style={{fontSize: 40 *height/736, marginBottom: 5*height/736, backgroundColor: 'rgba(0,0,0,0)', color: '#FF585B'}}>Finder</Text>
        </View>
        <Text style={{backgroundColor: 'rgba(0,0,0,0)'}}>{this.props.username} | {this.props.team}</Text>
        {teamImg}
        
        <TouchableOpacity onPress={this.props.logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    )
  }
})

// HOME VIEW
var Home = React.createClass({
  getInitialState() {
    return {
      navigated: false,
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 1,
      modalVisible: true,
      username: '',
      team: '',
      filteredOne: {
        on: false,
        id: undefined
      },
      filtered: false,
      pokemonList: [],
      pokeNames: [],
      data: [],
      pokemon: "",
      markers: [],
      gymmarkers: [],
      modalVisible: true,
      location: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.00421
      },
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015
      }
    }
  },

  componentDidMount() {

    fetch('http://localhost:3000/user')
    .then((user) => user.json())
    .then((userJson) => {
      // console.log(userJson);
      if (userJson.success) {
        this.setState({
          username: userJson.user.username,
          team: userJson.user.team
        });
      }
    }).catch((err) => console.log(err));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // console.log("POSITIONYO", position)
        this.refresh(position.coords.longitude, position.coords.latitude)
        this.setState({
          region: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
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

  watchID: (null: ?number),

  refresh(lng, lat) {
    // console.log("Calling refresh...")
    if (!lng) lng = this.state.location.longitude;
    if (!lat) lat = this.state.location.latitude;



    fetch('http://localhost:3000/gymfeed?longitude=' + lng + "&latitude=" + lat)
    .then((feed) => feed.json())
    .then((feedJson) => {
      // console.log("Gym feed: ", feedJson)
      if (feedJson.success) {
        this.setState({
          gymmarkers: feedJson.feed.reverse()
        })
      }
    })
    .catch(console.log)

    fetch('http://localhost:3000/feed?longitude=' + lng + "&latitude=" + lat)
    .then((feed) => feed.json())
    .then((feedJson) => {
      // console.log("Post feed: ", feedJson)
      if (feedJson.success) {
        var that = this;
        // sort the feed chronologically
        var array = feedJson.feed.reverse();

        if(this.state.filteredOne.on === true) {
          // filter for one post
          array = array.filter(function(item) {
            return item._id === that.state.filteredOne.id
          })
        }
        else if(this.state.filtered === true) {
          // filter for a single post
          array = array.filter(function(item) {
            return item.pokemon === that.state.pokemon
          })
        }

        this.setState({
          markers: array
        })
      }
    })
    .catch(console.log)

  },

  popup(state) {
    if(state) {
      this.setState({
        navigated: true
      })
    }
  },

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  },

  onTyping(text) {
    var pokemonComplete = this.state.pokeNames.filter(function (name) {
      return name.toLowerCase().startsWith(text.toLowerCase())
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
      }),
      chosen: null,
      pokemon: ''
    })
    this.refresh()
  },

  filter(pokeList, pokemon, placeholder, id) {
        console.log("POKEMON LIST", this.state.pokemonList);
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
      // console.log('[AM I HERE???]')
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
    // this.refresh()
    setInterval(this.refresh, 6*10*1000);

    var pokemonList = [];
    var pokeNames = [];
    fetch('http://localhost:3000/pokemon')
    .then((pokemon) => pokemon.json())
    .then((pokemonJson) => {
      // console.log(pokemonJson);
      if (pokemonJson.success) {
        for (var i = 0; i < pokemonJson.pokemon.length; i ++) {
          var pokemon = pokemonJson.pokemon[i];
          pokemonList.push(pokemon);
          pokeNames.push(pokemon.name);
        }

        this.setState({
          pokemonList: pokemonList,
          pokeNames: pokeNames
        });
      }
    }).catch((err) => console.log(err));

        console.log("POKEMON LIST", this.state.pokemonList);

  },

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  },

  logout() {
    fetch('http://localhost:3000/logout')
    .then((logout) => logout.json())
    .then((logoutJson) => {
      if (logoutJson.success) {
        AsyncStorage.removeItem('user');
        this.props.navigator.pop();
      }
    }).catch((err) => console.log(err));
  },

  scrollBy(n) {
    var scrollOffset = n - this.getSwiperIndex();
    if (this.scroll && scrollOffset !== 0) {
      // console.log("[ETHAN DEBUG] now scrolling ", scrollOffset)
      this.scroll(scrollOffset);
      this.setState({
        presses: this.state.presses + scrollOffset
      })
    }
    if (typeof this.scroll === "undefined") {
      // console.log("[ETHAN WARN]: scroll() is undefined at this point");
    }
  },

  getSwiperIndex() {
    if (typeof this.swiper !== 'undefined') {
      return this.swiper.state.index;
    }
    return 0;
  },

  render() {

    // console.log("STATE OF HOME", this.state.markers);
    var index = this.state.presses;
    var col1 = 'grey';
    var col2 = 'grey';
    var col3 = 'grey';
    if (this.state.presses === 0) {
      col1 = 'black'
    } else if (this.state.presses === 1) {
      col2 = 'black'
    } else {
      col3 = 'black'
    }
              // selectedIcon={require('./img/navigation2.png')}
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    var modal = null
    if(this.state.navigated) {
      var modal = (
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
        <View style={{marginTop: 22}}>
          <View>
            <Text>Hello World!</Text>

            <TouchableHighlight onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text>Hide Modal</Text>
            </TouchableHighlight>

          </View>
         </View>
      </Modal>
      )
    }
    else {
      var modal = null
    }


    return (
      <View>
        {modal}
        <View style={{flexDirection: 'row', position: 'absolute', top: 0, zIndex: 999}}>
          <TouchableOpacity style={styles.buttonAll} onPress={this.all}>
            <Text style={styles.buttonLabel}>All</Text>
          </TouchableOpacity>
          <AutoComplete
            autoCorrect={false}
            onSelect={this.onTyping}
            onTyping={this.onTyping}
            autoCompleteFontSize={15*height/736}
            autoCompleteTableBorderWidth={1}
            autoCompleteRowHeight={25*height/736}
            autoCompleteTableBackgroundColor='white'
            maximumNumberOfAutoCompleteRows={10}
            style={styles.filterautocomplete}
            suggestions={this.state.data}
            placeholder='Search for a specific Pokemon'
            value={this.state.pokemon}
          />
          <TouchableOpacity
            style={{
              justifyContent: "center",
              backgroundColor: "#FF585B",
              paddingTop: 5*height/736,
              paddingBottom: 5*height/736,
            }}
            onPress={this.filter.bind(this, this.state.pokeNames, this.state.pokemon, null, null)}
          >
            <Text style={{
              height: 20*height/736,
              width: 54*width/414,
              color: "white",
              textAlign: "center",
              marginRight: 1*height/736}}>
            Filter</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: height*141/320}}>
          <Map location={this.state.location} index={this.getSwiperIndex()} idpoke={this.state.filteredOne.id} region={this.state.region} changeRegion={this.changeRegion} chosen={this.state.chosen} markers={this.state.markers} gymmarkers={this.state.gymmarkers} refresh={this.refresh} pokemonList={this.state.pokemonList} pokeNames={this.state.pokeNames} filter={this.filter}/>
        </View>
        <View style={{height: height*158/320}}>
          <Swiper
            loop={false}
            index={1}
            showsPagination={false}
            onMomentumScrollEnd={function(e, state, context) {
              this.setState({
                presses: state.index
              });
            }.bind(this)}
            ref={function(swiper) {
              if (swiper !== null) {
                this.swiper = swiper;
                this.scroll = swiper.scrollBy;
              }
            }.bind(this)}>
            <View style={{height: height*158/320}}>
              <Profile username={this.state.username} team={this.state.team} logout={this.logout}/>
            </View>
            <View style={{height: height*158/320}}>
              <Feed popup={this.popup} location={this.state.location} chosen={this.state.chosen} idpoke={this.state.filteredOne.id} region={this.state.region} changeRegion={this.changeRegion} markers={this.state.markers} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh} pokemonList={this.state.pokemonList} pokeNames={this.state.pokeNames} filter={this.filter}/>
            </View>
            <View style={{height: height*158/320}}>
              <GymFeed location={this.state.location} region={this.state.region} changeRegion={this.changeRegion} gymmarkers={this.state.gymmarkers} feed={ds.cloneWithRows(this.state.gymmarkers)} refresh={this.refresh} filter={this.filter}/>
            </View>
          </Swiper>
        </View>
        <View style={{width: width, height: height*50/736, flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 5, backgroundColor: col1}} onPress={this.scrollBy.bind(null, 0)}>
            <Image source={require('./profile.png')}
              style={{width: 20, height: 20}} />
            <Text style={{color: 'white'}}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 5, backgroundColor: col2}} onPress={this.scrollBy.bind(null, 1)}>
            <Image source={require('./pokeballnav.png')}
              style={{width: 20, height: 20}} />
            <Text style={{color: 'white'}}>Pokemon Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 5, backgroundColor: col3}} onPress={this.scrollBy.bind(null, 2)}>
            <Image source={require('./pokegym.png')}
              style={{width: 20, height: 20}} />
            <Text style={{color: 'white'}}>Gym Feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
})

var Map = React.createClass({

  getInitialState() {
    // pressedpoke: false,
    // pressedgym: false,
    console.log("INDEX HERE", this.props.index)

    return {
      filterpoke: false,
      filtergym: false,
      latitude: this.props.location.latitude,
      longitude: this.props.location.longitude,
      latitudeDelta: this.props.location.latitudeDelta,
      longitudeDelta: this.props.location.longitudeDelta,
      pokemon: '',
      data: [],
      pokemonObj: {},
      modalVisible: false,
      modalVisible2: false
    };
  },
  componentWillReceiveProps(newProps) {
    this.setState(newProps.region)
  },

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  },

  setModalVisible2(visible) {
    this.setState({modalVisible2: visible});
  },

  onSelect(pokemon) {
    var pkIndex = -1;
    for (var i = 0; i < this.props.pokemonList.length; i++) {
      var pkmn = this.props.pokemonList[i]
      // if (pokemon.name.startsWith(this.state.pokemon)) {
      if (pkmn.name === pokemon) {
        pkIndex = i;
        break;
      }
    }
    if (pkIndex !== -1) {
      var pkmn = this.props.pokemonList[pkIndex];
      // console.log('[POKEMONNAME]', pkmn);
      pkmn.types = pkmn.types.toString();
      this.setState({
        pokemon: pokemon,
        pokemonObj: pkmn
      })
    }
  },

  onTyping(text) {
    var pokemonComplete = this.props.pokeNames.filter(function (name) {
      return name.toLowerCase().startsWith(text.toLowerCase())
    })
    // if (this.state.pokeNames.indexOf(text)) {
    //   var pkmn = this.state.pokemonList[this.state.pokeNames.indexOf(text)]
    //   this.setState({
    //     data: pokemonComplete,
    //     pokemon: text,
    //     pokemonObj: pkmn
    //   })
    // } else {
      // console.log("Auto completed pokemon: ", pokemonComplete);
      this.setState({
        data: pokemonComplete,
        pokemon: text
      });
    // }
  },

  post() {
    console.log('AM I FUCKING POSTING??????????????????????????')
    if (this.props.pokeNames.indexOf(this.state.pokemon) === -1) {
      return Alert.alert('Please enter a valid pokemon name');
    }

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
      console.log("[HELLO]WORKING?", postJson);
      if(postJson.success) {
        this.setModalVisible(false);
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

  filterpoke() {
    if(this.state.filterpoke) {
      this.setState({
        filterpoke: false,
      })
    }
    else if(this.state.filterpoke === false) {
      this.setState({
        filterpoke: true,
      })
    }
  },

  filtergym() {
    if(this.state.filtergym) {
      this.setState({
        filtergym: false,
      })
    }
    else if(!this.state.filtergym) {
      this.setState({
        filtergym: true,
      })
    }
},

  modal() {
    this.setModalVisible(!this.state.modalVisible);
  },


  render() {
    // console.log(this.work)

    console.log("CHOSENBRO INSIDE MAP", this.props.chosen);
    var pokeballs = this.props.markers.map(function(marker, i) {

      var timeAgo = ((Date.now() - new Date(marker.time).getTime()) / 60000)
      return (<MapView.Marker
        coordinate={{
          latitude: parseFloat(marker.location.latitude),
          longitude: parseFloat(marker.location.longitude)
        }}
        title={marker.pokemon}
        key={'pokemon-' + i}
        description={Math.floor(timeAgo.toString()) + ' minute(s) ago'}
        image={require('./pokeball.png')}
      />)
    })

    var gyms = this.props.gymmarkers.map(function(gymmarker, i) {
      var timeAgo = ((Date.now() - new Date(gymmarker.time).getTime()) / 60000)
      return (<MapView.Marker
        coordinate={{
          latitude: parseFloat(gymmarker.location.latitude),
          longitude: parseFloat(gymmarker.location.longitude)
        }}
        title={"Gym Request"}
        key={'gym-' + i}
        description={gymmarker.message}
        image={require('./pokegym.png')}
      />)
    })
    var total = pokeballs.concat(gyms)
    var all = pokeballs.concat(gyms)
    var poke;
    var gym;
    if(this.state.filterpoke && this.state.filtergym) {
      var all = total
      var poke = "#000000";
      var gym = "#000000";
    }
    else if(!this.state.filterpoke && !this.state.filtergym) {
      var all = total
      var poke = "#000000";
      var gym = "#000000";
    }
    else if(this.state.filtergym) {
      var all = gyms
      var gym = "#ccc";
    }
    else if(!this.state.filtergym) {
      var all = total
      var gym = "#000000";
    }
    else if(this.state.filterpoke) {
      var all = pokeballs
      var poke = "#ccc";
    }
    else if(!this.state.filterpokeballs) {
      var all = total
      var gym = "#000000";
    }
      var widthUnit = width / 414;

      var pokebutton = (
        <TouchableOpacity onPress={this.filterpoke} style={{width: 60, justifyContent: 'center', alignItems: 'center', height: height*40/736, width: width*40/414, top: 280*height/736,
        left: 58*width/414, position: 'absolute', backgroundColor: poke}}>
          <Image source={require('./pokeball.png')} style={{width: width*35/414, height: height*35/736}}/>
        </TouchableOpacity>
        )

      var gymbutton = (
        <TouchableOpacity onPress={this.filtergym} style={{width: 60, justifyContent: 'center', alignItems: 'center', height: height*40/736, width: width*40/414, top: 280*height/736,
        left: 108*width/414, position: 'absolute', backgroundColor: poke}}>
          <Image source={require('./pokegymnav.png')} style={{width: width*35/414, height: height*35/736}}/>
        </TouchableOpacity>
        )

      var pokepost = (
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
        <View style={{marginTop: 22}}>
          <View style={{height: height*132/320}}>
            <View style={[styles.containerAuto, {borderColor: '#d3d3d3', borderTopWidth: 1}]}>
              <View style={{flexDirection: 'row', position: 'absolute', top: 0, zIndex: 999}}>
                <AutoComplete
                  autoCorrect={false}
                  onSelect={this.onSelect}
                  onTyping={this.onTyping}
                  autoCompleteFontSize={15*height/736}
                  autoCompleteTableBorderWidth={1}
                  autoCompleteRowHeight={height*25/736}
                  maximumNumberOfAutoCompleteRows={10}
                  autoCompleteTableBackgroundColor='white'
                  style={styles.autocomplete}
                  suggestions={this.state.data}
                  placeholder='Which Pokemon did you find?'
                  value={this.state.pokemon}
                />
                <TouchableOpacity
                style={[styles.button, styles.buttonRed, {height: 30*height/736, width: width/7, justifyContent: 'center'}]}
                onPress={this.post}
                >
                  <Text style={styles.buttonLabel}>Enter</Text>
                </TouchableOpacity>
              </View>
              <View>
                {(Object.keys(this.state.pokemonObj).length !== 0) ?
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Image source={{uri: 'http://localhost:3000/images/'+this.state.pokemonObj.name.toLowerCase()+'.png'}}
                           style={{width: 196*width/414, height: 196*height/736}} />
                    <View style={{position: 'absolute', top: 90*height/736, right: 20*width/414}}>
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
                </View>
              : <View>
                </View>
              }
              </View>
            </View>

            <TouchableHighlight style={[styles.button, styles.buttonBlue]} onPress={() => {
              this.setModalVisible(!this.state.modalVisible)
            }}>
              <Text style={styles.buttonLabel2}>Cancel</Text>
            </TouchableHighlight>
          </View>
          </View>
      </Modal>
      )

      var gympost = (
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible2}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 22}}>
          <View style={{height: height*132/320}}>
            <GymPostModal location={this.props.location} refresh={this.props.refresh} setModalVisible={this.setModalVisible2} modalVisible={this.state.modalVisible2}/>

            <TouchableHighlight style={[styles.button, styles.buttonBlue]} onPress={() => {
              this.setModalVisible2(!this.state.modalVisible2)
            }}>
              <Text style={styles.buttonLabel2}>Cancel</Text>
            </TouchableHighlight>

          </View>
         </View>
        </Modal>
      )

      if(this.props.index === 1) {
        var post = pokepost
      }
      else if(this.props.index === 2) {
        var post = gympost
      }
      else {
        var post = pokepost
      }

      var pokepostbutton = (
        <TouchableHighlight onPress={() => {this.setModalVisible(!this.state.modalVisible)}} style={[{height: height*40/736, width: width*100/414, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}, styles.post]}>
          <View style={{flexDirection: 'row'}}>  
            <Text style={{color: 'white', fontWeight: 'bold'}}>Pokemon</Text>
            <Image source={require('./enter.png')} style={{width: width*20/414, height: height*20/736, marginLeft: 1}}/>
          </View>
        </TouchableHighlight>
      )
      var gympostbutton = (
        <TouchableHighlight onPress={() => {this.setModalVisible2(!this.state.modalVisible2)}} style={[{height: height*40/736, width: width*100/414, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}, styles.post]}>
          <View style={{flexDirection: 'row'}}>  
            <Text style={{color: 'white', fontWeight: 'bold'}}>Gym</Text>
            <Image source={require('./enter.png')} style={{width: width*20/414, height: height*20/736, marginLeft: 1}}/>
          </View>
        </TouchableHighlight>
      )

      if(this.props.index === 1) {
        var postbutton = pokepostbutton
      }
      else if(this.props.index === 2) {
        var postbutton = gympostbutton
      }
      else if(this.props.index === 0) {
        var postbutton = null
      }
      else {
        var postbutton = pokepostbutton
      }
        // width: heightUnit - 10, height: heightUnit - 1, top: 250*height/736,
        // left: 8*width/414, position: 'absolute', backgroundColor: gym}}
        //
    return (
      <View style={{flex: 1}}>
        {post}
      <MapView
        style={{flex: 1}}
        onRegionChange={this.onRegionChange}
        region={{latitude: this.state.latitude,
                 longitude: this.state.longitude,
                 latitudeDelta: this.state.latitudeDelta,
                 longitudeDelta: this.state.longitudeDelta}}
        showsUserLocation={true}
      >
      {all}
      </MapView>
      <TouchableOpacity style={[styles.blue, {width: width*40/414, height: height*40/736}]} onPress={this.nav}>
        <Image source={require('./location.png')} style={{width: width*35/414, height: height*35/736}}/>
      </TouchableOpacity>
        {pokebutton}
        {gymbutton}
        {postbutton}
      </View>
    )
  }
})

var GymPostModal = React.createClass({
  getInitialState() {
    return {
      message: ""
    }
  },

  post() {
    // console.log("IN POST GYM")
    fetch('http://localhost:3000/gympost', {
      headers: {
         "Content-Type": "application/json"
      },
      method: 'POST',
      body: JSON.stringify({
        message: this.state.message,
        longitude: this.props.location.longitude,
        latitude: this.props.location.latitude
      })
    })
    .then((post) => post.json())
    .then((postJson) => {
      if(postJson) {
        // console.log("[HELLO GYMMMMMMM]", postJson);
        this.props.refresh();
        this.props.setModalVisible(!this.props.modalVisible)
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
      <View>
         <TextInput
           style={{height: 30, textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}}
           placeholder="Optional Text"
           maxLength={10}
           onChangeText={(message) => this.setState({message})} value={this.state.message}
         />
          <TouchableOpacity
          style={[styles.button, styles.buttonRed, {marginTop: 202}]}
          onPress={this.post}
          >
            <Text style={styles.buttonLabel}>Post Gym</Text>
          </TouchableOpacity>
      </View>
    </View>
    )
  }
})

var GymPost = React.createClass({
  selectPost() {
    // console.log("HEY ROW DATA", this.props.rowData.location)
    this.props.changeRegion(
      { latitude: this.props.rowData.location.latitude,
        longitude: this.props.rowData.location.longitude,
        latitudeDelta: this.props.region.latitudeDelta,
        longitudeDelta: this.props.region.longitudeDelta,
    })
  },

  render() {
    var widthUnit = width / 414;
    var heightUnit = 55;
    return (
      <View
        style={{
          backgroundColor: '#f6f6f6',
          borderColor: '#d3d3d3',
          borderBottomWidth: 1,
          height: heightUnit,
          paddingLeft: 10 * widthUnit
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.selectPost}>
            <View style={{flexDirection: 'row'}}>
              <Image source={require('./pokegymnav.png')}
              style={{width: 50*widthUnit, height: 50*height/736, marginTop: 5}} />
              <View style={{marginLeft: 10, marginTop: 3}}>
                <Text style={{fontWeight: '600', fontSize: 15}}>{'Gym request ' + getDistanceFromLatLonInMiles(this.props.location.latitude,this.props.location.longitude,this.props.rowData.location.latitude,this.props.rowData.location.longitude).toFixed(1) + ' mile(s) away'}</Text>
                <Text style={{fontWeight: '600', fontSize: 13}}>{Math.floor((Date.now() - new Date(this.props.rowData.time).getTime()) / 60000) + ' minute(s) ago'} </Text>
                <Text style={{fontSize: 11, color: 'grey'}}>{this.props.rowData.user.username}: "{this.props.rowData.message}"</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
})

var GymFeed = React.createClass({

  getInitialState() {
    return {
      modalVisible: false
    }
  },

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  },

  render() {
    return (
      <View style={{backgroundColor: '#f5fcff'}}>
        <View style={{width: width, height: height * 158/320}}>
        <ListView
        automaticallyAdjustContentInsets={false}
        enableEmptySections={true}
        dataSource={this.props.feed}
        renderRow={(rowData) => {
          var col = 'black';
          var prefix = '';
          return (
            <GymPost rowData={rowData} region={this.props.region} location={this.props.location} refresh={this.props.refresh} vote={rowData.vote} pokemonList={this.props.pokemonList} filter={this.props.filter} changeRegion={this.props.changeRegion}/>
          )
          }
        } />
        </View>
      </View>
    )
  }
});


var Feed = React.createClass({

  getInitialState() {
    return {
      refreshing: false
    }
  },

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.refresh()
    this.setState({refreshing: false});
  },

  render() {
    return (
      <View style={{backgroundColor: '#f5fcff'}}>
      <View style={{width: width, height: height * 158/320}}>
        <ListView
          automaticallyAdjustContentInsets={true}
          enableEmptySections={true}
          dataSource={this.props.feed}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          renderRow={(rowData) => {
            return (
              <Post rowData={rowData}
                popup={this.props.popup}
                markers={this.props.markers}
                rating={rowData.rating}
                region={this.props.region}
                location={this.props.location}
                refresh={this.props.refresh}
                vote={rowData.vote}
                pokemonList={this.props.pokemonList}
                filter={this.props.filter}
                changeRegion={this.props.changeRegion}
              />
              )
            }
          } />
      </View>
      </View>
    )
  }
});


var Post = React.createClass({
  getInitialState() {
    return ({
      upvoted: (this.props.vote === 'up') || false,
      downvoted: (this.props.vote === 'down') || false,
      selected: 0,
      navigated: false
    })
  },
  componentWillReceiveProps(nextProps) {
        console.log("SELECTED STATE REFRESH", this.state.selected)
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
    console.log("SELECTED STATE", this.state.selected)
    console.log("CURRENT ROW ID", this.props.rowData._id)

    if(!this.state.selected) {
      this.props.changeRegion(
        { latitude: this.props.rowData.location.latitude,
          longitude: this.props.rowData.location.longitude,
          latitudeDelta: this.props.region.latitudeDelta,
          longitudeDelta: this.props.region.longitudeDelta,
      })
      this.setState({
        selected: this.props.rowData._id
      })
    }
    else if (this.state.selected) {
      this.props.changeRegion(
        { latitude: this.props.location.latitude,
          longitude: this.props.location.longitude,
          latitudeDelta: this.props.region.latitudeDelta,
          longitudeDelta: this.props.region.longitudeDelta,
      })
      this.setState({
        selected: 0
      })
    }
    // else if (this.state.selected === this.props.rowData._id) {
    //   this.props.changeRegion(
    //     { latitude: this.props.location.latitude,
    //       longitude: this.props.location.longitude,
    //       latitudeDelta: this.props.region.latitudeDelta,
    //       longitudeDelta: this.props.region.longitudeDelta,
    //   })
    //   this.setState({
    //     selected: 0
    //   })
    // }
    // else if (this.state.selected !== this.props.rowData._id) {
    //   this.setState({
    //     selected: this.props.rowData._id
    //   })
    // }
  },

  navigated() {
    this.setState({
      navigated: true
    })
    this.props.popup(this.state.navigated)
    var url = 'http://maps.apple.com/?q=' + this.props.rowData.location.latitude + ',' + this.props.rowData.location.longitude;
    LinkingIOS.openURL(url);
  },

  render() {
    // Rating
    var rating = null;
    var col = 'black';
    var prefix = '';
    if (this.props.rating > 0) {
      col = "#669966";
      prefix = "+";
    }
    else if (this.props.rating < 0) {
      col = '#FF585B';
    }
    rating = <Text style={{fontSize: 20*height/736, marginRight: 3, color: col, marginTop: 15}}>{prefix + this.props.rating}</Text>

    // Voting
    var downCol = "#FF585B";
    var upCol = "#669966";
    if (this.state.upvoted) {
      upCol = "#ccc";
    }
    if (this.state.downvoted) {
      downCol = "#ccc";
    }
    var widthUnit = width / 414;
    var heightUnit = 55;

    var down = (
      <TouchableOpacity onPress={this.sendVote.bind(this, this.props.rowData._id, 'down')} style={{width: heightUnit - 10, height: heightUnit - 1, justifyContent: 'center', alignItems: 'center', backgroundColor: downCol}}>
        <Triangle width={15*width/414} height={15*height/736} color={'white'} direction={'down'}/>
      </TouchableOpacity>
      )

    var up = (
      <TouchableOpacity onPress={this.sendVote.bind(this, this.props.rowData._id, 'up')} style={{width: heightUnit - 10, height: heightUnit - 1, justifyContent: 'center', alignItems: 'center', backgroundColor: upCol}}>
        <Triangle width={15*width/414} height={15*height/736} color={'white'} direction={'up'}/>
      </TouchableOpacity>
      )

    var nav = null
    var white = null
    var mcolor = '#f6f6f6'
    var scolor = 'grey'
    // console.log("ROWDATA BEOFRE RENDER", this.props.feed.dataBlob.s1)
    console.log("markers BEOFRE renderyoooo", this.props.markers)
    console.log("SELCTED state IN render", this.state.selected);

      if(this.state.selected) {
        var mcolor = '#5C5C5C'
        var scolor = 'white'
        var nav = (
          <TouchableOpacity onPress={this.navigated} style={{width: heightUnit - 10, height: heightUnit - 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#5C5C5C'}}>
            <Image source={require('./img/navigation2.png')} style={{width: width*35/414, height: height*35/736}}/>
          </TouchableOpacity>
        )
      }
      else if (!this.state.selected) {
        var nav = null
        var white = null
        var mcolor = '#f6f6f6'
        var scolor = 'grey'
      }


    // Everything lmao

    return (
      <View
        style={{
          backgroundColor: mcolor,
          borderBottomWidth: 1,
          borderColor: '#d3d3d3',
          paddingLeft: 10 * widthUnit,
          height: heightUnit,
          flexDirection: 'row'
        }}>
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={this.selectPost}>
          <Image source={{uri: 'http://localhost:3000/emojis/'+this.props.rowData.pokemon.toLowerCase()+'.png'}} style={{width: 50*widthUnit, height: 50*height/736, marginTop: 5}} />
          <View style={{marginLeft: 10*widthUnit, marginTop: 3*height/736}}>
            <Text style={{fontWeight: '600', fontSize: 15}}>{this.props.rowData.pokemon + ' ' + getDistanceFromLatLonInMiles(this.props.location.latitude,this.props.location.longitude,this.props.rowData.location.latitude,this.props.rowData.location.longitude).toFixed(1) + ' mi away'}</Text>
            <Text style={{fontWeight: '600', fontSize: 13}}>{Math.floor((Date.now() - new Date(this.props.rowData.time).getTime()) / 60000) + ' minute(s) ago '}</Text>
            <Text style={{fontSize: 11, color: scolor}}>seen by {this.props.rowData.user.username}</Text>
          </View>
        </TouchableOpacity>
        <View style={{position: 'absolute', right: 0, top: 0, backgroundColor: "rgba(0,0,0,0)", flexDirection: 'row'}}>
          {nav}
          {rating}
        </View>
      </View>
    )
  }
});


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
    fontSize: 20*height/736,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5*height/736,
  },
  textBig: {
    fontSize: 36*height/736,
    textAlign: 'center',
    margin: 10,
  },
  textMed: {
    fontSize: 20*height/736,
    textAlign: 'center',
    margin: 10,
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 8*height/736,
    paddingBottom: 8*height/736,
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
    height: 24*height/736
  },
  buttonAll: {
    backgroundColor: '#FF585B',
    paddingTop: 5*height/736,
    paddingBottom: 5*height/736,
    paddingLeft: 10*width/414,
    paddingRight: 10*width/414
  },
  buttonSettings: {
    backgroundColor: '#FF585B',
    paddingTop: 5*height/736,
    paddingBottom: 5*height/736,
    paddingLeft: 10*width/414,
    paddingRight: 10*width/414
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16*height/736,
    color: 'white',
  },
  buttonLabel2: {
    textAlign: 'center',
    fontSize: 16*height/736
  },
  autocomplete: {
    alignSelf: 'stretch',
    height: 30*height/736,
    width: width*6/7,
    backgroundColor: '#FFF',
  },
  containerAuto: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20*height/736,
    textAlign: 'center'
  },
  blue: {
    top: 280*height/736,
    left: 8*width/414,
    position: 'absolute',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  post: {
    top: 280*height/736,
    right: 8*width/414,
    position: 'absolute',
  },
  absoluteb: {
    top: 260*height/736,
    left: 8*width/414,
    position: 'absolute'
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
    height: 30*height/736,
    width: width*199/256,
    backgroundColor: '#FFF'
  }
});

AppRegistry.registerComponent('Pokegame', () => Start);
