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
  Platform
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import { SliderBox } from "react-native-image-slider-box"
import API from "../Api/api"
import { FontAwesome } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tab: "recommend",
      trails: [],
      refreshing: false,
      dataFetched: false
    }
    this.getTabStyle = this.getTabStyle.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.getTrails = this.getTrails.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
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

    this.getTrails()

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


  //for the tab bar
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

  // for getting the lastest tail info
  getTrails() {
    API.getTrails().then(([code, data, header]) => {
      if (code == '200') {
        //console.log(data)
        this.setState({ trails: data })
        this.setState({ dataFetched: true })
      }
    })
  }

  _onRefresh() {
    this.getTrails();
  }

  render() {
    // loop through the hiking trail data
    const hikingTrailData = this.state.trails.map((data, index1) =>
      <TouchableOpacity key={index1} onPress={() => this.props.navigation.navigate("TrailDetail", { data: data, title: data.title })}>
        <View style={localStyles.trailContainer}>
          <Image style={localStyles.bgImage} source={{ uri: data.image[0] }} />
          <View style={localStyles.TextContainer}>
            <Text style={[localStyles.TrailText, { fontWeight: "bold" }]}>{data.title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={localStyles.TrailText}>難度：</Text>
              {data.star.map((star, index2) => (
                star == 1 ?
                  <FontAwesome key={index2} name="star" size={20} color="#f2e82c" />
                  :
                  <FontAwesome key={index2} name="star-o" size={20} />
              ))
              }
            </View>
            <Text style={localStyles.TrailText}>長度：{data.distance}公里 </Text>
            {data.time.split(".")[0] != '0' ?
              <Text style={localStyles.TrailText}>時間: {data.time.split(".")[0]}小時 {data.time.split(".")[1]}分鐘</Text>
              :
              <Text style={localStyles.TrailText}>時間： {data.time.split(".")[1]}分鐘</Text>
            }
            <Text style={localStyles.TrailText}>地區：{data.district} ({data.place}) </Text>
          </View>
        </View>
      </TouchableOpacity>
    )

    return this.state.dataFetched ? (
      <ScrollView style={localStyles.Container} refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        <View style={localStyles.HomeContent}>
          <View style={[localStyles.row, localStyles.tabsContainer]}>
            <View style={[this.getTabStyle('recommend')]}>
              <TouchableOpacity onPress={() => this.setState({ tab: 'recommend' })}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={this.state.tab == 'recommend' ? [localStyles.tabActiveText] : [localStyles.tabText]}>遠足路線推介</Text>
              </TouchableOpacity>
            </View>
            <View style={[this.getTabStyle('favourite')]}>
              <TouchableOpacity onPress={() => this.setState({ tab: 'favourite' })}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={this.state.tab == 'favourite' ? [localStyles.tabActiveText] : [localStyles.tabText]}>收藏的路線</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            {hikingTrailData.length > 0 ?
              <ScrollView style={localStyles.trailItemContainer} horizontal refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }>
                {hikingTrailData}
              </ScrollView>
              :
              <View style={localStyles.TrailTextContainer}>
                <View style={localStyles.TrailContent}>
                  <Text>暫時沒有最新遠足路線推介，敬請緊密留意！</Text>
                </View>
              </View>
            }
          </View>


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
  HomeContent: {
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
  map: {
    height: 300
  },
  trailItemContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
    paddingBottom: 20
  },
  TrailTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  TrailContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 27.5,
    borderWidth: 1
  },
  trailContainer: {

    height: 400,
    width: 300,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 20

  },
  bgImage: {
    width: 300,
    height: 200,
    borderWidth: 1,
    borderRadius: 5,
  },
  TextContainer: {
    marginTop: 20,
    marginLeft: 10,
  },
  TrailText: {
    color: "black",
    fontSize: 20,
    marginBottom: 10
  },


})

export default Home;