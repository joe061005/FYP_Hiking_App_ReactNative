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
import { MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons, Ionicons, Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'
import DropDown from "react-native-dropdown-picker";
import Spinner from 'react-native-loading-spinner-overlay'
import SwitchSelector from "react-native-switch-selector";
import NumericInput from 'react-native-numeric-input'
import { Card } from 'react-native-paper'




class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showForm: false,
      formContent: [{ _id: '' }],
      spinner: false,
      FormDataFetched: false,
      GroupDataFetched: false,
      gender: 'boy',
      age: '',
      experience: '',
      difficulty: 1,
      time: 1,
      view: 1,
      startTime: 'morning',
      phoneNumber: '',
      name: '',
      groupList: [{ record: [] }],
      relatedTrails: []


    }
    this.getForm = this.getForm.bind(this)
    this.submitData = this.submitData.bind(this)
    this.message = this.message.bind(this)
    this.getGroup = this.getGroup.bind(this)
    this.quitGroup = this.quitGroup.bind(this)
    this.getRelatedTrail = this.getRelatedTrail.bind(this)
  }

  async componentDidMount() {
    await Promise.all([this.getForm(), this.getGroup(), this.getRelatedTrail()])

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
        this.setState({ FormDataFetched: true })
      }
    })
  }

  async getGroup() {
    API.getMatchResult().then(([code, data, header]) => {
      if (code == '200') {
        if (data.length > 0) {
          this.setState({ groupList: data })
          console.log("groupList: ", this.state.groupList)
        }
        this.setState({ GroupDataFetched: true })
      }
    })
  }

  async quitGroup() {
    API.quitGroup().then(([code, data, header]) => {
      if (code == '200') {
        this.setState({
          showForm: true,
          formContent: [{ _id: '' }],
          groupList: [{ record: [] }],
          gender: 'boy',
          age: '',
          experience: '',
          difficulty: 1,
          time: 1,
          view: 1,
          startTime: 'morning',
          phoneNumber: '',
          name: '',
        })
      }
    })
  }

  async getRelatedTrail() {
    API.getRealtedTrail().then(([code, data, header]) => {
      if (code == '200') {
        this.setState({ relatedTrails: data })
        console.log("related: ", this.state.relatedTrails)
      }
    })
  }

  message(msg) {
    Alert.alert('??????', msg, [{ text: '??????' }])
  }

  async submitData() {
    if (!this.state.name) {
      this.message('??????????????????????????????')
      return
    }

    if (!this.state.experience) {
      this.message('????????????????????????????????????')
      return
    } else {
      if (this.state.experience.includes('.')) {
        this.message('??????????????????????????????')
        return
      } else if (this.state.experience.charAt(0) == '0' && this.state.experience.length > 1) {
        this.message('????????????????????????????????????')
        return
      }
    }

    if (this.state.age) {
      if (this.state.age.includes('.')) {
        this.message('????????????????????????')
        return
      } else if (this.state.age.charAt(0) == '0') {
        this.message('????????????????????????')
        return
      }
    }

    if (this.state.phoneNumber) {
      if (this.state.phoneNumber.length != 8) {
        this.message('??????????????????????????????')
        return
      } else if (this.state.phoneNumber.includes('.')) {
        this.message('??????????????????????????????')
        return
      }
    }

    this.setState({ spinner: true })

    const age = Math.floor(Number(this.state.age) / 10)

    let exp = Number(this.state.experience)

    if (exp == 0) {
      exp = 2
    } else if (exp % 2 == 1) {
      exp = exp + 1
    }

    let time = Number(this.state.time)

    if (time % 2 == 1) {
      time = time + 1
    }



    var params = {
      gender: this.state.gender == 'boy' ? 1 : 0,
      age: this.state.age ? age : -1,
      experience: exp / 2,
      difficulty: Number(this.state.difficulty),
      time: time / 2,
      startTime: this.state.startTime == 'morning' ? 0 : this.state.startTime == "noon" ? 1 : 2,
      view: Number(this.state.view),
      phoneNumber: this.state.phoneNumber,
      name: this.state.name
    }

    console.log("param: ", params)

    API.submitMatchForm(params).then(([code, data, header]) => {
      if (code == '200') {
        this.setState({ showForm: false, formContent: [data] })
        this.setState({ spinner: false })
        console.log("submitData(): ", this.state.formContent)
      } else {
        this.setState({ spinner: false })
        setTimeout(() => {
          this.message('?????????????????????????????????')
        }, 200)
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
          textContent={'????????????...'}
          textStyle={{ color: 'white' }}
        />
        <View style={localStyles.formContainer}>
          <ScrollView style={{ paddingRight: 20 }}>
            <Text style={localStyles.noticeText}>????????? <Text style={{ color: 'red' }}>*</Text> ?????????</Text>

            <Text style={localStyles.partTitleText}>1. ????????????</Text>

            <Text style={localStyles.formText}>??????</Text>
            <TextInput
              style={localStyles.textField}
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder='??????'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
              maxLength={10}
            />

            <Text style={localStyles.formText}>??????<Text style={{ color: 'red' }}> *</Text></Text>
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
                { label: "???", value: "boy", customIcon: <Ionicons name="man-sharp" size={24} color="black" /> },
                { label: "???", value: "girl", customIcon: <Ionicons name="woman-sharp" size={24} color="black" /> }
              ]}
              fontSize={20}
            />

            <Text style={localStyles.formText}>??????</Text>
            <TextInput
              style={localStyles.textField}
              onChangeText={(age) => this.setState({ age })}
              value={this.state.age}
              placeholder='??????(?????????'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
              keyboardType="numeric"
              maxLength={2}
            />

            <Text style={localStyles.formText}>????????????</Text>
            <TextInput
              style={localStyles.textField}
              onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
              value={this.state.phoneNumber}
              placeholder='????????????(?????????'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
              keyboardType="numeric"
              maxLength={8}
            />

            <Text style={localStyles.formText}>????????????(???)<Text style={{ color: 'red' }}> *</Text></Text>
            <TextInput
              style={localStyles.textField}
              onChangeText={(experience) => this.setState({ experience })}
              value={this.state.experience}
              placeholder='????????????(???)'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
              keyboardType="numeric"
              maxLength={2}
            />

            <Text style={[localStyles.partTitleText, { marginTop: 20 }]}>2. ????????????</Text>

            <Text style={localStyles.formText}>????????????  (1????????????5?????????)<Text style={{ color: 'red' }}> *</Text></Text>
            <NumericInput
              onChange={(difficulty) => this.setState({ difficulty })}
              minValue={1}
              maxValue={5}
              value={this.state.difficulty}
              borderColor={'rgba(45, 74, 105, 1)'}
              containerStyle={localStyles.numericInput}
            />

            <Text style={localStyles.formText}>????????????  (1-10??????)<Text style={{ color: 'red' }}> *</Text></Text>
            <NumericInput
              onChange={(time) => this.setState({ time })}
              minValue={1}
              maxValue={10}
              value={this.state.time}
              borderColor={'rgba(45, 74, 105, 1)'}
              containerStyle={localStyles.numericInput}
            />

            <Text style={localStyles.formText}>???????????? (1????????????5?????????)<Text style={{ color: 'red' }}> *</Text></Text>
            <NumericInput
              onChange={(view) => this.setState({ view })}
              minValue={1}
              maxValue={5}
              value={this.state.view}
              borderColor={'rgba(45, 74, 105, 1)'}
              containerStyle={localStyles.numericInput}
            />

            <Text style={localStyles.formText}>????????????<Text style={{ color: 'red' }}> *</Text></Text>
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
                { label: "??????", value: "morning", customIcon: <Feather name="sunrise" size={24} color="black" /> },
                { label: "??????", value: "noon", customIcon: <Ionicons name="sunny" size={24} color="black" /> },
                { label: "??????", value: "night", customIcon: <Ionicons name="moon" size={24} color={this.state.startTime == "night" ? "white" : "#000000"} /> }
              ]}
              fontSize={20}
            />


            <TouchableOpacity onPress={async () => { await this.submitData() }}>
              <View style={[localStyles.buttonContainer]}>
                <View style={[localStyles.addButton, { width: '100%', backgroundColor: '#009dff' }]}>
                  <FontAwesome style={[localStyles.buttonIcon]} name="group" size={24} color="white" />
                  <Text style={[localStyles.textCenter, localStyles.addText]}>??????????????????</Text>
                </View>
              </View>
            </TouchableOpacity>


          </ScrollView>
        </View>

      </ImageBackground>
    )

    const processing = (
      <View style={[localStyles.Container, { alignItems: 'center', justifyContent: 'center' }]}>
        <FontAwesome5 name="exclamation-triangle" size={50} color="#f6e146" />
        <Text style={{ fontSize: 25, fontWeight: 'bold', marginTop: 20 }}>???????????????????????????????????????</Text>
        <TouchableOpacity style={{ marginTop: 30 }} onPress={() => { this.getGroup(), this.getRelatedTrail() }}>
          <Ionicons name="reload" size={35} color="black" />
        </TouchableOpacity>
      </View>
    )

    const hikingTrailData = this.state.relatedTrails.map((data, index1) =>
      <TouchableOpacity key={index1} onPress={() => this.props.navigation.push("DetailByDistrict", { title: data.title, id: data._id })}>
        <View style={localStyles.trailContainer}>
          <Image style={localStyles.bgImage} source={{ uri: data.image[0], cache: 'force-cache' }} />
          <View style={localStyles.TextContainer}>
            <Text style={[localStyles.TrailText, { fontWeight: "bold" }]}>{data.title}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={localStyles.TrailText}>?????????</Text>
              {data.star.map((star, index2) => (
                star == 1 ?
                  <FontAwesome key={index2} name="star" size={20} color="#f2e82c" />
                  :
                  <FontAwesome key={index2} name="star-o" size={20} />
              ))
              }
            </View>
            <Text style={localStyles.TrailText}>?????????{data.distance}?????? </Text>
            {data.time.split(".")[0] == '0' ?
              <Text style={localStyles.TrailText}>????????? {data.time.split(".")[1]}??????</Text>
              :
              data.time.split(".")[1] == '0' ?
                <Text style={localStyles.TrailText}>????????? {data.time.split(".")[0]}??????</Text>
                :
                <Text style={localStyles.TrailText}>??????: {data.time.split(".")[0]}?????? {data.time.split(".")[1]}??????</Text>
            }
            <Text style={localStyles.TrailText}>?????????{data.district} ({data.place}) </Text>
          </View>
        </View>
      </TouchableOpacity>
    )

    const showGroup = (
      <ScrollView style={localStyles.GroupListContainer} contentContainerStyle={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={() => { Alert.alert('??????', '???????????????????????????????', [{ text: '??????', onPress: () => { this.quitGroup() } }, { text: '??????' }]) }} style={{ marginTop: 10 }}>
          <View style={[localStyles.quitGroupButtonContainer]}>
            <View style={[localStyles.quitGroupButton]}>
              <Ionicons style={[localStyles.buttonIcon]} name="exit-outline" size={24} color="white" />
              <Text style={[localStyles.textCenter, localStyles.addText]}>????????????</Text>
            </View>
          </View>
        </TouchableOpacity>

        <Text style={localStyles.groupNoText}>???????????????{this.state.groupList[0].record.length}/10</Text>
        {this.state.groupList[0].record.map((data, index) => (
          <Card
            style={localStyles.CardStyle}
            key={index}
          >
            <View style={localStyles.CardContent}>
              <View style={localStyles.genderAndNameContainer}>
                {data.gender == 0 ? <Ionicons name="woman-sharp" size={40} color="#FEC5E5" /> : <Ionicons name="man-sharp" size={40} color="#B1E6EE" />}
                <Text style={localStyles.name}>{data.name}{data._id == this.state.formContent[0]._id ? "(???)" : null}</Text>
              </View>
              <View style={localStyles.infoContainer}>
                <View style={[localStyles.detailContainer]}>
                  <View style={localStyles.titleTextContainer}>
                    <Text style={{ fontSize: 16 }}>1.????????????</Text>
                  </View>
                  <Text style={localStyles.PersonalInfoText}>????????????: {data.experience == 1 ? "0-2???" : `${data.experience * 2 - 1}-${data.experience * 2}???`}</Text>
                  {data.phoneNumber ? <Text style={localStyles.PersonalInfoText}>???????????????{data.phoneNumber}</Text> : null}
                  <Text style={localStyles.PersonalInfoText}>?????????{data.user.email}</Text>
                </View>
                <View style={localStyles.detailContainer}>
                  <View style={localStyles.titleTextContainer}>
                    <Text style={{ fontSize: 16 }}>2.????????????</Text>
                  </View>
                  <Text style={localStyles.PersonalInfoText}>??????: {data.difficulty}???</Text>
                  <Text style={localStyles.PersonalInfoText}>??????: {data.time == 1 ? "1-2" : `${data.time * 2 - 1}-${data.time * 2}`}??????</Text>
                  <Text style={localStyles.PersonalInfoText}>??????: {data.view}???</Text>
                </View>
              </View>
            </View>

          </Card>
        ))}

        <View style={{ marginTop: 20, marginLeft: 10 }}>
          <Text style={localStyles.TitleText}>????????????</Text>
          <ScrollView style={localStyles.trailItemContainer} horizontal>
            {hikingTrailData}
          </ScrollView>
        </View>

      </ScrollView>
    )


    return this.state.FormDataFetched && this.state.GroupDataFetched ? (
      this.state.showForm ?
        Form
        :
        this.state.groupList[0].record.length > 0 ?
          showGroup
          :
          processing
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
  GroupListContainer: {
    flex: 1,
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
  },
  CardStyle: {
    width: '90%',
    height: 250,
    marginTop: 10,
    marginBottom: 10
  },
  CardContent: {
    flexDirection: 'row',
    height: '100%',

  },
  genderAndNameContainer: {
    width: '25%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  name: {
    fontSize: 20,
    marginTop: 10
  },
  infoContainer: {
    marginLeft: 15
  },
  detailContainer: {
    flexDirection: 'column',
  },
  titleTextContainer: {
    borderBottomWidth: 1,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginTop: 10
  },
  PersonalInfoText: {
    marginBottom: 5,
    fontSize: 16
  },
  groupNoText: {
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold'
  },
  quitGroupButtonContainer: {
    flexDirection: 'row',
    //paddingTop: 10,
    paddingBottom: 15,
    width: '100%',
    flexDirection: 'row'
  },
  quitGroupButton: {
    width: '80%',
    height: 53,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    flexDirection: 'row',
    //marginBottom: 15
  },
  trailContainer: {

    height: 410,
    width: 300,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 20,
    backgroundColor: '#edf6fb',

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
  trailItemContainer: {
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 20,
    paddingBottom: 20
  },
  TitleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 10
  },


})

export default Group;