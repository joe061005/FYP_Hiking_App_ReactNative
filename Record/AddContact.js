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




class AddContact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
    }

  }

  componentDidMount() {

  }




  render() {
    return (
      <View style={localStyles.container}>
        <View style={localStyles.formContainer}>
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

        </View>
      </View>
    )
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  formContainer: {
    marginLeft: 20
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

export default AddContact;