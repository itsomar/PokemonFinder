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
const timer = require('react-native-timer');

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
      <View style={{
          flex: 1,
          backgroundColor: '#1F1F1F'
        }}>
      <Image source={require('./ditto_b.png')} style={styles.backgroundImage}>
        <View style={{
            flex: 1
          }}>
        <StatusBar hidden={true} />
        <View style={{flexDirection: 'row', left: 7*width/12, top: height/9}}>
          <Text style={{fontSize: 60*height/736, marginBottom: 5*height/736, color: "white"}}>Ditto</Text>
        </View>
        <View style={{flexDirection: 'row', left: 9*width/24, top: height/9}}>
          <Text style={{fontSize: 30*height/736, marginBottom: 5*height/736, color: "#F5C114"}}>Pokemon Finder</Text>
        </View>
        <Text style={{color: '#a9a9a9', top: 3*height/24, left: 8*width/12, width: 7*width/12}}>Please sign in</Text>
          <TextInput
            style={{backgroundColor: 'white',
                        height: 30*height/736,
                        paddingTop: 8*height/736,
                        paddingBottom: 8*height/736,
                        textAlign: "center",
                        width: 8*width/12,
                        left: 5*width/12,
                        top: 3*height/24
                      }}
            placeholder="Username"
            onChangeText={(username) => this.setState({username})} value={this.state.username}
          />
          <TextInput
            style={{backgroundColor: 'white',
                        height: 30*height/736,
                        paddingTop: 8*height/736,
                        paddingBottom: 8*height/736,
                        textAlign: "center",
                        width: 6*width/12,
                        left: 6*width/12,
                        top: 3*height/24
                      }}
            placeholder="Password"
            onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}
          />
        <TouchableOpacity onPress={this.submit}
          style={{backgroundColor: '#FF585B',
            paddingTop: 8*height/736,
            paddingBottom: 8*height/736,
            width: 5*width/12,
            left: 7*width/12,
            top: 3*height/24
          }}>
            <Text style={{
              textAlign: 'center',
              fontSize: 16*height/736,
              color: 'white'
            }}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor: '#2167E3',
                      paddingTop: 8*height/736,
                      paddingBottom: 8*height/736,
                      width: 3*width/12,
                      left: 8*width/12,
                      top: 3*height/24
                    }} onPress={this.register}>
            <Text style={styles.buttonLabel2}>Register</Text>
          </TouchableOpacity>
          <Text style = {{color: "white", textAlign: "center", fontSize: 20, top: 3*height/24, left: 7*width/12, width: 3*width/12}}>{this.state.message}</Text>
      </View>
    </Image>
  </View>

    )
  }
})

