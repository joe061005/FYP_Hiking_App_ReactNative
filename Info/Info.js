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



class Info extends React.Component{
    constructor(props){
        super(props);
        this.state={
          refreshing: false,
          dataFetched: false
        }
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

    render(){
        return(
          <View>
             <Text>Info</Text>
          </View>
        )
    }
}

const localStyles = StyleSheet.create({


})

export default Info