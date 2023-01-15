import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Dimensions,
  Platform,
  Modal,
  Alert
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import API from "../Api/api"
import { MaterialIcons, Entypo, AntDesign, FontAwesome } from "@expo/vector-icons"
import { StackActions } from '@react-navigation/native'
import Spinner from "react-native-loading-spinner-overlay";
import UserIcon from '../assets/user_icon.svg'


class Setting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      modal: false,
      spinner: false
    }
    this.getuserInfo = this.getuserInfo.bind(this)
    this.logout = this.logout.bind(this)
    this.resetData = this.resetData.bind(this)
  }

  async componentDidMount() {
    await this.getuserInfo()
  }

  async getuserInfo() {
    const login_data = await API.userInfo();
    this.setState({ data: login_data })
    console.log("user_data:", this.state.data)
  }

  async logout() {
    this.setState({ spinner: !this.state.spinner })
    await API.logout().then(async ([code, data, header]) => {
      if (code == '200') {
        await this.resetData()
        this.props.navigation.dispatch(
          StackActions.replace("landing")
        )
      }
    })
    this.setState({ spinner: !this.state.spinner })
  }

  async resetData() {
    await API.resetUserData();
    console.log('reset successfully')
  }

  render() {
    return (
      <View style={localStyles.Container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'正在登出...'}
          textStyle={{ color: 'white' }}
        />
        <Image
          source={require("../assets/settingBG.jpg")}
          style={localStyles.backgroundImage}
          
        />
        <Image
          source={require("../assets/user_icon.png")}
          style={localStyles.userImage}
        />

        <View style={localStyles.userInfoContainer}>
          <Text style={localStyles.userNameText}>{this.state.data.username}</Text>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate("ChangePW", { username: this.state.data.username }) }}>
            <View style={[localStyles.buttonContainer]}>
              <View style={[localStyles.addButton]}>
                <FontAwesome style={[localStyles.buttonIcon]} name="unlock-alt" size={24} color="white" />
                <Text style={[localStyles.textCenter, localStyles.addText]}>更改密碼</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { Alert.alert('提示', '確定要登出嗎？', [{ text: '確定', onPress: () => { this.logout() } }, { text: '取消', onPress: () => { } }]) }}>
            <View style={[localStyles.buttonContainer]}>
              <View style={[localStyles.addButton]}>
                <MaterialIcons style={[localStyles.buttonIcon]} name="logout" size={24} color="white" />
                <Text style={[localStyles.textCenter, localStyles.addText]}>登出</Text>
              </View>
            </View>
          </TouchableOpacity>

        </View>

      </View>
    )
  }
}

const localStyles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)'
  },
  backgroundImage: {
    height: 250,
    width: Dimensions.get('window').width,
  },
  userImage: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    position: 'relative',
    top: -130
    // borderRadius: 90,
    // top: 140,
    // left: '30%'
  },
  userInfoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -110
  },
  userNameText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',

  },
  buttonIcon: {
    marginRight: 10
  },
  addButton: {
    width: '80%',
    height: 53,
    backgroundColor: '#009dff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    flexDirection: 'row',
    marginTop: 20
    //marginBottom: 15
  },
  addText: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '900'
  },


})

export default Setting;