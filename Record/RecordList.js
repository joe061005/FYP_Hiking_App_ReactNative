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



class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: []
    }
    this.getRecord = this.getRecord.bind(this)
    this.deleteRecord = this.deleteRecord.bind(this)
  }

  componentDidMount() {
    this.getRecord()
    //this.deleteRecord(0)
  }

  async getRecord() {
    const record = await API.getRecord()
    record && this.setState({ record })
    console.log("RecordList: ", this.state.record)
  }

  async deleteRecord(index) {
    if (await API.deleteRecord(index)) {
      this.setState(({ record }) => ({
        record: [...record.slice(0, index), ...record.slice(index + 1)]
      }))
    }
  }


  render() {
    return (
      <ScrollView style={localStyles.container}>
        {this.state.record.length > 0 ?
          this.state.record.map((data, index) => (
            <View style={localStyles.ItemContainer} key={index}>
              <MapView
                region={{
                  latitude: data.locationArr[0].latitude,
                  longitude: data.locationArr[0].longitude,
                  latitudeDelta: 0.0022,
                  longitudeDelta: 0.0021
                }}
                style={localStyles.MapView}
              >
                <Polyline
                  coordinates={data.locationArr}
                  strokeColor="#000"
                  strokeWidth={2}
                />

                <Marker
                  coordinate={data.locationArr[0]}
                  title={"開始"}
                />
              </MapView>
              <View style={{ marginLeft: 5 }}>
                <Text style={localStyles.Text}>{`日期: ${data.date}    總時間: ${data.totalTime}`}</Text>
                <TouchableOpacity onPress={() => { Alert.alert('提示', '確定要刪除此記錄嗎？', [{ text: '確定', onPress: () => { this.deleteRecord(index) } }, { text: '取消' }]) }} style={localStyles.DeleteButton}>
                  <MaterialIcons name='delete' size={24} color='white' />
                  <Text style={localStyles.deleteButtonText}>刪除</Text>
                </TouchableOpacity>
              </View>
            </View>

          ))
          
          :

          <View style={[localStyles.emptyTextContainer]}>
            <View style={[localStyles.emptyContent]}>
              <Text style={[localStyles.emptyText, localStyles.textCenter]}>
                沒有遠足記錄
              </Text>
            </View>
          </View>

        }
      </ScrollView>
    )
  }
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ItemContainer: {
    width: '90%',
    height: 400,
    margin: 20,
    backgroundColor: 'white',

  },
  MapView: {
    width: '100%',
    height: 300
  },
  Text: {
    fontSize: 18,
    marginBottom: 5

  },
  DeleteButton: {
    backgroundColor: '#f8344c',
    width: '50%',
    height: 40,
    borderRadius: 30,
    alignSelf: 'center',
    margin: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteButtonText: {
    fontSize: 20,
    color: 'white',
    marginLeft: 5
  },
  emptyTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: '100%'
  },
  emptyContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 27.5,
  },
  emptyText: {
    color: 'black',
    fontSize: 20,
    fontWeight: '400',
  },
  textCenter: {
    textAlign: 'center',
    justifyContent: 'center'
  },




})

export default Test;