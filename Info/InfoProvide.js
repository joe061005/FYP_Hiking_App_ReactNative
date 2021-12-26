import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Dimensions,
  Platform,
  Modal,
  Alert
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import API from "../Api/api"
import { MaterialIcons, Entypo, AntDesign } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'
import DropDown from "react-native-dropdown-picker";
import * as Location from 'expo-location';
import { Button } from "react-native-paper"
import * as ImagePicker from "expo-image-picker"
import Spinner from 'react-native-loading-spinner-overlay'
import MapView, { Marker, Polyline } from "react-native-maps";





class InfoProvide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trailInfo: this.props.route.params.data,
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
      trailItem: [],
      districtOpen: false,
      districtValue: "",
      trailOpen: false,
      trailValue: "",
      typeOpen: false,
      typeValue: "",
      typeItem: [
        { label: "停車場", value: "停車場" },
        { label: "飲食", value: "飲食" },
        { label: "休息埸地", value: "休息埸地" },
        { label: "廁所", value: "廁所" },
        { label: "康樂", value: "康樂" },
        { label: "景點", value: "景點" },
        { label: "交通", value: "交通" },
        { label: "危險告示", value: "危險告示" },
        { label: "其他", value: "其他" },
      ],
      text: "",
      location: null,
      errorMsg: null,
      modal: false,
      selectedImage: null,
      spinner: false

    }
    this.handleBackButton = this.handleBackButton.bind(this)
    this.setDistrictOpen = this.setDistrictOpen.bind(this)
    this.setDistrictValue = this.setDistrictValue.bind(this)
    this.setTrailOpen = this.setTrailOpen.bind(this)
    this.setTrailValue = this.setTrailValue.bind(this)
    this.setTrailItem = this.setTrailItem.bind(this)
    this.setTypeValue = this.setTypeValue.bind(this)
    this.setTypeOpen = this.setTypeOpen.bind(this)
    this.getLocation = this.getLocation.bind(this)
    this.pickFromCamera = this.pickFromCamera.bind(this)
    this.pickFromGallery = this.pickFromGallery.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.submitData = this.submitData.bind(this)
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

  setTrailValue(callback) {
    this.setState((state) => {
      return {
        trailValue: callback(state.trailValue)
      }
    })
  }

  setTrailOpen(open) {
    this.setState({ trailOpen: open })
  }

  setTrailItem(district) {
    let trailList = this.state.trailInfo.filter(
      (data) => {
        return (
          data.district == district
        )
      }
    )
    trailList = [{ title: '其他' }, ...trailList]
    this.setState({ trailItem: trailList })
  }

  setTypeValue(callback) {
    this.setState((state) => {
      return {
        typeValue: callback(state.typeValue)
      }
    })
  }

  setTypeOpen(open) {
    this.setState({ typeOpen: open })
  }

  async getLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      this.setState({ errorMsg: '你需要提供授權才可以分享位置' })
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location })
    this.setState({ errorMsg: null })
    console.log("LOCATION", this.state.location)
  }

  async pickFromGallery() {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (data.cancelled === false) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        //handleUpload(newfile);
        this.setState({ selectedImage: newfile })
        this.setState({ modal: false })
      }
    } else {
      Alert.alert("you need to give permission!");
    }
  }

  async pickFromCamera() {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        //allowsEditing: true
      });
      if (data.cancelled === false) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        //handleUpload(newfile);
        this.setState({ selectedImage: newfile })
        this.setState({ modal: false })
      }
    } else {
      Alert.alert("you need to give permission!");
    }
  }

  async handleUpload() {
    const data = new FormData();
    data.append("file", this.state.selectedImage);
    data.append("upload_preset", "hikingApp");
    data.append("cloud_name", "dlcjgtv2p");

    let result;

    await fetch("https://api.cloudinary.com/v1_1/dlcjgtv2p/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((Result) => {
        result = Result;
      })
      .catch((err) => {
        Alert.alert("sothing went wrong");
      });
    return result;
  }

  async submitData() {
    if (!this.state.typeValue || !this.state.text || !this.state.location || !this.state.selectedImage || !this.state.districtValue || !this.state.trailValue) {
      Alert.alert(
        '溫馨提示',
        '請填寫所有資料',
        [
          { text: '確定', onDismiss: () => { } }
        ]
      )
      return;
    }
    this.setState({ spinner: !this.state.spinner })
    const data = await this.handleUpload();
    console.log("data", data.url)

    var params = {
      type: this.state.typeValue,
      description: this.state.text,
      location: { latitude: parseFloat(this.state.location.coords.latitude), longitude: parseFloat(this.state.location.coords.longitude) },
      image: data.url,
      district: this.state.districtValue,
      trail: this.state.trailValue
    }
    console.log("PARAM", params)

    API.addInfo(params).then(([code, data, header]) => {
      if (code == '200') {
        console.log("InfoData: ", data)
        this.setState({ spinner: !this.state.spinner })
        setTimeout(() => {
          Alert.alert('提示', '己提交資訊!', [{ text: '確定', onPress: () => {this.props.navigation.goBack()} }])
        }, 200)  
      } else if (code == '400') {
        console.log("error")
        this.setState({ spinner: !this.state.spinner })
        setTimeout(() => {
          Alert.alert('提示', '未能提交資訊，請稍後再試', [{ text: '確定' }])
        }, 200)  
      }
    })

  }


  render() {
    return (
      <ImageBackground
        style={localStyles.Container}
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
            <Text style={localStyles.formText}>資訊種類<Text style={{ color: 'red' }}> *</Text></Text>
            <DropDown
              open={this.state.typeOpen}
              value={this.state.typeValue}
              items={this.state.typeItem}
              setOpen={this.setTypeOpen}
              setValue={this.setTypeValue}
              onChangeValue={(value) => {
                console.log("value", value);
              }}
              //onPress={(open) => console.log('was the picker open?', open)}
              style={localStyles.dropdown}
              placeholder="資訊種類"
              placeholderStyle={localStyles.dropdownText}
              zIndex={3000}
              zIndexInverse={1000}
              textStyle={localStyles.dropdownText}
              dropDownContainerStyle={localStyles.dropdownContainer}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                persistentScrollbar: true,
              }}
              listItemContainerStyle={localStyles.itemContainer}
            />

            <Text style={localStyles.formText}>地區<Text style={{ color: 'red' }}> *</Text></Text>
            <DropDown
              open={this.state.districtOpen}
              value={this.state.districtValue}
              items={this.state.districtItem}
              setOpen={this.setDistrictOpen}
              setValue={this.setDistrictValue}
              onChangeValue={(value) => {
                console.log("value", value);
                this.setTrailItem(value)
              }}
              //onPress={(open) => console.log('was the picker open?', open)}
              style={localStyles.dropdown}
              placeholder="地區"
              placeholderStyle={localStyles.dropdownText}
              zIndex={2000}
              zIndexInverse={2000}
              textStyle={localStyles.dropdownText}
              dropDownContainerStyle={localStyles.dropdownContainer}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                persistentScrollbar: true
              }}
              listItemContainerStyle={localStyles.itemContainer}
            />

            <Text style={localStyles.formText}>路線<Text style={{ color: 'red' }}> *</Text></Text>
            <DropDown
              disabledStyle={{
                opacity: 0.3
              }}
              searchPlaceholder="尋找路線"
              searchable={true}
              disabled={this.state.trailItem.length > 0 ? false : true}
              schema={{ label: 'title', value: 'title' }}
              open={this.state.trailOpen}
              value={this.state.trailValue}
              items={this.state.trailItem}
              setOpen={this.setTrailOpen}
              setValue={this.setTrailValue}
              onChangeValue={(value) => {
                console.log("value", value);
              }}
              //onPress={(open) => console.log('was the picker open?', open)}
              style={localStyles.dropdown}
              placeholder="路線"
              placeholderStyle={localStyles.dropdownText}
              zIndex={1000}
              zIndexInverse={3000}
              textStyle={localStyles.dropdownText}
              dropDownContainerStyle={localStyles.dropdownContainer}
              listMode="SCROLLVIEW"
              ListEmptyComponent={({
                listMessageContainerStyle, listMessageTextStyle, ActivityIndicatorComponent, loading, message
              }) => (
                <View style={listMessageContainerStyle}>
                  {loading ? (
                    <ActivityIndicatorComponent />
                  ) : (
                    <Text style={listMessageTextStyle}>
                      沒有相關路線
                    </Text>
                  )}
                </View>
              )}
              scrollViewProps={{
                persistentScrollbar: true
              }}
              listItemContainerStyle={localStyles.itemContainer}
            />

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

            <Text style={localStyles.formText}>地點<Text style={{ color: 'red' }}> *</Text></Text>
            {this.state.errorMsg ?
              <Text style={[localStyles.formText, { color: 'red' }]}>{this.state.errorMsg}</Text>
              : null
            }
            {this.state.location ?
              <MapView
                region={{
                  latitude: this.state.location.coords.latitude,
                  longitude: this.state.location.coords.longitude,
                  latitudeDelta: 0.0222,
                  longitudeDelta: 0.0221
                }}
                style={{ height: 300 , marginLeft:20, marginTop: 10}}
                showsUserLocation={true}
              >
                <Marker
                  coordinate={{ latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude }}
                  title={'現時的位置'}
                />
              </MapView>
              :
              <TouchableOpacity onPress={async () => { await this.getLocation() }}>
                <View style={[localStyles.buttonContainer]}>
                  <View style={[localStyles.addButton]}>
                    <Entypo style={[localStyles.buttonIcon]} name="location" size={24} color="white" />
                    <Text style={[localStyles.textCenter, localStyles.addText]}>分享位置</Text>
                  </View>
                </View>
              </TouchableOpacity>
            }

            <Text style={localStyles.formText}>圖片<Text style={{ color: 'red' }}> *</Text></Text>
            {this.state.selectedImage &&
              <Image
                source={{ uri: this.state.selectedImage.uri }}
                style={localStyles.thumbnail}
              />
            }
            <TouchableOpacity onPress={() => { this.setState({ modal: true }) }}>
              <View style={[localStyles.buttonContainer]}>
                <View style={[localStyles.addButton]}>
                  <Entypo style={[localStyles.buttonIcon]} name="upload" size={24} color="white" />
                  <Text style={[localStyles.textCenter, localStyles.addText]}>上載圖片</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modal}
              onRequestClose={() => {
                this.setState({ modal: false })
              }}
            >
              <View style={localStyles.modalView}>
                <View style={localStyles.modalButtonView}>
                  <Button
                    icon="camera"
                    mode="contained"
                    onPress={async () => {
                      await this.pickFromCamera();
                    }}
                    theme={theme}
                  >
                    camera
                  </Button>
                  <Button
                    icon="image-area"
                    mode="contained"
                    onPress={async () => {
                      await this.pickFromGallery();
                    }}
                    theme={theme}
                  >
                    gallery
                  </Button>
                </View>
                <Button onPress={() => this.setState({ modal: false })} theme={theme}>
                  cancel
                </Button>
              </View>
            </Modal>

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

  }
}

