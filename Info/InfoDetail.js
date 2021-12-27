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
import { MaterialIcons, Entypo, AntDesign, MaterialCommunityIcons, Foundation } from "@expo/vector-icons"
import * as Progress from 'react-native-progress'
import DropDown from "react-native-dropdown-picker";
import MapView, { Marker, Polyline } from "react-native-maps";



class InfoDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

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


    render() {
        const { data } = this.props.route.params
        console.log("InfoDetailData: ", data)
        return (
            <ScrollView style={localStyles.Container}>
                <Image source={{ uri: data.image }} resizeMode="cover" style={localStyles.image} />
                <View style={localStyles.InfoContainer}>
                    <View style={localStyles.InfoItemContainer}>
                        <View style={localStyles.InfoTitleContainer}>
                            <MaterialIcons name="location-pin" size={20} color="black" />
                            <Text style={localStyles.InfoText}>地區</Text>
                        </View>
                        <Text style={localStyles.InfoText}>{data.district}</Text>
                    </View>
                    <View style={localStyles.InfoItemContainer}>
                        <View style={localStyles.InfoTitleContainer}>
                            <Foundation name="mountains" size={20} color="black" />
                            <Text style={localStyles.InfoText}>路線</Text>
                        </View>
                        <Text style={localStyles.InfoText}>{data.trail}</Text>
                    </View>
                    <View style={localStyles.InfoItemContainer}>
                        <View style={localStyles.InfoTitleContainer}>
                            <MaterialCommunityIcons name="information" size={20} color="black" />
                            <Text style={localStyles.InfoText}>資訊類型</Text>
                        </View>
                        <Text style={localStyles.InfoText}>{data.type}</Text>
                    </View>
                </View>
                <Text style={[localStyles.TitleText, { marginLeft: 10 }]}>地圖</Text>
                <MapView
                    region={{
                        latitude: data.location.latitude,
                        longitude: data.location.longitude,
                        latitudeDelta: 0.0022,
                        longitudeDelta: 0.0021
                    }}
                    style={{ height: 300, marginTop: 10 }}
                    showsUserLocation={true}
                >
                    <Marker
                        coordinate={{ latitude: data.location.latitude, longitude: data.location.longitude }}
                        title={'位置'}
                    />
                </MapView>

                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={localStyles.TitleText}>詳情</Text>
                    <Text style={localStyles.ContentText}>{data.description}</Text>
                </View>

            </ScrollView>
        )
    }
}

const localStyles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: 'rgb(255,255,255)'
    },
    image: {
        width: '100%',
        height: 250
    },
    TitleText: {
        fontWeight: 'bold',
        fontSize: 25,
        marginTop: 20,
    },
    ContentText: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10
    },
    InfoContainer: {
        flexDirection: 'row',
        marginTop: 20

    },
    InfoItemContainer: {
        flex: 0.33,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        borderRadius: 10,
        backgroundColor: '#edf6fb',
        margin: 10
    },
    InfoTitleContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    InfoText: {
        fontSize: 16
      },

})

export default InfoDetail