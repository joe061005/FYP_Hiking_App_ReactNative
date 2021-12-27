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




class Info extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      dataFetched: false,
      tab: "Info",
      trailInfo: [],
      info: [],
      userInfo: {info:[]},
      searchText: '',
      modal: false,
      districtItem: [
        { label: "新界東北", value: "新界東北" },
        { label: "香港島", value: "香港島" },
        { label: "九龍及將軍澳", value: "九龍及將軍澳" },
        { label: "西貢", value: "西貢" },
        { label: "大嶼山", value: "大嶼山" },
        { label: "新界西北", value: "新界西北" },
        { label: "新界中部", value: "新界中部" },
        { label: "離島", value: "離島" }
      ],
      districtOpen: false,
      districtValue: "",

    }
    this.getTabStyle = this.getTabStyle.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
    this.getTrailInfo = this.getTrailInfo.bind(this)
    this.getInfo = this.getInfo.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this.setDistrictOpen = this.setDistrictOpen.bind(this)
    this.setDistrictValue = this.setDistrictValue.bind(this)
    this.resetVal = this.resetVal.bind(this)

  }
  async componentDidMount() {
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
    await Promise.all([this.getInfo(), this.getTrailInfo(), this.getUserInfo()])


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

  async getTrailInfo() {
    API.getTrailInfo().then(([code, data, header]) => {
      if (code == '200') {
        console.log("InfoData: ", data)
        data = [{ image: ['https://media.timeout.com/images/105629341/750/562/image.jpg'], title: '其他', district: '' }, ...data]
        this.setState({ trailInfo: data })
      }
    })
  }

  async getInfo() {
    API.getInfo().then(([code, data, header]) => {
      if (code == '200') {
        console.log("Info: ", data)
        this.setState({ info: data })
        this.setState({ dataFetched: true })
      }
    })
  }

  async getUserInfo() {
    API.getUserInfo().then(([code, data, header]) => {
      if (code == '200') {
        console.log("UserData: ", data)
        this.setState({ userInfo: data })
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

  async _onRefresh() {
    await Promise.all([this.getInfo(), this.getTrailInfo(), this.getUserInfo()])
  }

  setDistrictValue(callback) {
    this.setState((state) => {
      return {
        districtValue: callback(state.districtValue)
      }
    })
  }

  setDistrictOpen(open) {
    this.setState({ districtOpen: open })
  }

  resetVal() {
    this.setState({ districtValue: '' })
  }


  render() {

    const recentInfo = this.state.info.map((data, index) => (
      <TouchableOpacity key={index} onPress={() => { this.props.navigation.navigate("InfoDetail", {data: data}) }}>
        <View style={[localStyles.infoItemContainer]}>
          <Image style={localStyles.bgImage} source={{ uri: data.image, cache:'force-cache'}} resizeMode="cover" defaultSource={require("../assets/loading.png")}/>
          <View style={localStyles.TextContainer}>
            <Text style={localStyles.InfoText}>種類： {data.type}</Text>
            <Text style={localStyles.InfoText}>地區： {data.district}</Text>
            <Text style={localStyles.InfoText}>路線： {data.trail}</Text>
          </View>
        </View>
      </TouchableOpacity>

    ))

    const trailSearch = this.state.trailInfo.filter((data) => {
      return data.district.toLowerCase().includes(this.state.districtValue.toLowerCase()) && data.title.toLowerCase().includes(this.state.searchText.toLowerCase())
    })


    console.log("TrailSearch: ", trailSearch)

    const trailInfo = trailSearch.map((data, index) => (
      <View style={localStyles.discoverItemContainer} key={index} >
        <TouchableOpacity onPress={() => { data.title == '其他'? console.log('TITLE: ', data.title):this.props.navigation.navigate("InfoByTrail", {trail: data.title, id: data._id}) }}>
          <ImageBackground
            source={{ uri: data.image[0] }}
            style={localStyles.imageBG}
            imageStyle={{ opacity: 0.8 }}
          >
            <Text style={localStyles.regionText}>{data.title}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    ))

    const emptyTrail = (
      <View style={[localStyles.emptyTextContainer]}>
        <View style={[localStyles.emptyContent]}>
          <Text style={[localStyles.emptyText, localStyles.textCenter]}>
            沒有相關路線
          </Text>

        </View>
      </View>
    )

    const MyInfo = this.state.userInfo.info.length>0 ? this.state.userInfo.info.slice(0).reverse().map((data, index) => (
      <TouchableOpacity key={index} onPress={() => { this.props.navigation.navigate("InfoDetail", {data: data}) }}>
        <View style={[localStyles.infoItemContainer]}>
          <Image style={localStyles.bgImage} source={{ uri: data.image, cache:'force-cache' }} resizeMode="cover" defaultSource={require("../assets/loading.png")}/>
          <View>
            <Text style={localStyles.InfoText}>種類： {data.type}</Text>
            <Text style={localStyles.InfoText}>地區： {data.district}</Text>
            <Text style={localStyles.InfoText}>路線： {data.trail}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ))
      :
      (
        <View style={[localStyles.emptyTextContainer, { width: '90%'}]}>
          <View style={[localStyles.emptyContent]}>
            <Text style={[localStyles.emptyText, localStyles.textCenter]}>
              你暫時沒有提供任何資訊
            </Text>

          </View>
        </View>
      )

    const AllInfo = (
      <>
        <TouchableOpacity onPress={() => { this.props.navigation.navigate("InfoProvide", { data: this.state.trailInfo }) }}>
          <View style={[localStyles.buttonContainer]}>
            <View style={[localStyles.addButton]}>
              <MaterialIcons style={[localStyles.buttonIcon]} name="add-box" size={24} color="white" />
              <Text style={[localStyles.textCenter, localStyles.addText]}>提供資訊</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View style={[localStyles.buttonContainer]}>
            <View style={[localStyles.addButton, {backgroundColor: '#009dff'}]}>
              <MaterialIcons style={[localStyles.buttonIcon]} name="gps-fixed" size={24} color="white" />
              <Text style={[localStyles.textCenter, localStyles.addText]}>附近的資訊</Text>
            </View>
          </View>
        </TouchableOpacity>

        <ScrollView style={localStyles.InfoContainer} horizontal>
          {recentInfo}
        </ScrollView>

        <View style={localStyles.infoByTrail}>
          <Text style={localStyles.infoText}>探索不同路線的資訊</Text>
        </View>

        <View style={[localStyles.inputContainer]}>
          <View style={[localStyles.searchBar]}>
            <Entypo size={26}
              name='magnifying-glass'
              style={localStyles.inputLogo}
            />
            <TextInput
              style={{ fontSize: 20, flex: 1, textAlignVertical: 'center' }}
              placeholder='搜尋路線(名稱）'
              autoCapitalize='none'
              autoCorrect={false}
              underlineColorAndroid='transparent'
              onChangeText={(searchText) => this.setState({ searchText })}
              value={this.state.searchText}
            />
            <TouchableOpacity onPress={() => { this.setState({ searchText: '' }) }}>
              <AntDesign
                name="close"
                size={26}
                style={localStyles.inputLogo}
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={localStyles.filterButton} onPress={() => { this.setState({ modal: true }) }}>
          <View style={{ flexDirection: 'row' }}>
            <AntDesign name="filter" size={15} color='black' />
            <Text>篩選</Text>
          </View>
        </TouchableOpacity>

        <View style={localStyles.TrailsContainer}>
          {trailInfo.length > 0 ? trailInfo : emptyTrail}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal}
          onRequestClose={() => {
            this.setState({ modal: false })
          }}
        >
          <View style={localStyles.ModalContainer}>
            <View style={localStyles.filterContainer}>
              <View style={localStyles.TitleBarContainer}>
                <View>
                  <TouchableOpacity onPress={() => { this.setState({ modal: false }) }}>
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View>
                  <Text style={{ fontSize: 22, fontWeight: 'bold' }}>篩選</Text>
                </View>
                <View>
                  <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => { this.resetVal() }}>
                    <Text style={{ fontSize: 18, marginLeft: 5 }}>重設</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ marginTop: 10 }}>

                <Text style={localStyles.formText}>地區</Text>
                <DropDown
                  open={this.state.districtOpen}
                  value={this.state.districtValue}
                  items={this.state.districtItem}
                  setOpen={this.setDistrictOpen}
                  setValue={this.setDistrictValue}
                  onChangeValue={(value) => {
                    console.log("value", value);
                  }}
                  style={localStyles.dropdown}
                  placeholder="地區"
                  placeholderStyle={localStyles.dropdownText}
                  zIndex={3000}
                  zIndexInverse={1000}
                  textStyle={localStyles.dropdownText}
                  dropDownContainerStyle={localStyles.dropdownContainer}
                  listMode="SCROLLVIEW"
                  scrollViewProps={{
                    persistentScrollbar: true
                  }}
                  listItemContainerStyle={localStyles.itemContainer}
                />
              </View>
            </View>
          </View>


        </Modal>
      </>
    )

    return this.state.dataFetched ? (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"} keyboardVerticalOffset={Platform.OS == 'ios' ? 90 : -300}>
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
              <View style={[this.getTabStyle('MyInfo')]}>
                <TouchableOpacity onPress={() => this.setState({ tab: 'MyInfo' })}>
                  <Text adjustsFontSizeToFit numberOfLines={1} style={this.state.tab == 'MyInfo' ? [localStyles.tabActiveText] : [localStyles.tabText]}>我提供的資訊</Text>
                </TouchableOpacity>
              </View>
            </View>
             
             {this.state.tab == "Info"? AllInfo: MyInfo}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginLeft: 20
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
    paddingBottom: 15,
    width: '100%',
    flexDirection: 'row'
  },
  buttonIcon: {
    marginRight: 10
  },
  addButton: {
    width: '80%',
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
  tabsContainer: {
    height: 40,
    paddingRight: 20,
    paddingBottom: 55,
  },
  row: {
    flexDirection: 'row',
  },
  InfoContainer: {
    marginRight: 20,
    paddingBottom: 20

  },
  infoItemContainer: {
    height: 320,
    width: 350,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    marginTop: 20,
    marginRight: 20,

  },
  bgImage: {
    width: 350,
    height: 200,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    marginBottom: 10
  },
  InfoText: {
    color: "black",
    fontSize: 18,
    marginBottom: 10,
    marginLeft: 10
  },
  infoByTrail: {
    marginRight: 30,
    marginTop: 20
  },
  infoText: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  inputContainer: {
    width: '90%',
    marginTop: 20,

  },
  searchBar: {
    height: 45,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(0,0,0)',
    flexDirection: 'row',
  },
  inputLogo: {
    paddingTop: 8,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#D4D4D4'
  },
  filterButton: {
    width: 80,
    height: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ModalContainer: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  filterContainer: {
    marginRight: 20,
    marginTop: 80,
    marginLeft: 20,
  },
  TitleBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  formText: {
    color: 'black',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
  },
  dropdown: {
    borderColor: 'rgba(45, 74, 105, 1)',
    marginTop: 20,
    marginBottom: 5,
    height: 50,
    width: '100%',
    borderRadius: 1,
  },
  dropdownContainer: {
    borderColor: 'rgba(45, 74, 105, 1)',
    width: '100%',
    marginTop: 20,
  },
  dropdownText: {
    color: 'rgba(45, 74, 105, 1)',
    paddingLeft: 10,
  },
  itemContainer: {
    borderWidth: 0.5,
    borderColor: 'rgba(45, 74, 105, 1)',
    height: 55
  },
  discoverItemContainer: {
    width: 200,
    borderRadius: 25,
    borderWidth: 1,
    height: 100,
    marginTop: 20,
    marginRight: 20,
    overflow: 'hidden', // keep the image in the container
    backgroundColor: 'black'
  },
  imageBG: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  regionText: {
    color: 'white',
    fontSize: 24
  },
  TrailsContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  ConfirmButton: {
    marginTop: 30,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#009dff',
  },
  buttonText: {
    color: 'white',
    fontSize: 20
  },
  emptyTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '80%'
  },
  emptyContent: {
    width: '100%',
    padding: 20,
    backgroundColor: 'rgb(220,220,220)',
    borderRadius: 27.5,
  },
  emptyText: {
    color: 'rgba(125, 125, 125, 1)',
    fontSize: 20,
    fontWeight: '400',
  },


})

export default Info