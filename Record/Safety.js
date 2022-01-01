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




class Safety extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }

  }

  componentDidMount() {

  }




  render() {
    return (
      <View style={localStyles.container}>

      </View>
    )
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

})

export default Safety;