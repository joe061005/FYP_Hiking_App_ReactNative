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
import DateTimerPicker from '@react-native-community/datetimepicker'
import { backgroundColor, color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";



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
      modal: false,
      name: '',
      email: '',
      endTime: new Date(),
      endDate: new Date(),
      trailName: '',
      data: {},
      startSending: false

    }
    // this.getUserInitialLocation = this.getUserInitialLocation.bind(this)
    this.startTimer = this.startTimer.bind(this)
    this.resetTimer = this.resetTimer.bind(this)
    this.recordUserLocation = this.recordUserLocation.bind(this)
    this.checkForm = this.checkForm.bind(this)
    this.Message = this.Message.bind(this)
    this.start = this.start.bind(this)
    this.getuserInfo = this.getuserInfo.bind(this)
    this.sendUserLocation = this.sendUserLocation.bind(this)
    this.stop = this.stop.bind(this)
  }

  componentDidMount() {
    this.getuserInfo()
  }

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
      date: date.getDate() + '-' + (date.getMonth() + 1) + "-" + date.getFullYear()
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

  checkForm() {
    if (!this.state.name || !this.state.email || !this.state.trailName) {
      this.Message('你需要輸入所有資料')
      return false
    }

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/
    if (!emailRegex.test(this.state.email)) {
      this.Message('請輸入正確的電郵地址')
      return false
    }


    var datetime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(),
      this.state.endTime.getHours(), this.state.endTime.getMinutes(), this.state.endTime.getSeconds())

    console.log("CURRENT: ", new Date())
    console.log("END: ", datetime.toUTCString())

    if (new Date().getTime() > datetime.getTime()) {
      this.Message('無效的日期或時間')
      return false
    }

    return true;
  }

  Message(msg) {
    Alert.alert('注意', msg, [{ text: '確定' }])
  }

  async start() {
    if (!this.checkForm()) {
      return
    }
    this.setState({ modal: false })
    this.setState({ startSending: true })


  }

  async sendUserLocation() {

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('提示', '你需要提供授權才可以使用此功能', [{ text: '確定', onPress: () => { } }])
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    var datetime = new Date(this.state.endDate.getFullYear(), this.state.endDate.getMonth(), this.state.endDate.getDate(),
      this.state.endTime.getHours(), this.state.endTime.getMinutes(), this.state.endTime.getSeconds())

    const props = {
      email: this.state.email,
      username: this.state.data.username,
      contactName: this.state.name,
      location: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      trailName: this.state.trailName,
      time: datetime
    }

    await API.sendUserLocation(props).then(([code, data, header]) => {
      if (code == '200') {
        console.log('SENT')
      }
    })

  }

  async getuserInfo() {
    const login_data = await API.userInfo();
    this.setState({ data: login_data })
    console.log("user_data:", this.state.data)
  }

  async stop(){
     this.setState({startSending: false})
  }

  render() {
    return (
      <View style={localStyles.container}>
        {!this.state.modal ?
          <MapView
            style={localStyles.MapView}
            region={{
              latitude: this.state.userLocation.length > 0 ? this.state.userLocation[this.state.userLocation.length - 1].latitude : 22.29258,
              longitude: this.state.userLocation.length > 0 ? this.state.userLocation[this.state.userLocation.length - 1].longitude : 114.18247,
              latitudeDelta: this.state.userLocation.length > 0 ? 0.0035 : 0.2222,
              longitudeDelta: this.state.userLocation.length > 0 ? 0.0035 : 0.2221

            }}
            showsUserLocation={true}
          >
            <Polyline
              coordinates={this.state.userLocation}
              strokeColor="#000"
              strokeWidth={2}
            />
          </MapView>
          :
          null
        }
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
        <TouchableOpacity style={localStyles.Record} onPress={() => { this.props.navigation.navigate('RecordList') }}>
          <AntDesign name="book" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 3 }}>查看記錄</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[localStyles.Message, this.state.startSending ? { backgroundColor: '#f8344c' } : null]} onPress={() => { this.setState({ modal: true }) }}>
          <AntDesign name="Safety" size={20} color="white" />
          <Text style={{ color: 'white', marginLeft: 3 }}>安全出遊</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({ modal: false })
          }}
        >
          <ScrollView style={localStyles.ModalContainer}>
            <View style={localStyles.filterContainer}>
              <View style={localStyles.TitleBarContainer}>
                <View>
                  <TouchableOpacity onPress={() => { this.setState({ modal: false }) }}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>安全出遊</Text>
                </View>
                <View>
                  {!this.state.startSending ?
                    < TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.start() }}>
                      <Text style={{ fontSize: 18, marginLeft: 5 }}>啓用</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.stop() }}>
                      <Text style={{ fontSize: 18, marginLeft: 5, color: 'red' }}>停止</Text>
                    </TouchableOpacity>

                  }
                </View>
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>此功能可以讓你的聯絡人知道你所在的位置，以確保遠足安全。在有網絡的情況下，系統會每十分鐘發送電郵給你的聯絡人。</Text>
              </View>

              <Text style={localStyles.titleTextStyle}>聯絡人的名稱</Text>
              <View style={localStyles.inputFieldContainer} pointerEvents={this.state.startSending ? 'none' : 'auto'}>
                <TextInput
                  style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
                  value={this.state.name}
                  autoCorrect={false}
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  placeholder='聯絡人的名稱'
                  onChangeText={(name) => this.setState({ name })}
                  selectTextOnFocus={true}

                />
              </View>

              <Text style={localStyles.titleTextStyle}>聯絡人的電郵地址</Text>
              <View style={localStyles.inputFieldContainer} pointerEvents={this.state.startSending ? 'none' : 'auto'}>
                <TextInput
                  style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
                  value={this.state.email}
                  autoCorrect={false}
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  placeholder='聯絡人的電郵地址'
                  onChangeText={(email) => this.setState({ email })}
                  selectTextOnFocus={true}
                />
              </View>
              <Text style={localStyles.titleTextStyle}>預計結束日期</Text>
              <View pointerEvents={this.state.startSending ? 'none' : 'auto'}>
                <DateTimerPicker
                  value={this.state.endDate}
                  mode="date"
                  display="calendar"
                  onChange={(event, endDate) => { this.setState({ endDate }) }}
                  style={{ height: 50 }}
                />
              </View>
              <Text style={localStyles.titleTextStyle}>預計結束時間</Text>
              <View pointerEvents={this.state.startSending ? 'none' : 'auto'}>
                <DateTimerPicker
                  value={this.state.endTime}
                  mode="time"
                  display="clock"
                  onChange={(event, endTime) => { this.setState({ endTime }) }}
                  style={{ height: 50 }}
                />
              </View>

              <Text style={localStyles.titleTextStyle}>遠足路線名稱</Text>
              <View style={localStyles.inputFieldContainer} pointerEvents={this.state.startSending ? 'none' : 'auto'}>
                <TextInput
                  style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
                  value={this.state.trailName}
                  autoCorrect={false}
                  autoCapitalize='none'
                  underlineColorAndroid='transparent'
                  placeholder='遠足路線名稱'
                  onChangeText={(trailName) => this.setState({ trailName })}
                  selectTextOnFocus={true}
                />
              </View>

            </View>

          </ScrollView>


        </Modal>
      </View >
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
    left: Dimensions.get('window').width * 0.43,
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
  },
  Message: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 100,
    height: 35,
    borderRadius: 40,
    borderColor: 'white',
    backgroundColor: 'rgba(45, 74, 105, 1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ModalContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  filterContainer: {
    marginRight: 20,
    marginTop: 60,
    marginLeft: 20,
  },
  TitleBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleTextStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  },
  inputFieldContainer: {
    borderRadius: 5,
    borderWidth: 1,
    width: '100%',
    height: 50,
    marginTop: 10,
    padding: 10
  },


})

export default RecordList;