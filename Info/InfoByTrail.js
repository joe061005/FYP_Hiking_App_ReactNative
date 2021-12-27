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
import Info from "./Info";
import MapView, { Marker, Polyline } from "react-native-maps";



class InfoByTrail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            dataFetched: false,
            //  searchText: '',
            modal: false,

            typeOpen: false,
            typeValue: [],
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
            Info: { info: [] },
            ItemPosition: [],


        }
        this.handleBackButton = this.handleBackButton.bind(this)
        this._onRefresh = this._onRefresh.bind(this)
        this.resetVal = this.resetVal.bind(this)
        this.setTypeValue = this.setTypeValue.bind(this)
        this.setTypeOpen = this.setTypeOpen.bind(this)
        this.getInfoByTrail = this.getInfoByTrail.bind(this)
        this.onMarkerPress = this.onMarkerPress.bind(this)
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
        this.getInfoByTrail();

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


    async _onRefresh() {
        await this.getInfoByTrail()
    }

    async getInfoByTrail() {
        API.getInfoByTrail(this.props.route.params.id).then(([code, data, header]) => {
            if (code == '200') {
                this.setState({ Info: data })
                this.setState({ dataFetched: true })
                console.log("INFOBYTRAIL: ", this.state.Info)

                // set an array for the 'scroll to' function
                let tempoArray = []
                this.state.Info.info.map((data) => {
                   tempoArray.push(0)
                })
                this.setState({ItemPosition: tempoArray})
            }
        })
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

    resetVal() {
        this.setState({ typeValue: [] })
    }

    onMarkerPress(index){
     // console.log("Marker Index:", index)
      //console.log("POSITIONARRAY: ", this.state.ItemPosition)
      this.myScrollView.scrollTo({
          x: 0,
          y: this.state.ItemPosition[index],
          animated: true
      })
    }


    render() {

        const infoSearch = this.state.Info.info.filter((data) => {
            if (this.state.typeValue.length == 0) {
                return true
            }

            return this.state.typeValue.includes(data.type)
        })

        const trailInfo = infoSearch.map((data, index) => (
            <TouchableOpacity
             key={index} 
             onPress={() => { this.props.navigation.navigate("InfoDetail", { data: data }) }}
             onLayout={(event) => {
                const layout = event.nativeEvent.layout;
              //  console.log("YCOOR: ", layout.y)
              //  console.log("INDEX: ", index)
             //   console.log("ITEM: ", data.type)
                this.setState(({ItemPosition}) => ({
                    ItemPosition: [
                        ...ItemPosition.slice(0,index),
                        layout.y,
                        ...ItemPosition.slice(index+1)
                    ]
                }))
                console.log("array: ", this.state.ItemPosition)
            }}
            >
                <View style={[localStyles.infoItemContainer]}>
                    <Image style={localStyles.bgImage} source={{ uri: data.image , cache:'force-cache'}} resizeMode="cover" defaultSource={require("../assets/loading.png")} />
                    <View style={localStyles.TextContainer}>
                        <Text style={localStyles.InfoText}>種類： {data.type}</Text>
                        <Text style={localStyles.InfoText}>地區： {data.district}</Text>
                        <Text style={localStyles.InfoText}>路線： {data.trail}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        ))

        const emptyInfo = (
            <View style={[localStyles.emptyTextContainer]}>
                <View style={[localStyles.emptyContent]}>
                    <Text style={[localStyles.emptyText, localStyles.textCenter]}>
                        沒有相關資訊
                    </Text>

                </View>
            </View>
        )

        const firstComponent = this.state.Info.info.length > 0 ?
            <MapView
                region={{
                    latitude: this.state.Info.info[0].location.latitude,
                    longitude: this.state.Info.info[0].location.longitude,
                    latitudeDelta: 0.0222,
                    longitudeDelta: 0.0221
                }}
                style={{ height: 300 }}
                showsUserLocation={true}
            >
                {infoSearch.map((data, index) => (
                    <Marker
                        coordinate={{ latitude: data.location.latitude, longitude: data.location.longitude }}
                        title={data.type}
                        key={index}
                        onPress={ (e) => {e.stopPropagation(); this.onMarkerPress(index)}}
                    />
                ))


                }
            </MapView>

            :


            <View style={[localStyles.emptyTextContainer]}>
                <View style={[localStyles.emptyContent]}>
                    <Text style={[localStyles.emptyText, localStyles.textCenter]}>
                        此路線暫時沒有任何資訊
                    </Text>

                </View>
            </View>

        const InfoComponent = (
            <View style={{ marginLeft: 20 }}>

                <TouchableOpacity style={localStyles.filterButton} onPress={() => { this.setState({ modal: true }) }}>
                    <View style={{ flexDirection: 'row' }}>
                        <AntDesign name="filter" size={15} color='black' />
                        <Text>篩選</Text>
                    </View>
                </TouchableOpacity>

                <View style={localStyles.TrailsContainer}>
                    {infoSearch.length > 0 ? trailInfo : emptyInfo}
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
                                <Text style={localStyles.formText}>資訊類型(你可以選擇多於一項）</Text>
                                <DropDown
                                    open={this.state.typeOpen}
                                    value={this.state.typeValue}
                                    items={this.state.typeItem}
                                    setOpen={this.setTypeOpen}
                                    setValue={this.setTypeValue}
                                    onChangeValue={(value) => {
                                        console.log("value", value);
                                    }}
                                    style={localStyles.dropdown}
                                    placeholder="資訊類型"
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
                                    multiple={true}
                                    min = {0}
                                    mode="BADGE"
                                />
                            </View>
                        </View>
                    </View>


                </Modal>
            </View>
        )


        return this.state.dataFetched ? (


            <ScrollView
                style={localStyles.Container}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}
                stickyHeaderIndices={[0]}
                ref = { (view) => {this.myScrollView = view}}
            >
                {firstComponent}
                {
                    this.state.Info.info.length > 0 ?
                        InfoComponent
                        :
                        null
                }

            </ScrollView>
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
    emptyTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '90%'
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
    textCenter: {
        textAlign: 'center',
        justifyContent: 'center'
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
    infoItemContainer: {
        height: 320,
        width: 350,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        marginTop: 20,
        marginRight: 20,

    },
    InfoText: {
        color: "black",
        fontSize: 18,
        marginBottom: 10,
        marginLeft: 10
    },
    bgImage: {
        width: 350,
        height: 200,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'black',
        marginBottom: 10
      },


})

export default InfoByTrail