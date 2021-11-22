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
import API from "../Api/api"
import { FontAwesome } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'

class District extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        trails: [],
        refreshing: false,
        dataFetched: false,
      }
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
  
    // for getting the lastest tail info
    getTrails() {
      API.getTrailsByDistrict(this.props.route.params.district).then(([code, data, header]) => {
        if (code == '200') {
          console.log(data.length)
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
              {data.time.split(".")[0] == '0' ?
                <Text style={localStyles.TrailText}>時間： {data.time.split(".")[1]}分鐘</Text>
                :
                data.time.split(".")[1] == '0' ?
                  <Text style={localStyles.TrailText}>時間： {data.time.split(".")[0]}小時</Text>
                  :
                  <Text style={localStyles.TrailText}>時間: {data.time.split(".")[0]}小時 {data.time.split(".")[1]}分鐘</Text>
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
  
  })
  
  export default District;