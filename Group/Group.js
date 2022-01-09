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
  KeyboardAvoidingView
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import API from "../Api/api"
import { MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'
import DropDown from "react-native-dropdown-picker";
import Spinner from 'react-native-loading-spinner-overlay'



class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      formContent: [],
      spinner: false,
      dataFetched: false

    }
    this.getForm = this.getForm.bind(this)
  }

  componentDidMount() {
    this.getForm()
  }

  async getForm() {
    API.getMatchForm().then(([code, data, header]) => {
      if (code == '200') {
        if (data.length > 0) {
          this.setState({ formContent: data })
        } else {
          this.setState({ showForm: true })
        }
        this.setState({ dataFetched: true })
      }
    })
  }

  render() {
    const Form = (
      <ImageBackground
        style={localStyles.BGContainer}
        source={{ uri: 'https://img.findshop.hk/uploads/images/topics/201909/24/121_1569294546_x7I5Zw4GoK.jpg!w800' }}
        resizeMode="cover"
      >
        <Spinner
          visible={this.state.spinner}
          textContent={'正在提交...'}
          textStyle={{ color: 'white' }}
        />
        <View style={localStyles.formContainer}>
          <ScrollView style={{ paddingRight: 40 }}>

            <Text style={localStyles.formText}>詳情<Text style={{ color: 'red' }}> *</Text></Text>

            <TextInput
              style={localStyles.textField}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => this.setState({ text })}
              value={this.state.text}
              placeholder='請提供資訊詳情'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
            />

            <TouchableOpacity onPress={async () => { await this.submitData() }}>
              <View style={[localStyles.buttonContainer]}>
                <View style={[localStyles.addButton, { width: '100%', backgroundColor: '#009dff' }]}>
                  <AntDesign style={[localStyles.buttonIcon]} name="form" size={24} color="white" />
                  <Text style={[localStyles.textCenter, localStyles.addText]}>提交</Text>
                </View>
              </View>
            </TouchableOpacity>


          </ScrollView>
        </View>

      </ImageBackground>
    )
    return this.state.dataFetched ? (
      this.state.showForm ?
        Form
        :
        (<View style={localStyles.Container}>
          <Text>Nothing</Text>
        </View>
        )
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
    backgroundColor: 'white'
  },
  BGContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    paddingBottom: 30,
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(96, 131, 166, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formText: {
    color: 'black',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    marginLeft: 20
  },
  textField: {
    borderColor: 'rgba(45, 74, 105, 1)',
    marginTop: 20,
    marginBottom: 5,
    height: 250,
    width: 300,
    borderRadius: 1,
    borderWidth: 1,
    padding: 10,
    fontSize: 18,
    marginLeft: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 20,
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

export default Group;