var Foo = React.createClass({

  getInitialState() {
    return {
      showMsg: false
    }
  },

  componentWillUnmount() {
    timer.clearTimeout(this);
  },

  showMsg() {
    this.setState({showMsg: true}, () => timer.setTimeout(
      this, 'hideMsg', () => this.setState({showMsg: false}), 5000
    ));
  },

  render() {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => requestAnimationFrame(() => this.showMsg())}>
          <Text>Press Me</Text>
        </TouchableOpacity>
        {this.state.showMsg ? (
          <Text>Hello!!</Text>
        ) : (
          null
        )}
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
        <Text style={{color: '#FF585B'}}>{this.state.message}</Text>
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
          <Text style={{fontSize: 40*height/736, marginBottom: 5*height/736, backgroundColor: 'rgba(0,0,0,0)'}}>Poké</Text>
          <Text style={{fontSize: 40 *height/736, marginBottom: 5*height/736, backgroundColor: 'rgba(0,0,0,0)', color: '#FF585B'}}>Finder</Text>
        </View>
        <Text style={{backgroundColor: 'rgba(0,0,0,0)'}}>{this.props.username} | {this.props.team}</Text>
        {teamImg}

        <TouchableHighlight onPress={this.props.scrollBy.bind(null, 0)} style={{height: height*50/736, width: width*100/414, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'black'}}>Settings</Text>
          </View>
        </TouchableHighlight>
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
      id: false,
      navigated: false,
      selectedTab: 'redTab',
      notifCount: 0,
      presses: 2,
      presses2: 0,
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
      teamfeed: [],
      modalVisible: true,
      location: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015
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
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          },
          location: {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015
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
          latitudeDelta: 0.015,
          longitudeDelta: 0.015
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

    var that = this
    fetch('http://localhost:3000/gymfeed?longitude=' + this.state.location.longitude + "&latitude=" + this.state.location.latitude)
    .then((feed) => feed.json())
    .then((feedJson) => {
      console.log("IN CURRENT GYMFEED ", feedJson);
      console.log(feedJson);
      if (feedJson.success) {
        var reversefeed = feedJson.feed.reverse();
        var teamfeed = feedJson.feed.reverse().filter(function(item) {
          return item.team === that.state.team
        })

        // console.log("FROM MONGO", reversefeed);
          // console.log("ENTERING ELSE ALL", reversefeed);
          this.setState({
            gymmarkers: reversefeed,
            teamfeed: teamfeed
          })
        }
      }).catch((err) => console.log(err))
    // fetch('http://localhost:3000/gymfeed?longitude=' + lng + "&latitude=" + lat)
    // .then((feed) => feed.json())
    // .then((feedJson) => {
    //   // console.log("Gym feed: ", feedJson)
    //   if (feedJson.success) {
    //     console.log("TEAM FEED BITCH111", teamfeed)
    //     var mapfeed = feedJson.feed.reverse()
    //     // console.log("MAP FEED BITCH111", mapfeed)
    //     // var teamfeed = mapfeed.filter(function(item) {
    //     //   return item.team === this.state.team
    //     // })
    //     // console.log("TEAM FEED BITCH", teamfeed)
    //     this.setState({
    //       gymmarkers: mapfeed
    //     })
    //     console.log("STATE BITCH MAIN", this.state.gymmarkers, "STATE BITCH FEEDDD", this.state.teamfeed )
    //   }
    // })
    // .catch(console.log)

    fetch('http://localhost:3000/feed?longitude=' + lng + "&latitude=" + lat)
    .then((feed) => feed.json())
    .then((feedJson) => {
      // console.log("Post feed LOOKKKK: ", feedJson)
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

  popup(state, id) {
    if(state) {
      this.setState({
        navigated: true,
        id: id
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
      return Alert.alert('Please enter a valid pokémon name');
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

  scrollBy2(n) {
    var scrollOffset = n - this.getSwiperIndex2();
    if (this.scroll && scrollOffset !== 0) {
      // console.log("[ETHAN DEBUG] now scrolling ", scrollOffset)
      this.scroll(scrollOffset);
      this.setState({
        presses2: this.state.presses2 + scrollOffset
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

  getSwiperIndex2() {
    if (typeof this.swiper !== 'undefined') {
      return this.swiper.state.index;
    }
    return 0;
  },



  render() {

    var index2 = this.state.presses2
    var index = this.state.presses;
    var col1 = 'grey';
    var col2 = 'grey';
    var col3 = 'grey';
    if (this.state.presses === 1) {
      col1 = 'black'
    } else if (this.state.presses === 2) {
      col2 = 'black'
    } else if(this.state.presses === 3) {
      col3 = 'black'
    }
              // selectedIcon={require('./img/navigation2.png')}
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    var modal = null
    //MAKE THIS WORK BELOW!!


    // if(this.state.navigated && this.state.id) {
    //   var idp = this.state.markers.filter(function(item) {
    //     return item._id === this.state.id
    //   })
    //   var navpoke = idp[0]
    //   console.log("is modal visible: ", this.state.modalVisible)
    //   var modal = (
    //     <Modal
    //       animationType={"slide"}
    //       transparent={false}
    //       visible={this.state.modalVisible}
    //       onRequestClose={() => {alert("Modal has been closed.")}}
    //       >
    //       <View style={{height: height*215/320}}>
    //         <View style={[styles.containerAuto, {borderColor: '#d3d3d3', borderTopWidth: 1}]}>
    //           <View>
    //             {(Object.keys(navpoke).length !== 0) ?
    //             <View style={{justifyContent: 'center', alignItems: 'center'}}>
    //               <Image source={{uri: 'http://localhost:3000/images/'+navpoke.pokemon.toLowerCase()+'.png'}}
    //                        style={{width: 300*width/414, height: 300*height/736, marginTop: 10}} />
    //                 <View style={{flexDirection: 'row'}}>
    //                   <Text style={{fontWeight: 'bold', fontSize: 20}}>Name: </Text><Text style={{fontSize: 20}}>Posted by: {navpoke.user.username}</Text>
    //                 </View>
    //             </View>
    //           : <View>
    //             </View>
    //           }
    //           </View>
    //         </View>
    //
    //         <TouchableHighlight style={[styles.button, styles.buttonBlue]} onPress={() => {
    //           this.setModalVisible(!this.state.modalVisible)
    //         }}>
    //           <Text style={styles.buttonLabel2}>Cancel</Text>
    //         </TouchableHighlight>
    //       </View>
    //   </Modal>
    //   )
    // }
    // else {
    //   var modal = null
    // }

    if(!this.state.filtered) {
      var filterbutton = (
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
      )
    }
    else {
      var filterbutton = (
        <TouchableOpacity
          style={{
            justifyContent: "center",
            backgroundColor: "#FF585B",
            paddingTop: 5*height/736,
            paddingBottom: 5*height/736,
          }}
          onPress={this.all}
        >
          <Text style={{
            height: 20*height/736,
            width: 54*width/414,
            color: "white",
            textAlign: "center",
            marginRight: 1*height/736}}>
          All</Text>
        </TouchableOpacity>
      )
    }

    if(index === 2) {
      var searchbar = (
        <View style={{flexDirection: 'row', position: 'absolute', top: 0, zIndex: 999}}>
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
            placeholder='Search for a specific Pokémon'
            value={this.state.pokemon}
          />
        {filterbutton}
        </View>
      )
    } else {
      searchbar = null
    }

    return (
      <View>
        {modal}
        {searchbar}
        <View style={{height: height*141/320}}>
          <Map location={this.state.location} scrollBy2={this.scrollBy2} index={this.getSwiperIndex()} idpoke={this.state.filteredOne.id} region={this.state.region} changeRegion={this.changeRegion} chosen={this.state.chosen} markers={this.state.markers} gymmarkers={this.state.gymmarkers} refresh={this.refresh} pokemonList={this.state.pokemonList} pokeNames={this.state.pokeNames} filter={this.filter}/>
        </View>
        <View style={{height: height*158/320}}>
          <Swiper
            loop={false}
            index={2}
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
            <View style={{width: width, height: height*158/320}}>
              <Settings/>
            </View>
            <View style={{height: height*158/320}}>
              <Profile scrollBy={this.scrollBy} username={this.state.username} team={this.state.team} logout={this.logout}/>
            </View>
            <View style={{height: height*158/320}}>
              <Swiper
                loop={false}
                index={0}
                horizontal={false}
                showsPagination={false}
                onMomentumScrollEnd={function(e, state, context) {
                  this.setState({
                    presses2: state.index
                  });
                }.bind(this)}
                ref={function(swiper) {
                  if (swiper !== null) {
                    this.swiper = swiper;
                    this.scroll = swiper.scrollBy2;
                  }
                }.bind(this)}>
                <View style={{height: height*158/320}}>
                  <Feed popup={this.popup} location={this.state.location} chosen={this.state.chosen} idpoke={this.state.filteredOne.id} region={this.state.region} changeRegion={this.changeRegion} markers={this.state.markers} feed={ds.cloneWithRows(this.state.markers)} refresh={this.refresh} pokemonList={this.state.pokemonList} pokeNames={this.state.pokeNames} filter={this.filter}/>
                </View>
                <View style={{height: height*158/320}}>
                  <Foo/>
                </View>
              </Swiper>
            </View>
            <View style={{height: height*158/320}}>
              <GymFeed location={this.state.location} team={this.state.team} region={this.state.region} changeRegion={this.changeRegion} gymmarkers={this.state.gymmarkers} feed={ds.cloneWithRows(this.state.teamfeed)} refresh={this.refresh} filter={this.filter}/>
            </View>
          </Swiper>
        </View>
        <View style={{width: width, height: height*50/736, flexDirection: 'row'}}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 5, backgroundColor: col1}} onPress={this.scrollBy.bind(null, 1)}>
            <Image source={require('./profile.png')}
              style={{width: 20, height: 20}} />
            <Text style={{color: 'white'}}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 5, backgroundColor: col2}} onPress={this.scrollBy.bind(null, 2)}>
            <Image source={require('./pokeballnav.png')}
              style={{width: 20, height: 20}} />
            <Text style={{color: 'white'}}>Pokémon Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 5, backgroundColor: col3}} onPress={this.scrollBy.bind(null, 3)}>
            <Image source={require('./pokegym.png')}
              style={{width: 20, height: 20}} />
            <Text style={{color: 'white'}}>Gym Feed</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
})

var Settings = React.createClass({

  render() {
    return (
      <View style={{backgroundColor: '#f5fcff', flex: 1, borderTopWidth: 1, borderColor: '#d3d3d3', alignItems: 'center'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 40*height/736, marginBottom: 5*height/736, backgroundColor: 'rgba(0,0,0,0)'}}>Settings</Text>
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
      filterpoke: true,
      filtergym: true,
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
      return Alert.alert('Please enter a valid pokémon name');
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
    console.log(this.state.filterpoke)
    if(this.state.filterpoke) {
      this.setState({
        filterpoke: false,
      })
    }
    else if(!this.state.filterpoke) {
      this.setState({
        filterpoke: true,
      })
    }
  },

  filtergym() {
    console.log(this.state.filtergym)
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
      var team = gymmarker.user.team.toLowerCase()
      return (<MapView.Marker
        coordinate={{
          latitude: parseFloat(gymmarker.location.latitude),
          longitude: parseFloat(gymmarker.location.longitude)
        }}
        title={"Gym Request"}
        key={'gym-' + i}
        description={gymmarker.message}
        image={{uri: 'http://localhost:3000/images/small_'+team+'.png'}}
      />)
    })
    var all = [];
    var poke;
    var gym;
    if (this.state.filterpoke) {
      poke = 'rgba(0,0,0,0)'
      all = all.concat(pokeballs)
    } else {
      poke = 'rgba(0,0,0,0.5)'
    }
    if (this.state.filtergym) {
      gym = 'rgba(0,0,0,0)'
      all = all.concat(gyms)
    } else {
      gym = 'rgba(0,0,0,0.5)'
    }
      var widthUnit = width / 414;

      var pokebutton = (
        <TouchableOpacity onPress={this.filterpoke} style={{width: 60, justifyContent: 'center', alignItems: 'center', height: height*50/736, width: width*50/414, top: 276*height/736,
        left: 44, position: 'absolute', backgroundColor: poke, borderWidth: 1}}>
          <Image source={require('./ballbutton.png')} style={{width: width*60/414, height: height*60/736}}/>
        </TouchableOpacity>
        )

      var gymbutton = (
        <TouchableOpacity onPress={this.filtergym} style={{width: 60, justifyContent: 'center', alignItems: 'center', height: height*50/736, width: width*50/414, top: 276*height/736,
        left: 89, position: 'absolute', backgroundColor: gym, borderWidth: 1}}>
          <Image source={require('./gymbutton.png')} style={{width: width*35/414, height: height*35/736}}/>
        </TouchableOpacity>
        )

      if (this.props.location.latitude === this.props.region.latitude && this.props.location.longitude === this.props.region.longitude) {
        look = 'rgba(0,0,0,0)'
      } else {
        look = 'rgba(0,0,0,0.5)'
      }

      var navbutton = (
        <TouchableOpacity style={[styles.blue, {width: width*50/414, height: height*50/736, borderWidth: 1, backgroundColor: look}]} onPress={this.nav}>
          <Image source={require('./location.png')} style={{width: width*30/414, height: height*25/736}}/>
        </TouchableOpacity>
      )

      var pokepost = (
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
          <View style={{height: height*215/320}}>
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
                  placeholder='Which Pokémon did you find?'
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
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image source={{uri: 'http://localhost:3000/images/'+this.state.pokemonObj.name.toLowerCase()+'.png'}}
                           style={{width: 300*width/414, height: 300*height/736, marginTop: 10}} />
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold', fontSize: 20}}>Name: </Text><Text style={{fontSize: 20}}>{this.state.pokemonObj.name}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold', fontSize: 20}}>No: </Text><Text style={{fontSize: 20}}>{this.state.pokemonObj.number}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold', fontSize: 20}}>Type: </Text><Text style={{fontSize: 20}}>{this.state.pokemonObj.types}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold', fontSize: 20}}>Rarity: </Text><Text style={{fontSize: 20}}>{this.state.pokemonObj.rarity}</Text>
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
      </Modal>
      )

      var gympost = (
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible2}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >

          <View style={{height: height*215/320}}>
            <GymPostModal location={this.props.location} refresh={this.props.refresh} setModalVisible={this.setModalVisible2} modalVisible={this.state.modalVisible2}/>

            <TouchableHighlight style={[styles.button, styles.buttonBlue]} onPress={() => {
              this.setModalVisible2(!this.state.modalVisible2)
            }}>
              <Text style={styles.buttonLabel2}>Cancel</Text>
            </TouchableHighlight>

          </View>

        </Modal>
      )

      if(this.props.index === 2) {
        var post = pokepost
      }
      else if(this.props.index === 3) {
        var post = gympost
      }
      else {
        var post = pokepost
      }

      var pokepostbutton = (

        <TouchableHighlight onPress={() => {this.setModalVisible(!this.state.modalVisible)}} style={[{height: height*50/736, width: width*100/414, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}, styles.post]}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'black'}}>Pokémon</Text>
            <Text style={{color: 'black'}}>Post</Text>
          </View>
        </TouchableHighlight>
      )
      var gympostbutton = (
        <TouchableHighlight onPress={() => {this.setModalVisible2(!this.state.modalVisible2)}} style={[{height: height*50/736, width: width*100/414, borderWidth: 1, justifyContent: 'center', alignItems: 'center'}, styles.post]}>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: 'black'}}>Gym</Text>
            <Text style={{color: 'black'}}>Request</Text>
          </View>
        </TouchableHighlight>
      )


      if(this.props.index === 2) {
        var postbutton = pokepostbutton
      }
      else if(this.props.index === 3) {
        var postbutton = gympostbutton
      }
      else if(this.props.index === 1) {
        var postbutton = null
      }
      else {
        var postbutton = pokepostbutton
      }
        // width: heightUnit - 10, height: heightUnit - 1, top: 250*height/736,
        // left: 0, position: 'absolute', backgroundColor: gym}}
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
        {navbutton}
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
    <View style={[styles.containerAuto, {borderColor: '#d3d3d3', borderTopWidth: 1, flexDirection: 'row'}]}>

         <TextInput
           style={[styles.autocomplete, {textAlign: "center", borderColor: '#d3d3d3', borderWidth: 1}]}
           placeholder="Optional Text"
           maxLength={45}
           onChangeText={(message) => this.setState({message})} value={this.state.message}
         />
          <TouchableOpacity
          style={[styles.button, styles.buttonRed, {height: 30*height/736, width: 53, justifyContent: 'center', alignItems: 'center'}]}
          onPress={this.post}
          >
            <Text style={styles.buttonLabel}>Send</Text>
          </TouchableOpacity>
          <Image source={require('./001.png')}
              style={{width: 50, height: 50*height/736, marginTop: 5}} />

    </View>
    )
  }
})

