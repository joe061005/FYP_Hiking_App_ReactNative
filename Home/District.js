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
  Platform,
  Alert
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import API from "../Api/api"
import { FontAwesome, Entypo, AntDesign } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'

class District extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trails: [],
      //refreshing: false,
      //dataFetched: false,
      searchText: ''
    }
    this.handleBackButton = this.handleBackButton.bind(this)
    //this.getTrails = this.getTrails.bind(this)
   // this._onRefresh = this._onRefresh.bind(this)
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
    //this.getTrails()

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


  // async getTrails() {
  //   API.getTrailsByDistrict(this.props.route.params.district).then(([code, data, header]) => {
  //     if (code == '200') {
  //       console.log(data.length)
  //       this.setState({ trails: data })
  //       this.setState({ dataFetched: true })
  //     }
  //   })
  // }

  _onRefresh() {
    this.getTrails();
  }

  render() {
    const emptyTrail = (
      <View style={[localStyles.emptyTextContainer]}>
        <View style={[localStyles.emptyContent]}>
          <Text style={[localStyles.emptyText, localStyles.textCenter]}>
            沒有相關路線
          </Text>

        </View>
      </View>
    )

    let trailSearch = this.props.route.params.data.filter(
      (data) => {
        return (
          (
            data.title.toLowerCase().includes(this.state.searchText.toLowerCase()) ||
            data.place.toLowerCase().includes(this.state.searchText.toLowerCase())
          )
        )
      }
    )
    // loop through the hiking trail data
    const hikingTrailData = trailSearch.map((data, index1) =>
      <TouchableOpacity key={index1} onPress={() => this.props.navigation.navigate("DetailByDistrict", { title: data.title })}>
        <View style={[localStyles.trailItemContainer, index1 == trailSearch.length - 1 ? { marginBottom: 100 } : {}]}>
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
            <Text style={localStyles.TrailText}>地區：{data.place} </Text>
          </View>
        </View>
      </TouchableOpacity>
    )

    return (
      <View style={localStyles.Container}>
        <Image source={{ uri: this.props.route.params.image }} style={localStyles.backgroundImage} />
        <ScrollView style={localStyles.trailContainer}>
          <View style={[localStyles.inputContainer]}>
            <View style={[localStyles.trailInput]}>
              <Entypo size={26}
                name='magnifying-glass'
                style={localStyles.inputLogo}
              />
              <TextInput
                style={{ fontSize: 20, flex: 1, textAlignVertical: 'center' }}
                placeholder='搜尋路線(名稱或地區）'
                autoCapitalize='none'
                autoCorrect={false}
                underlineColorAndroid='transparent'
                onChangeText={(searchText) => this.setState({ searchText })}
                value={this.state.searchText}
              />
              <TouchableOpacity onPress= { ()=> {this.setState({searchText: ''})}}>
                <AntDesign
                  name="close"
                  size={26}
                  style={localStyles.inputLogo}
                />
              </TouchableOpacity>
            </View>
          </View>
          {trailSearch.length > 0 ? hikingTrailData : emptyTrail}
        </ScrollView>

      </View>
    )
      // :
      // (
      //   <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
      //     <Progress.Circle size={60} indeterminate={true} style={{ color: "blue" }} />
      //   </View>
      // )
  }
}

const localStyles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: 'rgb(255,255,255)'
  },
  backgroundImage: {
    height: 300,
    width: Dimensions.get('window').width
  },
  trailContainer: {
    position: 'absolute',
    top: 200,
    width: Dimensions.get('window').width,
    height: '80%',
    backgroundColor: "white",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',


  },
  trailItemContainer: {
    height: 200,
    width: '90%',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgb(220,220,220)',
    marginTop: 20,
    marginLeft: 20,

  },
  bgImage: {
    width: '50%',
    height: 200,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'rgb(220,220,220)'
  },
  TextContainer: {
    marginTop: 20,
    marginLeft: 10,

  },
  TrailText: {
    color: "black",
    fontSize: 16,
    marginBottom: 10,

  },
  inputContainer: {
    width: '90%',
    marginTop: 20,
    marginLeft: 20,
  },
  trailInput: {
    height: 45,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgb(0,0,0)',
    flexDirection: 'row',
  },
  emptyTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  emptyContent: {
    width: '90%',
    padding: 20,
    backgroundColor: 'rgb(220,220,220)',
    borderRadius: 27.5,
  },
  emptyText: {
    color: 'rgba(125, 125, 125, 1)',
    fontSize: 20,
    fontWeight: '400',
  },
  textCenter: {
    textAlign: 'center',
    justifyContent: 'center'
  },
  inputLogo: {
    paddingTop: 8,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#D4D4D4'
  }


})

export default District;