const theme = {
  colors: {
    primary: "#006aff",
  },
};

const localStyles = StyleSheet.create({
  Container: {
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
  dropdown: {
    borderColor: 'rgba(45, 74, 105, 1)',
    marginTop: 20,
    marginBottom: 5,
    height: 50,
    width: 300,
    borderRadius: 1,
    marginLeft: 20
  },
  dropdownContainer: {
    borderColor: 'rgba(45, 74, 105, 1)',
    width: 300,
    marginTop: 20,
    marginLeft: 20
  },
  dropdownText: {
    color: 'rgba(45, 74, 105, 1)',
    paddingLeft: 10,
  },
  formText: {
    color: 'black',
    fontSize: 20,
    marginTop: 10,
    fontWeight: 'bold',
    marginLeft: 20
  },
  itemContainer: {
    borderWidth: 0.5,
    borderColor: 'rgba(45, 74, 105, 1)',
    height: 55
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
  modalView: {
    position: "absolute",
    bottom: (Platform.OS === 'ios') ? 100 : 70,
    width: "100%",
    backgroundColor: "white",
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginLeft: 20,
  },
  submitButtonContainer: {
    marginTop: 20,
    marginLeft: 20,
    justifyContent: 'center',
    width: 300,
    height: 50
  }



})

export default InfoProvide;