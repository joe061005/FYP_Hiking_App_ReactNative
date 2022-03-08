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
import MapView, { Marker, Polyline } from "react-native-maps";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { SliderBox } from "react-native-image-slider-box"
import { Ionicons, MaterialIcons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component-2';
import * as Progress from 'react-native-progress'
import API from "../Api/api"

class DetailByDistrict extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            region: {},
            startTableHead: ['交通', '路線', '下車點', '備註'],
            endTableHead: ['交通', '路線', '上車點', '備註'],
            data: { time: '', star: [], path: [{ latitude: 0, longitude: 0 }], xlabel: [], marker: [], trafficStart: [], trafficEnd: [] },
            dataFetched: false,
            Info: [],
            relatedTrails: []
        }
        this.handleBackButton = this.handleBackButton.bind(this)
        this.getInfo = this.getInfo.bind(this)
        this.getInfoByTrail = this.getInfoByTrail.bind(this)
        this.getRelatedTrail = this.getRelatedTrail.bind(this)
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
        await Promise.all([this.getInfo(), this.getInfoByTrail(), this.getRelatedTrail()])


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

    async getInfo() {
        API.getTrailByTitle(this.props.route.params.title).then(([code, data, header]) => {
            if (code == '200') {
                console.log("trailData: ", data)
                this.setState({ data: data[0] })
                this.setState({ dataFetched: true })
            }
        })
    }

    async getInfoByTrail() {
        API.getInfoByTrail(this.props.route.params.id).then(([code, data, header]) => {
            if (code == '200') {
                this.setState({ Info: data })

            }
        })
    }

    async getRelatedTrail() {
        API.getRelatedTrail(this.props.route.params.title).then(([code, data, header]) => {
            if (code == '200') {
                console.log("relatedTrails: ", data)
                this.setState({ relatedTrails: data })
            }
        })
    }




    render() {

        //console.log("ID: ", this.props.route.params.id)

        const hikingTrailData = this.state.relatedTrails.map((data, index1) =>
            <TouchableOpacity key={index1} onPress={() => this.props.navigation.push("DetailByDistrict", { title: data.title, id: data._id })}>
                <View style={localStyles.trailContainer}>
                    <Image style={localStyles.bgImage} source={{ uri: data.image[0], cache: 'force-cache' }} />
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
                        <Text style={localStyles.TrailText}>地區：{data.district} ({data.place}) </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )

        const hiking_trail = (
            <View>
                <SliderBox
                    images={this.state.data.image}
                    sliderBoxHeight={300}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE"
                    autoplay
                    circleLoop
                />

                <View style={localStyles.trailInfoContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <View>
                            <Text style={localStyles.TitleText}>路線資料</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate("Info", { trail: this.props.route.params.title, data: this.state.Info }) }}>
                                <View style={[localStyles.buttonContainer]}>
                                    <View style={[localStyles.addButton, { width: '100%', backgroundColor: '#009dff' }]}>
                                        <Entypo style={[localStyles.buttonIcon]} name="info-with-circle" size={24} color="white" />
                                        <Text style={[localStyles.textCenter, localStyles.addText]}>路線資訊</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={localStyles.InfoContainer}>
                        <View style={localStyles.InfoItemContainer}>
                            <View style={localStyles.InfoTitleContainer}>
                                <Ionicons name="time" size={20} color="black" />
                                <Text style={localStyles.InfoText}>時間</Text>
                            </View>
                            {this.state.data.time.split(".")[0] == '0' ?
                                <Text style={localStyles.InfoText}>{this.state.data.time.split(".")[1]}分鐘</Text>
                                :
                                this.state.data.time.split(".")[1] == '0' ?
                                    <Text style={localStyles.InfoText}>{this.state.data.time.split(".")[0]}小時</Text>
                                    :
                                    <Text style={localStyles.InfoText}>{this.state.data.time.split(".")[0]}小時 {this.state.data.time.split(".")[1]}分鐘</Text>
                            }
                        </View>
                        <View style={localStyles.InfoItemContainer}>
                            <View style={localStyles.InfoTitleContainer}>
                                <MaterialIcons name="directions-walk" size={20} color="black" />
                                <Text style={localStyles.InfoText}>長度</Text>
                            </View>
                            <Text style={localStyles.InfoText}>{this.state.data.distance}公里</Text>
                        </View>
                        <View style={localStyles.InfoItemContainer}>
                            <View style={localStyles.InfoTitleContainer}>
                                <FontAwesome name="star" size={20} color="black" />
                                <Text style={localStyles.InfoText}>難度</Text>
                            </View>
                            <Text style={localStyles.InfoText}>{this.state.data.star.filter((star) => { return star == '1' }).length}星</Text>
                        </View>
                    </View>
                </View>

                <View style={localStyles.mapContainer}>
                    <Text style={localStyles.TitleText}>路線圖</Text>
                    <MapView
                        region={{
                            latitude: this.state.data.path[0].latitude,
                            longitude: this.state.data.path[0].longitude,
                            latitudeDelta: 0.0222,
                            longitudeDelta: 0.0221
                        }}
                        style={localStyles.map}
                        showsUserLocation={true}
                    >
                        {this.state.data.marker.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={marker.latlong}
                                title={marker.title}
                            />
                        ))}
                        <Polyline
                            coordinates={this.state.data.path}
                            strokeColor="#000"
                            strokeWidth={3}
                        />
                    </MapView>
                </View>

                <View style={localStyles.eleGraphContainer}>
                    <Text style={localStyles.TitleText}>高度圖</Text>
                    <LineChart
                        data={{
                            labels: this.state.data.xlabel,
                            datasets: [
                                {
                                    data: this.state.data.ylabel

                                }
                            ]
                        }}
                        width={Dimensions.get("window").width - 10} // from react-native
                        height={300}
                        yAxisSuffix="m"
                        yAxisInterval={50} // optional, defaults to 1
                        chartConfig={{
                            backgroundColor: "rgb(255,255,255)",
                            backgroundGradientFrom: '#fff',
                            backgroundGradientTo: '#fff',
                            decimalPlaces: 2, // optional, defaults to 2dp
                            color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,

                        }}
                        withDots={false}
                        bezier
                        style={{
                            marginVertical: 8,
                            marginLeft: -15,
                            marginRight: -30
                        }}
                        formatXLabel={(value) => this.state.data.xlabel[0] == value ||
                            this.state.data.xlabel[Math.round(this.state.data.xlabel.length * 0.2)] == value ||
                            this.state.data.xlabel[Math.round(this.state.data.xlabel.length * 0.4)] == value ||
                            this.state.data.xlabel[Math.round(this.state.data.xlabel.length * 0.6)] == value ||
                            this.state.data.xlabel[Math.round(this.state.data.xlabel.length * 0.8)] == value ||
                            this.state.data.xlabel[Math.round(this.state.data.xlabel.length - 1)] == value
                            ?
                            `${Math.round(value * 10) / 10}km` : ''
                        }
                        formatYLabel={(value) =>
                            Math.round(value)
                        }
                    />

                </View>

                <View style={localStyles.descContainer}>
                    <Text style={localStyles.TitleText}>簡介</Text>
                    <Text style={localStyles.descText}>{this.state.data.description}</Text>
                </View>

                <View style={localStyles.descContainer}>
                    <Text style={localStyles.TitleText}>起點交通</Text>
                    <View style={localStyles.TableContainer}>
                        <Table borderStyle={{ borderWidth: 1 }}>
                            <Row data={this.state.startTableHead} flexArr={[1, 2, 1, 1]} style={localStyles.TableHead} textStyle={localStyles.TableTitleText} />
                            {this.state.data.trafficStart.map((info, index) => (
                                <Row key={index} data={Object.values(info).slice(0, 4)} flexArr={[1, 2, 1, 1]} style={localStyles.TableRow} textStyle={localStyles.TableText} />
                            ))}

                        </Table>
                    </View>
                </View>

                <View style={localStyles.descContainer}>
                    <Text style={localStyles.TitleText}>終點交通</Text>
                    <View style={localStyles.TableContainer}>
                        <Table borderStyle={{ borderWidth: 1 }}>
                            <Row data={this.state.endTableHead} flexArr={[1, 2, 1, 1]} style={localStyles.TableHead} textStyle={localStyles.TableTitleText} />
                            {this.state.data.trafficEnd.map((info, index) => (
                                <Row key={index} data={Object.values(info).slice(0, 4)} flexArr={[1, 2, 1, 1]} style={localStyles.TableRow} textStyle={localStyles.TableText} />
                            ))}

                        </Table>
                    </View>
                </View>

                <View style={localStyles.RefContainer}>
                    <Text style={localStyles.RefText}>資料由FolloMe隨我行提供</Text>
                </View>

                <View style={[localStyles.descContainer, {marginTop: 80}]}>
                    <Text style={localStyles.TitleText}>更多路線</Text>
                    <ScrollView style={localStyles.trailItemContainer} horizontal>
                        {hikingTrailData}
                    </ScrollView>
                </View>




            </View>
        )
        return this.state.dataFetched ? (
            <ScrollView style={localStyles.Container}>
                <View style={localStyles.HomeContent}>
                    {hiking_trail}
                </View>
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
    HomeContent: {
        paddingBottom: 30,
        minHeight: '100%',
    },
    map: {
        height: 300
    },
    mapContainer: {
        marginTop: 20,
    },
    TitleText: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        marginLeft: 10
    },
    eleGraphContainer: {
        marginTop: 20
    },
    trailInfoContainer: {
        marginTop: 20
    },
    InfoContainer: {
        flexDirection: 'row',

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
    InfoText: {
        fontSize: 16
    },
    InfoTitleContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    descContainer: {
        marginTop: 20
    },
    descText: {
        marginLeft: 10,
        fontSize: 18
    },
    TableContainer: {
        padding: 16,
        paddingTop: 20,
    },
    TableHead: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    TableRow: {
        height: 150
    },
    TableTitleText: {
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center'
    },
    TableText: {
        textAlign: 'center',
        fontSize: 18
    },
    RefContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    RefText: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    buttonContainer: {
        marginLeft: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        //paddingTop: 10,
        backgroundColor: 'white',
        paddingBottom: 15,
        width: '60%',
        flexDirection: 'row',
        marginTop: -2
    },
    buttonIcon: {
        marginRight: 10
    },
    addButton: {
        width: '80%',
        height: 30,
        backgroundColor: 'rgba(45, 74, 105, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 27.5,
        flexDirection: 'row'
        //marginBottom: 15
    },
    addText: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 1)',
        fontWeight: '900'
    },
    textCenter: {
        textAlign: 'center',
        justifyContent: 'center'
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


})

export default DetailByDistrict;