var GymPost = React.createClass({

  getInitialState() {
    return {
      selected: false
    }
  },

  selectPost() {

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
  },

  navigated() {
    // this.setState({
    //   navigated: true
    // })
    // this.props.popup(this.state.navigated)
    var url = 'http://maps.apple.com/?q=' + this.props.rowData.location.latitude + ',' + this.props.rowData.location.longitude;
    LinkingIOS.openURL(url);
  },

  render() {
    var widthUnit = width / 414;
    var heightUnit = 55;

    var nav = null
    var white = null
    var mcolor = '#f6f6f6'
    var scolor = 'grey'


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

      var team = this.props.team.toLowerCase()
      console.log("TEAM HEREEEE", team);

    return (
      <View
        style={{
          backgroundColor: mcolor,
          borderColor: '#d3d3d3',
          borderBottomWidth: 1,
          height: heightUnit,
          paddingLeft: 10 * widthUnit
        }}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={this.selectPost}>
            <View style={{flexDirection: 'row'}}>
              <Image source={{uri: 'http://localhost:3000/images/'+team+'.png'}}
              style={{width: 50*widthUnit, height: 50*height/736, marginTop: 5}} />
              <View style={{marginLeft: 10, marginTop: 3}}>
                <Text style={{fontWeight: '600', fontSize: 15}}>{'Gym request ' + getDistanceFromLatLonInMiles(this.props.location.latitude,this.props.location.longitude,this.props.rowData.location.latitude,this.props.rowData.location.longitude).toFixed(1) + ' mile(s) away'}</Text>
                <Text style={{fontWeight: '600', fontSize: 13}}>{Math.floor((Date.now() - new Date(this.props.rowData.time).getTime()) / 60000) + ' minute(s) ago'} </Text>
                <Text style={{fontSize: 11, color: scolor}}>{this.props.rowData.user.username}: "{this.props.rowData.message}"</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{position: 'absolute', right: 0, top: 0, backgroundColor: "rgba(0,0,0,0)", flexDirection: 'row'}}>
          {nav}
        </View>
      </View>
    )
  }
})

