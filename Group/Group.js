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
import { MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons, Ionicons, Feather, FontAwesome } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'
import DropDown from "react-native-dropdown-picker";
import Spinner from 'react-native-loading-spinner-overlay'
import SwitchSelector from "react-native-switch-selector";
import NumericInput from 'react-native-numeric-input'




class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      formContent: [],
      spinner: false,
      dataFetched: false,
      gender: 'boy',
      age: '',
      experience: '',
      difficulty: 1,
      length: 1,
      time: 1,
      view: 1,
      startTime: 'morning',


    }
    this.getForm = this.getForm.bind(this)
    this.submitData = this.submitData.bind(this)
    this.message = this.message.bind(this)
  }

  componentDidMount() {
    this.getForm()
  }

  async getForm() {
    API.getMatchForm().then(([code, data, header]) => {
      if (code == '200') {
        if (data.length > 0) {
          this.setState({ formContent: data })
          console.log("formContent: ", this.state.formContent)
        } else {
          this.setState({ showForm: true })
        }
        this.setState({ dataFetched: true })
      }
    })
  }

  message(msg){
    Alert.alert('注意', msg, [{text: '確定'}])
  }

  async submitData(){
    if(!this.state.experience){
      this.message('「遠足經驗」一欄為必填！')
      return
    }else{
      if(this.state.experience.includes('.')){
        this.message('遠足經驗必須為整數！')
        return
      }
    }

    if(this.state.age){
      if(this.state.age.includes('.')){
        this.message('年齡必須為整數！')
        return
      }
    }

    var params = {
      gender: this.state.gender == 'boy'? 1: 0,
      age: this.state.age? Number(this.state.age) : 0,
      experience: Number(this.state.experience),
      difficulty: Number(this.state.difficulty),
      length: Number(this.state.length),
      time: Number(this.state.time),
      startTime: this.state.startTime == 'morning' ? 0 : this.state.startTime == "noon" ? 1 : 2,
      view: Number(this.state.view),
    }

    API.submitMatchForm(params).then(([code, data, header]) => {
      if(code == '200'){
        this.setState({showForm: false, formContent: data})
        console.log("submitData(): ", this.state.formContent)
      }
    })
  }

  render() {
    const Form = (
      <ImageBackground
        style={localStyles.BGContainer}
        source={{ uri: 'https://www.tripsavvy.com/thmb/SQiQpHZ1eXGB4gKb3q-J8mtI6I4=/1024x570/filters:no_upscale():max_bytes(150000):strip_icc()/hong_kong_peak_Chor_IP-56a3b8bd5f9b58b7d0d374fa.jpg' }}
        resizeMode="cover"
      >
        <Spinner
          visible={this.state.spinner}
          textContent={'正在提交...'}
          textStyle={{ color: 'white' }}
        />
        <View style={localStyles.formContainer}>
          <ScrollView style={{ paddingRight: 20 }}>
            <Text style={localStyles.noticeText}>注意： <Text style={{ color: 'red' }}>*</Text> 為必填</Text>

            <Text style={localStyles.partTitleText}>1. 個人資料</Text>

            <Text style={localStyles.formText}>性別<Text style={{ color: 'red' }}> *</Text></Text>
            <SwitchSelector
              style={localStyles.Input}
              initial={0}
              onPress={value => this.setState({ gender: value })}
              textColor="#000000"
              selectedColor="#000000"
              buttonColor={this.state.gender == 'boy' ? "#B1E6EE" : "#FEC5E5"}
              borderColor="rgba(45, 74, 105, 1)"
              hasPadding
              options={[
                { label: "男", value: "boy", customIcon: <Ionicons name="man-sharp" size={24} color="black" /> },
                { label: "女", value: "girl", customIcon: <Ionicons name="woman-sharp" size={24} color="black" /> }
              ]}
              fontSize={20}
            />

            <Text style={localStyles.formText}>年齡</Text>
            <TextInput
              style={localStyles.textField}
              onChangeText={(age) => this.setState({ age })}
              value={this.state.age}
              placeholder='年齡(選填）'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
              keyboardType="numeric"
            />

            <Text style={localStyles.formText}>遠足經驗(年)<Text style={{ color: 'red' }}> *</Text></Text>
            <TextInput
              style={localStyles.textField}
              onChangeText={(experience) => this.setState({ experience })}
              value={this.state.experience}
              placeholder='行山經驗(年)'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
              keyboardType="numeric"
            />

            <Text style={[localStyles.partTitleText, {marginTop: 20}]}>2. 路線資料</Text>

            <Text style={localStyles.formText}>路線難度  (1為最低，5為最高)<Text style={{ color: 'red' }}> *</Text></Text>
            <NumericInput
              onChange={(difficulty) => this.setState({ difficulty })}
              minValue={1}
              maxValue={5}
              value={this.state.difficulty}
              borderColor={'rgba(45, 74, 105, 1)'}
              containerStyle={localStyles.numericInput}
            />

            <Text style={localStyles.formText}>路線長度  (1-30公里)<Text style={{ color: 'red' }}> *</Text></Text>
            <NumericInput
              onChange={(length) => this.setState({ length })}
              minValue={1}
              maxValue={30}
              value={this.state.length}
              borderColor={'rgba(45, 74, 105, 1)'}
              containerStyle={localStyles.numericInput}
            />

            <Text style={localStyles.formText}>行山時間  (1-10小時)<Text style={{ color: 'red' }}> *</Text></Text>
            <NumericInput
              onChange={(time) => this.setState({ time })}
              minValue={1}
              maxValue={10}
              value={this.state.time}
              borderColor={'rgba(45, 74, 105, 1)'}
              containerStyle={localStyles.numericInput}
            />

            <Text style={localStyles.formText}>路線景觀 (1為最低，5為最高)<Text style={{ color: 'red' }}> *</Text></Text>
            <NumericInput
              onChange={(view) => this.setState({ view })}
              minValue={1}
              maxValue={5}
              value={this.state.view}
              borderColor={'rgba(45, 74, 105, 1)'}
              containerStyle={localStyles.numericInput}
            />

            <Text style={localStyles.formText}>出發時間<Text style={{ color: 'red' }}> *</Text></Text>
            <SwitchSelector
              style={localStyles.Input}
              initial={0}
              onPress={value => this.setState({ startTime: value })}
              textColor="#000000"
              selectedColor={this.state.startTime == "night" ? "white" : "#000000"}
              buttonColor={this.state.startTime == 'morning' ? "#82EEFD" : this.state.startTime == "noon" ? "#FC6A03" : "#1D1D43"}
              borderColor="rgba(45, 74, 105, 1)"
              hasPadding
              options={[
                { label: "早上", value: "morning", customIcon: <Feather name="sunrise" size={24} color="black" /> },
                { label: "下午", value: "noon", customIcon: <Ionicons name="sunny" size={24} color="black" /> },
                { label: "晚上", value: "night", customIcon: <Ionicons name="moon" size={24} color={this.state.startTime == "night" ? "white" : "#000000"} /> }
              ]}
              fontSize={20}
            />


            <TouchableOpacity onPress={async () => { await this.submitData() }}>
              <View style={[localStyles.buttonContainer]}>
                <View style={[localStyles.addButton, { width: '100%', backgroundColor: '#009dff' }]}>
                  <FontAwesome style={[localStyles.buttonIcon]} name="group" size={24} color="white" />
                  <Text style={[localStyles.textCenter, localStyles.addText]}>進行群組配對</Text>
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
          <Text>Have form</Text>
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
    marginBottom: 10,
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
  Input: {
    borderColor: 'rgba(45, 74, 105, 1)',
    marginTop: 10,
    marginBottom: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: -10
  },
  noticeText: {
    color: 'black',
    fontSize: 25,
    marginTop: 10,
    marginLeft: 20,
    fontWeight: '400',
    marginBottom: 20,
    backgroundColor: 'yellow',
    alignSelf: 'center'
  },
  numericInput: {
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 20,
  },
  partTitleText: {
    color: 'black',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 20,
    alignSelf: 'center'
  }


})

export default Group;