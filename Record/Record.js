import React from "react"
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Dimensions,
  Alert,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import API from "../Api/api"
import { MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'
import DropDown from "react-native-dropdown-picker";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from 'expo-location';



class RecordList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      second: 0,
      minute: 0,
      hour: 0,
      isStop: false,
      isStart: false,
      userLocation: [],
    }
    // this.getUserInitialLocation = this.getUserInitialLocation.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.recordUserLocation = this.recordUserLocation.bind(this)
  }

  componentDidMount() {
    // this.getUserInitialLocation()
  }

  // async getUserInitialLocation() {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== 'granted') {
  //     Alert.alert('提示', '你需要提供授權才可以使用此功能', [{ text: '確定', onPress: () => { } }])
  //     return;
  //   }
  //   let location = await Location.getCurrentPositionAsync({});
  //   this.setState({ initialLocation: location })
  //   console.log("INITIALLOCATION", this.state.initialLocation)
  //   console.log("LOCATIONARRAY: ", this.state.userLocation)

  // }

  startTimer() {
    let twoMin = false;
    this.setState({ isStart: true })
    const Timer = setInterval(() => {
      if (this.state.isStop) {
        clearInterval(Timer)
        return;
      }
      let Sec = this.state.second;
      let Min = this.state.minute;
      let Hour = this.state.hour;

      Sec++;

      if (Sec == 60) {
        Min++;
        Sec = 0;
        if (Min % 2 == 0) {
          twoMin = true
        }
      }

      if (Min % 2 == 0 && twoMin) {
        this.recordUserLocation()
        twoMin = false;
      }

      if (Min == 60) {
        Hour++;
        Min = 0;
      }


      if (Hour == 24) {
        Hour = 0;
      }

      this.setState({ second: Sec, minute: Min, hour: Hour });
    }, 1000)

  }

  async resetTimer() {
    const date = new Date();
    const record = { 
      locationArr: this.state.userLocation, 
      totalTime: `${this.state.hour < 10 ? '0' + this.state.hour : this.state.hour}:${this.state.minute < 10 ? '0' + this.state.minute : this.state.minute}:${this.state.second < 10 ? '0' + this.state.second : this.state.second}`, 
      date: date.getDate() + '-' + (date.getMonth()+1) + "-" + date.getFullYear()
     }
    await API.storeRecord(record)
    this.setState({ isStop: false, isStart: false })
    this.setState({ second: 0, minute: 0, hour: 0 })
    this.setState({ userLocation: [] })
  }

  async recordUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '你需要提供授權才可以使用此功能', [{ text: '確定', onPress: () => { } }])
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log("REGULARLOCATION: ", location)
    const locationObj = { latitude: location.coords.latitude, longitude: location.coords.longitude }
    this.setState(({ userLocation }) => ({
      userLocation: [...userLocation, locationObj]
    }))

    console.log("LOCATIONARRAY: ", this.state.userLocation)

  }

  render() {
    return (
      <View style={localStyles.container}>
        <MapView
          style={localStyles.MapView}
          region={{
            latitude: this.state.userLocation.length > 0 ? this.state.userLocation[this.state.userLocation.length - 1].latitude : 22.29258,
            longitude: this.state.userLocation.length > 0 ? this.state.userLocation[this.state.userLocation.length - 1].longitude : 114.18247,
            latitudeDelta: this.state.userLocation.length > 0 ? 0.0015 : 0.2222,
            longitudeDelta: this.state.userLocation.length > 0 ? 0.0015 : 0.2221

          }}
          showsUserLocation={true}
        >
          <Polyline
            coordinates={this.state.userLocation}
            strokeColor="#000"
            strokeWidth={2}
          />
        </MapView>
        {this.state.isStart ?
          <View style={localStyles.Timer}>
            {!this.state.isStop ?
              <Text style={localStyles.TimerText}>
                {`
                  ${this.state.hour < 10 ? '0' + this.state.hour : this.state.hour}:${this.state.minute < 10 ? '0' + this.state.minute : this.state.minute}:${this.state.second < 10 ? '0' + this.state.second : this.state.second}
                `}
              </Text>
              :
              <Text style={localStyles.StopText}>
                暫停
              </Text>
            }
          </View>
          : null
        }
        {!this.state.isStart && !this.state.isStop ?
          <TouchableOpacity style={localStyles.startButtonContainer} onPress={() => { this.startTimer(); this.recordUserLocation(); }}>
            <AntDesign name="caretright" size={24} color="white" />
          </TouchableOpacity>
          : null
        }
        {this.state.isStart && !this.state.isStop ?
          <TouchableOpacity style={localStyles.startButtonContainer} onPress={() => { this.setState({ isStop: true }) }}>
            <Ionicons name="pause" size={24} color="white" />
          </TouchableOpacity>
          : null
        }
        {this.state.isStart && this.state.isStop ?
          <>
            <TouchableOpacity style={[localStyles.startButtonContainer, { left: Dimensions.get('window').width * 0.35 }]} onPress={() => { this.resetTimer() }}>
              <Ionicons name="stop" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[localStyles.startButtonContainer, { left: Dimensions.get('window').width * 0.55 }]} onPress={() => { this.setState({ isStop: false }); this.startTimer() }}>
              <AntDesign name="caretright" size={24} color="white" />
            </TouchableOpacity>
          </>
          : null
        }
        <TouchableOpacity style={localStyles.Record} onPress={() => { this.props.navigation.navigate('RecordList')}}>
          <AntDesign name="book" size={20} color="white" />
          <Text style={{color: 'white', marginLeft: 3}}>查看記錄</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  MapView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  startButtonContainer: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(45, 74, 105, 1)',
    position: 'absolute',
    top: Dimensions.get('window').height * 0.65,
    left: Dimensions.get('window').width * 0.45,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Timer: {
    width: '100%',
    height: '10%',
    backgroundColor: 'rgba(45, 74, 105, 1)',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'

  },
  TimerText: {
    color: 'white',
    fontSize: 18,
    marginLeft: -70
  },
  StopText: {
    color: 'white',
    fontSize: 18,
  },
  Record: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    width: 100,
    height: 35,
    borderRadius: 40,
    borderColor: 'white',
    backgroundColor: 'rgba(45, 74, 105, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }


})

export default RecordList;