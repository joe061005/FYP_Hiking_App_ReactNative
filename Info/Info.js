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
  Platform
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import API from "../Api/api"
import { MaterialIcons } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'
import DropDown from "react-native-dropdown-picker";



class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataFetched: false,
      tab: "Info",
    }
    this.getTabStyle = this.getTabStyle.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.getTrailInfo = this.getTrailInfo.bind(this)
  }
  componentDidMount() {
    NetInfo.fetch().then(state => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      !state.isConnected ?
        showMessage({
          message: "你好像未有連接網絡",
          type: "danger",
          icon: { icon: "auto", position: "left" }
        })
        :
        null
    });

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    this.getTrailInfo();


  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    if (this.state.isFocused) {
      Alert.alert(
        '溫馨提示',
        this.state.isLogin ? '是否離開？' : '是否離開？',
        [
          {
            text: '取消',
            onDismiss: () => { },
          },
          {
            text: '確定',
            onPress: () => BackHandler.exitApp()
          }
        ],
        { cancelable: true }
      );
      return true;
    }
  }

  getTrailInfo() {
    API.getTrailInfo().then(([code, data, header]) => {
      if (code == '200') {
        this.setState({ trailInfo: data })
        this.setState({ dataFetched: true })
      }
    })
  }

  getTabStyle(tab) {
    if (this.state.tab == tab)
      return (
        [localStyles.col_1, localStyles.tabActive]
      )
    else
      return (
        [localStyles.col_1, localStyles.tabInActive]
      )
  }

  _onRefresh() {
    this.getTrailInfo()
  }


  render() {
    console.log(this.state.trailInfo)
    return this.state.dataFetched ? (
      <ScrollView style={localStyles.Container} refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        <View style={localStyles.InfoContent}>
          <View style={[localStyles.row, localStyles.tabsContainer]}>
            <View style={[this.getTabStyle('Info')]}>
              <TouchableOpacity onPress={() => this.setState({ tab: 'Info' })}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={this.state.tab == 'Info' ? [localStyles.tabActiveText] : [localStyles.tabText]}>最新遠足資訊</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => { this.props.navigation.navigate("InfoProvide", {data: this.state.trailInfo}) }}>
            <View style={[localStyles.buttonContainer]}>

              <View style={[localStyles.addButton]}>
                <MaterialIcons style={[localStyles.buttonIcon]} name="add-box" size={24} color="white" />
                <Text style={[localStyles.textCenter, localStyles.addText]}>提供資訊</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )

      :
      (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <Progress.Circle size={60} indeterminate={true} style={{ color: "blue" }} />
        </View>
      )
  }
}

const localStyles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)'
  },
  InfoContent: {
    paddingBottom: 30,
    minHeight: '100%',
  },
  tabsContainer: {
    height: 40,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 55,
  },
  row: {
    flexDirection: 'row',
  },
  col_1: {
    flex: 1
  },
  tabActive: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(45, 74, 105, 1)'
  },
  tabInActive: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'rgba(96, 131, 166, 0.7)',
  },
  tabActiveText: {
    color: 'rgba(45, 74, 105, 1)',
    fontSize: 18,
    fontWeight: '900',
  },
  tabText: {
    color: 'rgba(96, 131, 166, 0.7)',
    fontSize: 18
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //paddingTop: 10,
    backgroundColor: 'white',
    paddingBottom: 15
  },
  buttonIcon: {
    marginRight: 10
  },
  addButton: {
    width: '60%',
    height: 53,
    backgroundColor: 'rgba(45, 74, 105, 1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    flexDirection: 'row'
    //marginBottom: 15
  },
  addText: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 1)',
    fontWeight: '900'
  },
  textCenter: {
    textAlign: 'center',
    justifyContent: 'center'
  },
})

export default Info