var GymFeed = React.createClass({

  getInitialState() {
    var teamfeed = this.props.feed

    return {
      modalVisible: false,
      refreshing: false
    }
  },

  _onRefresh() {
    this.setState({refreshing: true});
    this.props.refresh()
    this.setState({refreshing: false});
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
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        renderRow={(rowData) => {
          var col = 'black';
          var prefix = '';
          return (
            <GymPost rowData={rowData} team={this.props.team} region={this.props.region} location={this.props.location} refresh={this.props.refresh} vote={rowData.vote} pokemonList={this.props.pokemonList} filter={this.props.filter} changeRegion={this.props.changeRegion}/>
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
              onRefresh={this._onRefresh}
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
    this.props.popup(!this.state.navigated, this.props.rowData._id);
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
        var acolor = 'white'
        var mcolor = 'grey'
        var scolor = 'white'
        var nav = (
          <TouchableOpacity onPress={this.navigated} style={{width: heightUnit - 10, height: heightUnit - 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF585B'}}>
            <Triangle width={15*width/414} height={15*height/736} color={'white'} direction={'up'}/>
          </TouchableOpacity>
        )
      }
      else {
        var nav = null
        var white = null
        var mcolor = '#f6f6f6'
        var scolor = 'grey'
        var acolor = 'black'
      }

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
            <Text style={{fontWeight: '600', fontSize: 15, color: acolor}}>{this.props.rowData.pokemon + ' ' + getDistanceFromLatLonInMiles(this.props.location.latitude,this.props.location.longitude,this.props.rowData.location.latitude,this.props.rowData.location.longitude).toFixed(1) + ' mile(s) away'}</Text>
            <Text style={{fontWeight: '600', fontSize: 13, color: acolor}}>{Math.floor((Date.now() - new Date(this.props.rowData.time).getTime()) / 60000) + ' minute(s) ago '}</Text>
            <Text style={{fontSize: 11, color: scolor}}>seen by {this.props.rowData.user.username}</Text>
          </View>
        </TouchableOpacity>
        <View style={{position: 'absolute', right: 0, top: 0, backgroundColor: "rgba(0,0,0,0)", flexDirection: 'row'}}>
          {nav}
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
    width: width/3,
    left: 2*width/3,
    top: 7*height/48
  },
  button2: {
    alignSelf: 'stretch',
    paddingTop: 8*height/736,
    paddingBottom: 8*height/736,
    width: 3*width/12,
    left: 2*width/3,
    top: 57*height/384
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
    fontSize: 16*height/736,
    color: "white"
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
    top: 276*height/736,
    left: -1,
    position: 'absolute',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  post: {
    top: 276*height/736,
    right: 0,
    position: 'absolute'
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'stretch',
  },
  filterautocomplete: {
    alignSelf: 'stretch',
    height: 35*height/736,
    width: width*223/256,
    backgroundColor: '#FFF'
  }
});

AppRegistry.registerComponent('Pokegame', () => Start);
