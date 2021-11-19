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
  Platform
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

import {SliderBox} from "react-native-image-slider-box"

class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 22.4651820,
        longitude: 114.1804100,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0321,
      },
      marker: [
        {
          latlong: { latitude: 22.4651820, longitude: 114.1804100 },
          title: "鳯園總站"
        },
        {
          latlong: { latitude: 22.479406791388627, longitude: 114.18228682682371 },
          title: "沙螺洞"
        },
        {
          latlong: { latitude: 22.485865245995043, longitude: 114.18895678432449 },
          title: "平山仔"
        },
        {
          latlong: { latitude: 22.493260662552615, longitude: 114.19402182811217 },
          title: "屏風山"
        },
        {
          latlong: { latitude: 22.489589107967717, longitude: 114.2078570965482 },
          title: "黃嶺"
        },
        {
          latlong: { latitude: 22.48989914881963, longitude: 114.21515520297282 },
          title: "犁壁山"
        },
        {
          latlong: { latitude: 22.48646613472866, longitude: 114.22358877710758 },
          title: "純陽峰"
        },
        {
          latlong: { latitude: 22.484970257980606, longitude: 114.23402339084754 },
          title: "仙姑峰"
        },
        {
          latlong: { latitude: 22.47773627988647, longitude: 114.23538897841411 },
          title: "春風亭"
        },
        {
          latlong: { latitude: 22.4728190, longitude: 114.2331330 },
          title: "大美督"
        },
      ],
      images: ["https://i0.wp.com/follo3me.com/wp-content/uploads/2016/03/img_8612.jpg",
      "https://i2.wp.com/follo3me.com/wp-content/uploads/2016/03/img_8606.jpg",
      "https://i2.wp.com/follo3me.com/wp-content/uploads/2016/03/img_8610.jpg",
      "https://i0.wp.com/follo3me.com/wp-content/uploads/2016/05/wp-1462889257179.jpg",
      "https://i0.wp.com/follo3me.com/wp-content/uploads/2016/03/img_8608.jpg"
    
     ]
    }
    this.handleBackButton = this.handleBackButton.bind(this)
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


  render() {
    const data = [0.00, 0.02, 0.03, 0.04, 0.09, 0.11, 0.14, 0.16, 0.18, 0.20, 0.22, 0.24, 0.26, 0.30, 0.32, 0.35, 0.37, 0.43, 0.45, 0.47, 0.49, 0.51, 0.53, 0.55, 0.58, 0.60, 0.62, 0.65, 0.67, 0.70, 0.74, 0.76, 0.81, 0.83, 0.85, 0.89, 0.91, 0.92, 0.96, 0.97, 0.99, 1.01, 1.02, 1.04, 1.06, 1.07, 1.09, 1.13, 1.14, 1.16, 1.18, 1.22, 1.25, 1.29, 1.33, 1.38, 1.41, 1.44, 1.45, 1.47, 1.51, 1.53, 1.54, 1.55, 1.56, 1.58, 1.60, 1.61, 1.64, 1.68, 1.70, 1.73, 1.74, 1.76, 1.79, 1.81, 1.85, 1.86, 1.87, 1.91, 1.93, 1.95, 1.97, 1.99, 2.03, 2.06, 2.07, 2.09, 2.10, 2.11, 2.14, 2.15, 2.18, 2.19, 2.21, 2.25, 2.28, 2.29, 2.31, 2.33, 2.35, 2.36, 2.38, 2.43, 2.46, 2.50, 2.52, 2.56, 2.62, 2.64, 2.66, 2.70, 2.72, 2.77, 2.80, 2.82, 2.85, 2.88, 2.91, 2.95, 2.99, 3.04, 3.06, 3.15, 3.18, 3.20, 3.27, 3.30, 3.33, 3.36, 3.37, 3.38, 3.40, 3.42, 3.43, 3.46, 3.48, 3.52, 3.54, 3.57, 3.60, 3.63, 3.66, 3.68, 3.71, 3.72, 3.76, 3.79, 3.81, 3.84, 3.88, 3.91, 3.94, 3.96, 4.00, 4.01, 4.03, 4.04, 4.09, 4.13, 4.15, 4.19, 4.26, 4.29, 4.31, 4.32, 4.34, 4.37, 4.39, 4.40, 4.42, 4.45, 4.46, 4.47, 4.49, 4.50, 4.52, 4.54, 4.56, 4.58, 4.60, 4.63, 4.64, 4.66, 4.67, 4.69, 4.71, 4.72, 4.73, 4.76, 4.77, 4.79, 4.80, 4.83, 4.84, 4.85, 4.87, 4.89, 4.90, 4.93, 4.95, 4.97, 4.98, 5.02, 5.05, 5.08, 5.11, 5.12, 5.16, 5.23, 5.25, 5.27, 5.33, 5.35, 5.40, 5.43, 5.45, 5.47, 5.50, 5.52, 5.54, 5.57, 5.61, 5.63, 5.70, 5.73, 5.75, 5.80, 5.81, 5.83, 5.86, 5.88, 5.92, 5.95, 5.99, 6.03, 6.05, 6.08, 6.14, 6.17, 6.18, 6.20, 6.22, 6.23, 6.25, 6.27, 6.28, 6.30, 6.31, 6.34, 6.37, 6.39, 6.42, 6.46, 6.49, 6.55, 6.60, 6.63, 6.67, 6.69, 6.72, 6.75, 6.77, 6.79, 6.80, 6.82, 6.83, 6.85, 6.87, 6.90, 6.91, 6.93, 6.95, 6.98, 7.01, 7.02, 7.03, 7.05, 7.08, 7.10, 7.11, 7.13, 7.17, 7.18, 7.20, 7.22, 7.24, 7.27, 7.29, 7.31, 7.35, 7.38, 7.39, 7.45, 7.48, 7.50, 7.52, 7.53, 7.55, 7.58, 7.59, 7.61, 7.62, 7.64, 7.66, 7.68, 7.69, 7.74, 7.76, 7.77, 7.79, 7.81, 7.83, 7.86, 7.89, 7.91, 7.96, 7.99, 8.00, 8.02, 8.04, 8.05, 8.07, 8.11, 8.18, 8.19, 8.20, 8.21, 8.23, 8.26, 8.27, 8.28, 8.29, 8.30, 8.33, 8.35, 8.37, 8.39, 8.41, 8.43, 8.45, 8.47, 8.48, 8.50, 8.51, 8.52, 8.55, 8.59, 8.61, 8.63, 8.64, 8.65, 8.67, 8.70, 8.71, 8.73, 8.74, 8.76, 8.78, 8.80, 8.82, 8.84, 8.86, 8.87, 8.89, 8.90, 8.93, 8.95, 8.96, 9.00, 9.02, 9.03, 9.04, 9.07, 9.12, 9.13, 9.14, 9.16, 9.17, 9.18, 9.20, 9.22, 9.24, 9.25, 9.27, 9.28, 9.29, 9.31, 9.33, 9.36, 9.37, 9.41, 9.43, 9.45, 9.46, 9.47, 9.49, 9.51, 9.52, 9.53, 9.57, 9.62, 9.63, 9.64, 9.66, 9.69, 9.71, 9.72, 9.74, 9.75, 9.76, 9.78, 9.80, 9.82, 9.84, 9.86, 9.88, 9.92, 9.93, 9.96, 9.99, 10.03, 10.05, 10.06, 10.08, 10.09, 10.11, 10.12, 10.17, 10.19, 10.21, 10.23, 10.24, 10.25, 10.27, 10.28, 10.30, 10.33, 10.34, 10.38, 10.40, 10.44, 10.46, 10.52, 10.54, 10.56, 10.57, 10.59, 10.60, 10.61, 10.64, 10.65, 10.69, 10.71, 10.74, 10.75, 10.76, 10.80, 10.81, 10.82, 10.84, 10.88, 10.89, 10.90, 10.92, 10.93, 10.96, 10.99, 11.00, 11.04, 11.09, 11.10, 11.13, 11.14, 11.16, 11.20, 11.21, 11.23, 11.25, 11.26, 11.28, 11.30, 11.32, 11.36, 11.38, 11.40, 11.42, 11.44, 11.47, 11.48, 11.51, 11.53, 11.56, 11.62, 11.71, 11.88, 11.91, 11.97, 12.00, 12.03, 12.06, 12.08, 12.09, 12.11, 12.14, 12.16, 12.19, 12.21, 12.24, 12.28, 12.30, 12.35, 12.42, 12.47, 12.51, 12.55, 12.59, 12.65, 12.67, 12.68, 12.72, 12.94, 12.97, 12.99, 13.00, 13.04, 13.09, 13.11, 13.13, 13.14, 13.19, 13.22, 13.24, 13.26, 13.28, 13.29, 13.35, 13.40, 13.41, 13.44, 13.47, 13.50, 13.51, 13.53, 13.58, 13.60, 13.62, 13.67, 13.69, 13.71, 13.72, 13.74, 13.75, 13.76, 13.79, 13.81, 13.82, 13.86, 13.89, 13.90, 13.92, 13.95, 13.96, 13.98, 14.01, 14.02, 14.05, 14.06, 14.08, 14.10, 14.12, 14.13, 14.18, 14.22, 14.25, 14.36, 14.39, 14.41, 14.44, 14.46, 14.49, 14.57, 14.73, 14.74]
    const hiking_trail = (
      <View>
        <MapView
          region={this.state.region}
          onRegionChangeComplete={region => {
            this.setState({ region });
          }}
          style={localStyles.map}
        >
          {this.state.marker.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.latlong}
              title={marker.title}
            />
          ))}
          <Polyline
            coordinates={[{ latitude: 22.4651820, longitude: 114.1804100 }, { latitude: 22.4652540, longitude: 114.1802910 }, { latitude: 22.4653720, longitude: 114.1802860 }, { latitude: 22.4654720, longitude: 114.1802930 }, { latitude: 22.4657410, longitude: 114.1799070 }, { latitude: 22.4659110, longitude: 114.1798680 }, { latitude: 22.4661360, longitude: 114.1800080 }, { latitude: 22.4662900, longitude: 114.1801020 }, { latitude: 22.4664360, longitude: 114.1802370 }, { latitude: 22.4665840, longitude: 114.1802310 }, { latitude: 22.4666850, longitude: 114.1800860 }, { latitude: 22.4667280, longitude: 114.1799470 }, { latitude: 22.4668820, longitude: 114.1797470 }, { latitude: 22.4670500, longitude: 114.1795910 }, { latitude: 22.4672320, longitude: 114.1795530 }, { latitude: 22.4674900, longitude: 114.1794990 }, { latitude: 22.4677140, longitude: 114.1795690 }, { latitude: 22.4677520, longitude: 114.1800690 }, { latitude: 22.4678530, longitude: 114.1802470 }, { latitude: 22.4680220, longitude: 114.1803310 }, { latitude: 22.4681510, longitude: 114.1804760 }, { latitude: 22.4683060, longitude: 114.1804660 }, { latitude: 22.4684470, longitude: 114.1806110 }, { latitude: 22.4685230, longitude: 114.1807560 }, { latitude: 22.4688150, longitude: 114.1808450 }, { latitude: 22.4690080, longitude: 114.1808180 }, { latitude: 22.4691760, longitude: 114.1808970 }, { latitude: 22.4693730, longitude: 114.1810450 }, { latitude: 22.4694520, longitude: 114.1811810 }, { latitude: 22.4697110, longitude: 114.1812830 }, { latitude: 22.4699930, longitude: 114.1815570 }, { latitude: 22.4701050, longitude: 114.1816870 }, { latitude: 22.4703230, longitude: 114.1820710 }, { latitude: 22.4704530, longitude: 114.1821020 }, { latitude: 22.4705780, longitude: 114.1822330 }, { latitude: 22.4709450, longitude: 114.1822000 }, { latitude: 22.4711070, longitude: 114.1821260 }, { latitude: 22.4712400, longitude: 114.1821250 }, { latitude: 22.4715390, longitude: 114.1820900 }, { latitude: 22.4716720, longitude: 114.1821460 }, { latitude: 22.4717770, longitude: 114.1822640 }, { latitude: 22.4719290, longitude: 114.1822900 }, { latitude: 22.4720230, longitude: 114.1823330 }, { latitude: 22.4721760, longitude: 114.1825030 }, { latitude: 22.4722910, longitude: 114.1825620 }, { latitude: 22.4723740, longitude: 114.1826010 }, { latitude: 22.4725650, longitude: 114.1827080 }, { latitude: 22.4728310, longitude: 114.1825880 }, { latitude: 22.4729530, longitude: 114.1825980 }, { latitude: 22.4731500, longitude: 114.1826270 }, { latitude: 22.4733150, longitude: 114.1826280 }, { latitude: 22.4736730, longitude: 114.1827330 }, { latitude: 22.4738980, longitude: 114.1826000 }, { latitude: 22.4742050, longitude: 114.1823540 }, { latitude: 22.4744980, longitude: 114.1822320 }, { latitude: 22.4747970, longitude: 114.1818970 }, { latitude: 22.4750230, longitude: 114.1817510 }, { latitude: 22.4753170, longitude: 114.1816810 }, { latitude: 22.4754300, longitude: 114.1817280 }, { latitude: 22.4755100, longitude: 114.1817950 }, { latitude: 22.4758950, longitude: 114.1818650 }, { latitude: 22.4760460, longitude: 114.1818590 }, { latitude: 22.4761120, longitude: 114.1817580 }, { latitude: 22.4762020, longitude: 114.1817030 }, { latitude: 22.4763020, longitude: 114.1817110 }, { latitude: 22.4764500, longitude: 114.1818080 }, { latitude: 22.4765710, longitude: 114.1819040 }, { latitude: 22.4767200, longitude: 114.1819390 }, { latitude: 22.4769230, longitude: 114.1820840 }, { latitude: 22.4772090, longitude: 114.1821930 }, { latitude: 22.4773510, longitude: 114.1823150 }, { latitude: 22.4774990, longitude: 114.1825730 }, { latitude: 22.4775930, longitude: 114.1825610 }, { latitude: 22.4777710, longitude: 114.1826440 }, { latitude: 22.4779330, longitude: 114.1829150 }, { latitude: 22.4780510, longitude: 114.1829590 }, { latitude: 22.4784080, longitude: 114.1828010 }, { latitude: 22.4785310, longitude: 114.1827930 }, { latitude: 22.4786210, longitude: 114.1828060 }, { latitude: 22.4789080, longitude: 114.1826790 }, { latitude: 22.4790620, longitude: 114.1825850 }, { latitude: 22.4792270, longitude: 114.1824640 }, { latitude: 22.4793940, longitude: 114.1823320 }, { latitude: 22.4794830, longitude: 114.1823600 }, { latitude: 22.4796740, longitude: 114.1826250 }, { latitude: 22.4798150, longitude: 114.1828760 }, { latitude: 22.4799620, longitude: 114.1829340 }, { latitude: 22.4800760, longitude: 114.1829480 }, { latitude: 22.4801980, longitude: 114.1829450 }, { latitude: 22.4802660, longitude: 114.1830270 }, { latitude: 22.4803990, longitude: 114.1832490 }, { latitude: 22.4805310, longitude: 114.1833030 }, { latitude: 22.4807640, longitude: 114.1832500 }, { latitude: 22.4808170, longitude: 114.1831680 }, { latitude: 22.4809380, longitude: 114.1831080 }, { latitude: 22.4812840, longitude: 114.1830810 }, { latitude: 22.4815520, longitude: 114.1829680 }, { latitude: 22.4816940, longitude: 114.1829820 }, { latitude: 22.4818090, longitude: 114.1829940 }, { latitude: 22.4820330, longitude: 114.1828990 }, { latitude: 22.4821300, longitude: 114.1827920 }, { latitude: 22.4822340, longitude: 114.1827060 }, { latitude: 22.4823090, longitude: 114.1825930 }, { latitude: 22.4827460, longitude: 114.1825930 }, { latitude: 22.4830630, longitude: 114.1824800 }, { latitude: 22.4833160, longitude: 114.1823510 }, { latitude: 22.4835590, longitude: 114.1823030 }, { latitude: 22.4839050, longitude: 114.1823300 }, { latitude: 22.4843470, longitude: 114.1826030 }, { latitude: 22.4845300, longitude: 114.1825710 }, { latitude: 22.4846590, longitude: 114.1827700 }, { latitude: 22.4847860, longitude: 114.1830820 }, { latitude: 22.4848220, longitude: 114.1831720 }, { latitude: 22.4849020, longitude: 114.1835850 }, { latitude: 22.4850620, longitude: 114.1837920 }, { latitude: 22.4849610, longitude: 114.1839550 }, { latitude: 22.4848970, longitude: 114.1842290 }, { latitude: 22.4847830, longitude: 114.1845180 }, { latitude: 22.4846140, longitude: 114.1847220 }, { latitude: 22.4843420, longitude: 114.1849900 }, { latitude: 22.4840440, longitude: 114.1849420 }, { latitude: 22.4837910, longitude: 114.1845510 }, { latitude: 22.4836030, longitude: 114.1843470 }, { latitude: 22.4829840, longitude: 114.1839010 }, { latitude: 22.4827160, longitude: 114.1838690 }, { latitude: 22.4825920, longitude: 114.1840090 }, { latitude: 22.4822350, longitude: 114.1845400 }, { latitude: 22.4819380, longitude: 114.1846200 }, { latitude: 22.4818090, longitude: 114.1848350 }, { latitude: 22.4815770, longitude: 114.1849580 }, { latitude: 22.4815000, longitude: 114.1850230 }, { latitude: 22.4814010, longitude: 114.1851610 }, { latitude: 22.4813340, longitude: 114.1853300 }, { latitude: 22.4811970, longitude: 114.1853890 }, { latitude: 22.4811250, longitude: 114.1854620 }, { latitude: 22.4810210, longitude: 114.1856880 }, { latitude: 22.4809810, longitude: 114.1859350 }, { latitude: 22.4808670, longitude: 114.1862510 }, { latitude: 22.4807000, longitude: 114.1864400 }, { latitude: 22.4805250, longitude: 114.1866370 }, { latitude: 22.4805400, longitude: 114.1868630 }, { latitude: 22.4807480, longitude: 114.1871310 }, { latitude: 22.4808850, longitude: 114.1874050 }, { latitude: 22.4809930, longitude: 114.1874280 }, { latitude: 22.4812580, longitude: 114.1874800 }, { latitude: 22.4813860, longitude: 114.1874900 }, { latitude: 22.4816920, longitude: 114.1876510 }, { latitude: 22.4819700, longitude: 114.1876830 }, { latitude: 22.4821570, longitude: 114.1876420 }, { latitude: 22.4823630, longitude: 114.1875420 }, { latitude: 22.4824250, longitude: 114.1870990 }, { latitude: 22.4824960, longitude: 114.1867900 }, { latitude: 22.4826930, longitude: 114.1866880 }, { latitude: 22.4828850, longitude: 114.1866930 }, { latitude: 22.4831220, longitude: 114.1869060 }, { latitude: 22.4832020, longitude: 114.1870200 }, { latitude: 22.4833140, longitude: 114.1871150 }, { latitude: 22.4833770, longitude: 114.1872440 }, { latitude: 22.4836870, longitude: 114.1875120 }, { latitude: 22.4840050, longitude: 114.1876670 }, { latitude: 22.4841090, longitude: 114.1878280 }, { latitude: 22.4844460, longitude: 114.1879570 }, { latitude: 22.4850700, longitude: 114.1879300 }, { latitude: 22.4853870, longitude: 114.1878230 }, { latitude: 22.4855210, longitude: 114.1877340 }, { latitude: 22.4856290, longitude: 114.1877860 }, { latitude: 22.4857380, longitude: 114.1879060 }, { latitude: 22.4858210, longitude: 114.1882010 }, { latitude: 22.4859240, longitude: 114.1882660 }, { latitude: 22.4859330, longitude: 114.1883770 }, { latitude: 22.4859260, longitude: 114.1885520 }, { latitude: 22.4858520, longitude: 114.1888470 }, { latitude: 22.4859430, longitude: 114.1888960 }, { latitude: 22.4860540, longitude: 114.1888520 }, { latitude: 22.4861780, longitude: 114.1888480 }, { latitude: 22.4862720, longitude: 114.1888820 }, { latitude: 22.4862810, longitude: 114.1886690 }, { latitude: 22.4862410, longitude: 114.1885000 }, { latitude: 22.4863710, longitude: 114.1884260 }, { latitude: 22.4865030, longitude: 114.1884380 }, { latitude: 22.4866930, longitude: 114.1884790 }, { latitude: 22.4869240, longitude: 114.1886220 }, { latitude: 22.4870470, longitude: 114.1885950 }, { latitude: 22.4871630, longitude: 114.1885070 }, { latitude: 22.4872570, longitude: 114.1883790 }, { latitude: 22.4873420, longitude: 114.1882150 }, { latitude: 22.4874330, longitude: 114.1881080 }, { latitude: 22.4875310, longitude: 114.1880320 }, { latitude: 22.4875780, longitude: 114.1879490 }, { latitude: 22.4875670, longitude: 114.1876770 }, { latitude: 22.4875620, longitude: 114.1875310 }, { latitude: 22.4876050, longitude: 114.1873760 }, { latitude: 22.4876700, longitude: 114.1872770 }, { latitude: 22.4877800, longitude: 114.1870500 }, { latitude: 22.4878620, longitude: 114.1869750 }, { latitude: 22.4879730, longitude: 114.1869450 }, { latitude: 22.4880730, longitude: 114.1870100 }, { latitude: 22.4882450, longitude: 114.1870200 }, { latitude: 22.4883600, longitude: 114.1869500 }, { latitude: 22.4886370, longitude: 114.1869030 }, { latitude: 22.4887270, longitude: 114.1868330 }, { latitude: 22.4888070, longitude: 114.1866430 }, { latitude: 22.4887700, longitude: 114.1865330 }, { latitude: 22.4889180, longitude: 114.1861670 }, { latitude: 22.4889630, longitude: 114.1858450 }, { latitude: 22.4891400, longitude: 114.1856450 }, { latitude: 22.4892720, longitude: 114.1853950 }, { latitude: 22.4892510, longitude: 114.1852740 }, { latitude: 22.4891080, longitude: 114.1849500 }, { latitude: 22.4889470, longitude: 114.1843540 }, { latitude: 22.4891460, longitude: 114.1844160 }, { latitude: 22.4893490, longitude: 114.1845540 }, { latitude: 22.4896380, longitude: 114.1849430 }, { latitude: 22.4897260, longitude: 114.1851530 }, { latitude: 22.4897650, longitude: 114.1856690 }, { latitude: 22.4898550, longitude: 114.1859130 }, { latitude: 22.4899390, longitude: 114.1860620 }, { latitude: 22.4900630, longitude: 114.1861940 }, { latitude: 22.4901490, longitude: 114.1864690 }, { latitude: 22.4902600, longitude: 114.1866490 }, { latitude: 22.4903320, longitude: 114.1868190 }, { latitude: 22.4904840, longitude: 114.1870520 }, { latitude: 22.4907300, longitude: 114.1873580 }, { latitude: 22.4907760, longitude: 114.1874680 }, { latitude: 22.4911630, longitude: 114.1880150 }, { latitude: 22.4913570, longitude: 114.1881310 }, { latitude: 22.4914640, longitude: 114.1882240 }, { latitude: 22.4917910, longitude: 114.1884340 }, { latitude: 22.4919380, longitude: 114.1884870 }, { latitude: 22.4920850, longitude: 114.1885970 }, { latitude: 22.4922790, longitude: 114.1887110 }, { latitude: 22.4923640, longitude: 114.1888060 }, { latitude: 22.4925710, longitude: 114.1891310 }, { latitude: 22.4926820, longitude: 114.1893940 }, { latitude: 22.4929350, longitude: 114.1895880 }, { latitude: 22.4932460, longitude: 114.1897980 }, { latitude: 22.4933360, longitude: 114.1899250 }, { latitude: 22.4935450, longitude: 114.1901260 }, { latitude: 22.4938970, longitude: 114.1905570 }, { latitude: 22.4939450, longitude: 114.1907860 }, { latitude: 22.4940280, longitude: 114.1908980 }, { latitude: 22.4940060, longitude: 114.1910470 }, { latitude: 22.4941050, longitude: 114.1912060 }, { latitude: 22.4940940, longitude: 114.1913310 }, { latitude: 22.4942410, longitude: 114.1914430 }, { latitude: 22.4942730, longitude: 114.1915290 }, { latitude: 22.4942900, longitude: 114.1916220 }, { latitude: 22.4941160, longitude: 114.1916660 }, { latitude: 22.4940240, longitude: 114.1917710 }, { latitude: 22.4937980, longitude: 114.1917150 }, { latitude: 22.4935560, longitude: 114.1915540 }, { latitude: 22.4933400, longitude: 114.1915350 }, { latitude: 22.4932140, longitude: 114.1917600 }, { latitude: 22.4931290, longitude: 114.1920610 }, { latitude: 22.4930650, longitude: 114.1923640 }, { latitude: 22.4931050, longitude: 114.1929080 }, { latitude: 22.4931640, longitude: 114.1934610 }, { latitude: 22.4932360, longitude: 114.1936970 }, { latitude: 22.4932260, longitude: 114.1940560 }, { latitude: 22.4931640, longitude: 114.1942790 }, { latitude: 22.4931760, longitude: 114.1945180 }, { latitude: 22.4931390, longitude: 114.1948500 }, { latitude: 22.4930430, longitude: 114.1950350 }, { latitude: 22.4929890, longitude: 114.1951760 }, { latitude: 22.4930170, longitude: 114.1952770 }, { latitude: 22.4930070, longitude: 114.1954270 }, { latitude: 22.4929570, longitude: 114.1955730 }, { latitude: 22.4930750, longitude: 114.1955880 }, { latitude: 22.4931450, longitude: 114.1957530 }, { latitude: 22.4932140, longitude: 114.1960110 }, { latitude: 22.4932200, longitude: 114.1961540 }, { latitude: 22.4931900, longitude: 114.1963550 }, { latitude: 22.4931840, longitude: 114.1965880 }, { latitude: 22.4932880, longitude: 114.1968530 }, { latitude: 22.4933240, longitude: 114.1970580 }, { latitude: 22.4933400, longitude: 114.1971590 }, { latitude: 22.4932510, longitude: 114.1972660 }, { latitude: 22.4931210, longitude: 114.1973440 }, { latitude: 22.4930810, longitude: 114.1976450 }, { latitude: 22.4931160, longitude: 114.1978220 }, { latitude: 22.4931570, longitude: 114.1979360 }, { latitude: 22.4931620, longitude: 114.1980870 }, { latitude: 22.4930920, longitude: 114.1984730 }, { latitude: 22.4930790, longitude: 114.1985700 }, { latitude: 22.4930530, longitude: 114.1987610 }, { latitude: 22.4931760, longitude: 114.1989640 }, { latitude: 22.4931920, longitude: 114.1991150 }, { latitude: 22.4931340, longitude: 114.1993920 }, { latitude: 22.4929700, longitude: 114.1995000 }, { latitude: 22.4929870, longitude: 114.1997080 }, { latitude: 22.4928780, longitude: 114.2001030 }, { latitude: 22.4929870, longitude: 114.2003030 }, { latitude: 22.4930370, longitude: 114.2004480 }, { latitude: 22.4928150, longitude: 114.2009440 }, { latitude: 22.4928250, longitude: 114.2012400 }, { latitude: 22.4927710, longitude: 114.2013800 }, { latitude: 22.4927770, longitude: 114.2015920 }, { latitude: 22.4928140, longitude: 114.2017090 }, { latitude: 22.4927790, longitude: 114.2018560 }, { latitude: 22.4927080, longitude: 114.2021020 }, { latitude: 22.4926530, longitude: 114.2022330 }, { latitude: 22.4925580, longitude: 114.2023840 }, { latitude: 22.4924520, longitude: 114.2024590 }, { latitude: 22.4923900, longitude: 114.2026540 }, { latitude: 22.4923330, longitude: 114.2028310 }, { latitude: 22.4922630, longitude: 114.2029460 }, { latitude: 22.4922330, longitude: 114.2030720 }, { latitude: 22.4919510, longitude: 114.2034490 }, { latitude: 22.4919600, longitude: 114.2035770 }, { latitude: 22.4919370, longitude: 114.2037200 }, { latitude: 22.4918400, longitude: 114.2039000 }, { latitude: 22.4917480, longitude: 114.2040450 }, { latitude: 22.4915900, longitude: 114.2041840 }, { latitude: 22.4914200, longitude: 114.2043960 }, { latitude: 22.4912390, longitude: 114.2045750 }, { latitude: 22.4910550, longitude: 114.2046570 }, { latitude: 22.4908770, longitude: 114.2050330 }, { latitude: 22.4908720, longitude: 114.2053150 }, { latitude: 22.4908510, longitude: 114.2054680 }, { latitude: 22.4907910, longitude: 114.2056190 }, { latitude: 22.4906480, longitude: 114.2057370 }, { latitude: 22.4905420, longitude: 114.2057920 }, { latitude: 22.4904140, longitude: 114.2058570 }, { latitude: 22.4902340, longitude: 114.2061990 }, { latitude: 22.4898920, longitude: 114.2066840 }, { latitude: 22.4898780, longitude: 114.2067900 }, { latitude: 22.4898970, longitude: 114.2068880 }, { latitude: 22.4899010, longitude: 114.2070380 }, { latitude: 22.4898620, longitude: 114.2071380 }, { latitude: 22.4896290, longitude: 114.2073040 }, { latitude: 22.4896450, longitude: 114.2074180 }, { latitude: 22.4896470, longitude: 114.2075270 }, { latitude: 22.4896190, longitude: 114.2076360 }, { latitude: 22.4896310, longitude: 114.2077400 }, { latitude: 22.4897280, longitude: 114.2079680 }, { latitude: 22.4897070, longitude: 114.2081610 }, { latitude: 22.4897510, longitude: 114.2083120 }, { latitude: 22.4898820, longitude: 114.2085350 }, { latitude: 22.4899430, longitude: 114.2086840 }, { latitude: 22.4900390, longitude: 114.2088500 }, { latitude: 22.4901150, longitude: 114.2090400 }, { latitude: 22.4902430, longitude: 114.2091220 }, { latitude: 22.4903150, longitude: 114.2092150 }, { latitude: 22.4903350, longitude: 114.2093730 }, { latitude: 22.4902820, longitude: 114.2094710 }, { latitude: 22.4902130, longitude: 114.2095710 }, { latitude: 22.4901830, longitude: 114.2097760 }, { latitude: 22.4902660, longitude: 114.2101750 }, { latitude: 22.4903280, longitude: 114.2103670 }, { latitude: 22.4903480, longitude: 114.2105610 }, { latitude: 22.4903530, longitude: 114.2106880 }, { latitude: 22.4902960, longitude: 114.2107660 }, { latitude: 22.4903730, longitude: 114.2109170 }, { latitude: 22.4903970, longitude: 114.2111690 }, { latitude: 22.4904450, longitude: 114.2112520 }, { latitude: 22.4904450, longitude: 114.2114350 }, { latitude: 22.4904200, longitude: 114.2116120 }, { latitude: 22.4904550, longitude: 114.2117170 }, { latitude: 22.4904910, longitude: 114.2119310 }, { latitude: 22.4904710, longitude: 114.2121190 }, { latitude: 22.4903670, longitude: 114.2122710 }, { latitude: 22.4902640, longitude: 114.2124830 }, { latitude: 22.4902220, longitude: 114.2126840 }, { latitude: 22.4902320, longitude: 114.2127830 }, { latitude: 22.4903490, longitude: 114.2128580 }, { latitude: 22.4903850, longitude: 114.2129470 }, { latitude: 22.4903880, longitude: 114.2132710 }, { latitude: 22.4903440, longitude: 114.2134060 }, { latitude: 22.4902880, longitude: 114.2135060 }, { latitude: 22.4901560, longitude: 114.2138320 }, { latitude: 22.4901060, longitude: 114.2140060 }, { latitude: 22.4900660, longitude: 114.2141280 }, { latitude: 22.4900220, longitude: 114.2142210 }, { latitude: 22.4900080, longitude: 114.2145460 }, { latitude: 22.4900290, longitude: 114.2149330 }, { latitude: 22.4901030, longitude: 114.2150720 }, { latitude: 22.4901520, longitude: 114.2151640 }, { latitude: 22.4902260, longitude: 114.2153030 }, { latitude: 22.4902650, longitude: 114.2154200 }, { latitude: 22.4902330, longitude: 114.2155190 }, { latitude: 22.4901980, longitude: 114.2156540 }, { latitude: 22.4901870, longitude: 114.2158790 }, { latitude: 22.4902130, longitude: 114.2160520 }, { latitude: 22.4901990, longitude: 114.2161560 }, { latitude: 22.4901750, longitude: 114.2163000 }, { latitude: 22.4901480, longitude: 114.2164130 }, { latitude: 22.4900820, longitude: 114.2164990 }, { latitude: 22.4900300, longitude: 114.2166090 }, { latitude: 22.4900150, longitude: 114.2168910 }, { latitude: 22.4900000, longitude: 114.2170990 }, { latitude: 22.4899880, longitude: 114.2172240 }, { latitude: 22.4898960, longitude: 114.2175850 }, { latitude: 22.4899100, longitude: 114.2177760 }, { latitude: 22.4898490, longitude: 114.2179280 }, { latitude: 22.4897410, longitude: 114.2180140 }, { latitude: 22.4896850, longitude: 114.2181210 }, { latitude: 22.4896630, longitude: 114.2182440 }, { latitude: 22.4896190, longitude: 114.2184360 }, { latitude: 22.4895480, longitude: 114.2185250 }, { latitude: 22.4894660, longitude: 114.2186350 }, { latitude: 22.4892700, longitude: 114.2188600 }, { latitude: 22.4891840, longitude: 114.2193510 }, { latitude: 22.4891320, longitude: 114.2194770 }, { latitude: 22.4890770, longitude: 114.2195580 }, { latitude: 22.4890670, longitude: 114.2196920 }, { latitude: 22.4891480, longitude: 114.2200100 }, { latitude: 22.4892090, longitude: 114.2201730 }, { latitude: 22.4892490, longitude: 114.2202810 }, { latitude: 22.4892890, longitude: 114.2203850 }, { latitude: 22.4892750, longitude: 114.2205200 }, { latitude: 22.4892050, longitude: 114.2205940 }, { latitude: 22.4890920, longitude: 114.2207870 }, { latitude: 22.4889500, longitude: 114.2208520 }, { latitude: 22.4888690, longitude: 114.2209580 }, { latitude: 22.4886880, longitude: 114.2210340 }, { latitude: 22.4885580, longitude: 114.2211430 }, { latitude: 22.4884190, longitude: 114.2213360 }, { latitude: 22.4881560, longitude: 114.2215220 }, { latitude: 22.4880380, longitude: 114.2215860 }, { latitude: 22.4879060, longitude: 114.2218460 }, { latitude: 22.4876850, longitude: 114.2220270 }, { latitude: 22.4875960, longitude: 114.2223580 }, { latitude: 22.4875210, longitude: 114.2225000 }, { latitude: 22.4874970, longitude: 114.2226130 }, { latitude: 22.4875370, longitude: 114.2228390 }, { latitude: 22.4875450, longitude: 114.2229310 }, { latitude: 22.4875290, longitude: 114.2230860 }, { latitude: 22.4874740, longitude: 114.2231640 }, { latitude: 22.4871980, longitude: 114.2234140 }, { latitude: 22.4870650, longitude: 114.2236550 }, { latitude: 22.4869090, longitude: 114.2236890 }, { latitude: 22.4867510, longitude: 114.2237770 }, { latitude: 22.4866610, longitude: 114.2238020 }, { latitude: 22.4866500, longitude: 114.2239010 }, { latitude: 22.4866600, longitude: 114.2239860 }, { latitude: 22.4866310, longitude: 114.2240830 }, { latitude: 22.4866110, longitude: 114.2242150 }, { latitude: 22.4865290, longitude: 114.2245120 }, { latitude: 22.4865060, longitude: 114.2246670 }, { latitude: 22.4864050, longitude: 114.2250230 }, { latitude: 22.4863290, longitude: 114.2251530 }, { latitude: 22.4861460, longitude: 114.2255020 }, { latitude: 22.4861370, longitude: 114.2257200 }, { latitude: 22.4862020, longitude: 114.2262390 }, { latitude: 22.4861910, longitude: 114.2264900 }, { latitude: 22.4861820, longitude: 114.2266190 }, { latitude: 22.4861840, longitude: 114.2267280 }, { latitude: 22.4862160, longitude: 114.2269070 }, { latitude: 22.4862000, longitude: 114.2270160 }, { latitude: 22.4861950, longitude: 114.2271510 }, { latitude: 22.4861870, longitude: 114.2273400 }, { latitude: 22.4861470, longitude: 114.2274980 }, { latitude: 22.4862350, longitude: 114.2278230 }, { latitude: 22.4863120, longitude: 114.2279550 }, { latitude: 22.4862550, longitude: 114.2282250 }, { latitude: 22.4862440, longitude: 114.2283560 }, { latitude: 22.4862550, longitude: 114.2284870 }, { latitude: 22.4860080, longitude: 114.2286660 }, { latitude: 22.4859780, longitude: 114.2287630 }, { latitude: 22.4859940, longitude: 114.2288780 }, { latitude: 22.4859790, longitude: 114.2291040 }, { latitude: 22.4859160, longitude: 114.2294110 }, { latitude: 22.4858630, longitude: 114.2295440 }, { latitude: 22.4859570, longitude: 114.2295930 }, { latitude: 22.4859430, longitude: 114.2297290 }, { latitude: 22.4858910, longitude: 114.2299010 }, { latitude: 22.4858760, longitude: 114.2301260 }, { latitude: 22.4857700, longitude: 114.2303690 }, { latitude: 22.4857250, longitude: 114.2305480 }, { latitude: 22.4856090, longitude: 114.2308860 }, { latitude: 22.4853860, longitude: 114.2313180 }, { latitude: 22.4853640, longitude: 114.2314210 }, { latitude: 22.4853830, longitude: 114.2316500 }, { latitude: 22.4854290, longitude: 114.2318050 }, { latitude: 22.4854540, longitude: 114.2319970 }, { latitude: 22.4853780, longitude: 114.2322850 }, { latitude: 22.4852860, longitude: 114.2323980 }, { latitude: 22.4851400, longitude: 114.2324640 }, { latitude: 22.4851490, longitude: 114.2326260 }, { latitude: 22.4850690, longitude: 114.2327670 }, { latitude: 22.4850930, longitude: 114.2329650 }, { latitude: 22.4851980, longitude: 114.2330530 }, { latitude: 22.4852210, longitude: 114.2332610 }, { latitude: 22.4850460, longitude: 114.2336440 }, { latitude: 22.4850440, longitude: 114.2337930 }, { latitude: 22.4850160, longitude: 114.2340240 }, { latitude: 22.4849600, longitude: 114.2340840 }, { latitude: 22.4849600, longitude: 114.2340840 }, { latitude: 22.4852140, longitude: 114.2341170 }, { latitude: 22.4853530, longitude: 114.2341530 }, { latitude: 22.4856260, longitude: 114.2340850 }, { latitude: 22.4857100, longitude: 114.2339880 }, { latitude: 22.4860330, longitude: 114.2339830 }, { latitude: 22.4864930, longitude: 114.2340900 }, { latitude: 22.4873510, longitude: 114.2340420 }, { latitude: 22.4887290, longitude: 114.2344550 }, { latitude: 22.4888680, longitude: 114.2346160 }, { latitude: 22.4894230, longitude: 114.2347120 }, { latitude: 22.4896060, longitude: 114.2348890 }, { latitude: 22.4893220, longitude: 114.2350060 }, { latitude: 22.4890970, longitude: 114.2350350 }, { latitude: 22.4889170, longitude: 114.2350970 }, { latitude: 22.4888600, longitude: 114.2351940 }, { latitude: 22.4889170, longitude: 114.2353720 }, { latitude: 22.4891400, longitude: 114.2356040 }, { latitude: 22.4891600, longitude: 114.2357800 }, { latitude: 22.4890090, longitude: 114.2360540 }, { latitude: 22.4889800, longitude: 114.2361710 }, { latitude: 22.4887200, longitude: 114.2363640 }, { latitude: 22.4884250, longitude: 114.2364130 }, { latitude: 22.4882330, longitude: 114.2364970 }, { latitude: 22.4878520, longitude: 114.2368570 }, { latitude: 22.4873630, longitude: 114.2371970 }, { latitude: 22.4870300, longitude: 114.2375330 }, { latitude: 22.4867260, longitude: 114.2377040 }, { latitude: 22.4864220, longitude: 114.2377290 }, { latitude: 22.4860720, longitude: 114.2375600 }, { latitude: 22.4855600, longitude: 114.2374290 }, { latitude: 22.4854200, longitude: 114.2374730 }, { latitude: 22.4852730, longitude: 114.2374590 }, { latitude: 22.4849710, longitude: 114.2372280 }, { latitude: 22.4832190, longitude: 114.2380090 }, { latitude: 22.4830310, longitude: 114.2381870 }, { latitude: 22.4828820, longitude: 114.2381460 }, { latitude: 22.4827440, longitude: 114.2381300 }, { latitude: 22.4824250, longitude: 114.2380510 }, { latitude: 22.4820390, longitude: 114.2378570 }, { latitude: 22.4820070, longitude: 114.2376440 }, { latitude: 22.4819510, longitude: 114.2375170 }, { latitude: 22.4818330, longitude: 114.2373850 }, { latitude: 22.4814620, longitude: 114.2371830 }, { latitude: 22.4812110, longitude: 114.2371540 }, { latitude: 22.4810640, longitude: 114.2371150 }, { latitude: 22.4808490, longitude: 114.2370260 }, { latitude: 22.4807100, longitude: 114.2370570 }, { latitude: 22.4805620, longitude: 114.2370150 }, { latitude: 22.4802500, longitude: 114.2366240 }, { latitude: 22.4803810, longitude: 114.2361310 }, { latitude: 22.4803350, longitude: 114.2360250 }, { latitude: 22.4801340, longitude: 114.2359480 }, { latitude: 22.4798930, longitude: 114.2357980 }, { latitude: 22.4796200, longitude: 114.2358470 }, { latitude: 22.4795160, longitude: 114.2358370 }, { latitude: 22.4794040, longitude: 114.2357170 }, { latitude: 22.4792080, longitude: 114.2352800 }, { latitude: 22.4790410, longitude: 114.2351320 }, { latitude: 22.4788530, longitude: 114.2350710 }, { latitude: 22.4784930, longitude: 114.2349010 }, { latitude: 22.4783430, longitude: 114.2348310 }, { latitude: 22.4782230, longitude: 114.2347120 }, { latitude: 22.4781470, longitude: 114.2346380 }, { latitude: 22.4781520, longitude: 114.2348700 }, { latitude: 22.4780750, longitude: 114.2348160 }, { latitude: 22.4780170, longitude: 114.2347410 }, { latitude: 22.4780170, longitude: 114.2350130 }, { latitude: 22.4779840, longitude: 114.2351450 }, { latitude: 22.4779040, longitude: 114.2352810 }, { latitude: 22.4776620, longitude: 114.2355580 }, { latitude: 22.4775380, longitude: 114.2357730 }, { latitude: 22.4774530, longitude: 114.2358150 }, { latitude: 22.4773380, longitude: 114.2359370 }, { latitude: 22.4772290, longitude: 114.2361610 }, { latitude: 22.4770870, longitude: 114.2361640 }, { latitude: 22.4769820, longitude: 114.2363290 }, { latitude: 22.4768240, longitude: 114.2364000 }, { latitude: 22.4766770, longitude: 114.2363660 }, { latitude: 22.4764570, longitude: 114.2362340 }, { latitude: 22.4763810, longitude: 114.2362230 }, { latitude: 22.4762650, longitude: 114.2363250 }, { latitude: 22.4762550, longitude: 114.2364300 }, { latitude: 22.4762550, longitude: 114.2364300 }, { latitude: 22.4761950, longitude: 114.2363510 }, { latitude: 22.4757910, longitude: 114.2366200 }, { latitude: 22.4755200, longitude: 114.2367150 }, { latitude: 22.4751910, longitude: 114.2367160 }, { latitude: 22.4742650, longitude: 114.2363030 }, { latitude: 22.4740960, longitude: 114.2361810 }, { latitude: 22.4739550, longitude: 114.2360390 }, { latitude: 22.4738180, longitude: 114.2358020 }, { latitude: 22.4737400, longitude: 114.2356040 }, { latitude: 22.4736550, longitude: 114.2353650 }, { latitude: 22.4734000, longitude: 114.2345700 }, { latitude: 22.4729160, longitude: 114.2331600 }, { latitude: 22.4728190, longitude: 114.2331330 }]}
            strokeColor="#000"
            strokeWidth={3}
          />
        </MapView>

        <LineChart
          data={{
            labels: data,
            datasets: [
              {
                data: [16.00, 16.00, 16.00, 16.00, 17.10, 17.50, 17.70, 17.80, 18.10, 18.40, 19.50, 19.80, 20.50, 21.30, 21.50, 21.80, 23.30, 30.10, 33.40, 35.80, 38.70, 40.10, 44.10, 46.20, 55.70, 59.60, 65.30, 71.50, 74.40, 83.10, 94.70, 99.00, 113.30, 115.80, 119.00, 130.40, 132.70, 135.00, 141.90, 145.30, 148.80, 152.20, 155.70, 160.00, 162.40, 164.70, 170.10, 178.30, 180.80, 185.30, 189.80, 196.00, 197.80, 197.50, 195.10, 191.70, 189.60, 186.30, 185.30, 184.30, 181.60, 181.40, 181.40, 181.30, 181.20, 181.10, 181.00, 181.60, 183.10, 184.60, 185.30, 184.40, 183.90, 182.90, 181.40, 180.90, 177.50, 176.40, 175.30, 172.00, 170.90, 169.20, 168.10, 167.00, 165.20, 163.30, 162.60, 162.50, 162.50, 162.40, 162.30, 162.50, 162.80, 163.00, 164.10, 166.00, 168.00, 169.00, 169.30, 170.00, 170.40, 170.70, 171.10, 172.30, 176.50, 183.00, 185.90, 189.80, 190.60, 189.40, 188.30, 182.20, 160.00, 156.80, 152.30, 151.20, 149.60, 147.20, 146.10, 142.90, 141.60, 143.70, 144.60, 152.50, 154.80, 156.00, 162.10, 166.00, 168.50, 169.90, 170.60, 171.30, 172.00, 172.70, 173.30, 174.60, 175.40, 175.20, 174.10, 167.00, 168.90, 170.80, 171.70, 171.90, 172.20, 172.30, 173.60, 175.20, 176.90, 178.10, 180.90, 183.40, 184.80, 186.10, 187.00, 187.20, 187.70, 186.50, 181.40, 176.90, 173.80, 168.20, 155.20, 151.60, 150.80, 150.10, 148.50, 146.10, 144.30, 144.30, 148.00, 148.00, 148.00, 148.00, 148.00, 148.00, 148.00, 148.00, 148.00, 148.00, 148.50, 149.10, 149.40, 149.70, 150.00, 149.60, 149.30, 149.90, 150.60, 151.90, 152.50, 152.00, 151.50, 150.50, 150.00, 149.50, 148.90, 148.10, 148.60, 150.10, 150.60, 151.80, 151.30, 149.10, 150.90, 152.40, 153.90, 154.60, 153.00, 152.50, 152.90, 151.60, 146.60, 146.10, 145.70, 146.60, 147.60, 148.50, 150.30, 153.70, 157.80, 166.00, 180.90, 184.00, 215.90, 226.30, 231.50, 252.60, 258.00, 263.30, 274.00, 279.40, 298.80, 307.70, 319.00, 332.60, 336.20, 346.50, 365.00, 372.00, 376.10, 379.60, 383.20, 386.70, 396.00, 401.00, 406.00, 409.50, 413.00, 418.90, 423.70, 426.00, 432.20, 441.20, 448.30, 456.30, 468.50, 475.50, 479.50, 490.50, 490.80, 490.90, 490.10, 489.70, 489.30, 489.00, 488.80, 488.60, 488.30, 487.30, 486.80, 485.60, 484.30, 482.80, 481.50, 478.80, 478.30, 477.80, 476.80, 476.60, 476.50, 476.50, 475.70, 475.20, 474.70, 473.80, 473.40, 473.80, 474.40, 474.10, 473.40, 473.50, 473.80, 478.70, 482.70, 484.90, 487.10, 487.70, 488.20, 489.00, 489.20, 489.40, 490.40, 493.70, 495.20, 496.50, 497.70, 503.80, 505.30, 506.70, 510.10, 512.00, 517.90, 524.50, 528.80, 532.50, 540.00, 543.30, 544.80, 546.50, 549.80, 551.40, 555.50, 562.50, 573.80, 575.70, 577.60, 579.50, 581.40, 586.60, 590.10, 590.80, 591.40, 592.10, 593.40, 594.60, 595.10, 596.80, 597.70, 597.60, 596.90, 596.20, 595.40, 594.60, 592.60, 591.40, 589.00, 584.20, 581.00, 578.30, 577.80, 577.40, 577.00, 576.40, 576.50, 576.60, 576.70, 576.00, 574.50, 573.70, 573.00, 571.50, 568.60, 567.00, 563.70, 562.00, 556.80, 554.30, 551.90, 545.40, 543.80, 542.20, 539.50, 531.60, 525.90, 523.60, 521.30, 519.00, 516.70, 512.10, 508.90, 504.60, 502.30, 500.00, 496.50, 494.00, 492.70, 491.50, 488.10, 487.70, 487.50, 487.20, 487.10, 487.10, 488.70, 489.30, 490.60, 491.40, 491.70, 492.60, 493.10, 489.50, 488.70, 487.90, 487.10, 486.10, 485.60, 485.20, 485.00, 484.90, 484.70, 485.00, 486.70, 487.80, 490.40, 491.90, 494.40, 494.00, 492.00, 491.60, 493.00, 492.40, 492.70, 493.90, 495.10, 495.80, 500.30, 505.40, 515.70, 520.80, 525.90, 528.40, 530.30, 532.70, 538.20, 541.80, 544.20, 549.70, 550.90, 550.40, 548.90, 545.80, 544.20, 537.20, 532.80, 528.40, 526.10, 524.30, 521.50, 520.10, 517.30, 515.90, 510.50, 507.00, 504.20, 503.00, 501.90, 498.40, 497.80, 497.20, 496.00, 493.30, 492.30, 491.40, 490.80, 490.30, 489.40, 488.60, 488.20, 485.00, 478.00, 476.70, 474.70, 473.50, 472.40, 468.90, 467.80, 465.40, 463.90, 463.80, 464.00, 464.10, 464.30, 465.30, 465.70, 466.60, 468.30, 472.80, 471.40, 471.20, 470.90, 470.80, 465.80, 457.90, 433.10, 381.20, 375.20, 361.20, 357.70, 351.40, 348.00, 345.60, 344.60, 343.70, 341.60, 341.00, 338.30, 337.30, 334.40, 333.70, 334.30, 328.70, 318.10, 304.70, 293.50, 282.40, 274.80, 270.20, 270.20, 270.60, 275.30, 244.60, 239.20, 234.40, 232.20, 224.60, 215.10, 211.20, 209.50, 210.20, 209.40, 207.80, 207.00, 205.40, 203.00, 200.90, 196.50, 190.80, 189.20, 187.70, 184.70, 179.80, 179.00, 179.40, 178.10, 173.80, 168.50, 161.60, 160.70, 156.00, 154.20, 152.30, 151.60, 149.40, 143.70, 140.30, 136.90, 131.50, 128.10, 124.00, 119.00, 108.30, 104.80, 97.80, 90.80, 87.30, 78.70, 71.80, 64.90, 58.00, 39.00, 39.00, 35.30, 36.10, 37.60, 33.00, 30.90, 28.70, 25.50, 22.10, 18.80, 10.90, 10.60, 10.20]

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
            marginLeft: -10,
            marginRight: -20
          }}
          formatXLabel = {(value) => data[0] == value || 
            data[Math.round(data.length*0.2)] == value ||
            data[Math.round(data.length*0.4)] == value ||
            data[Math.round(data.length*0.6)] == value ||
            data[Math.round(data.length*0.8)] == value ||
            data[Math.round(data.length-1)] == value
            ?
            `${Math.round(value)}km`: ''
          }
          formatYLabel = {(value) =>
            Math.round(value)
          }
        />

        <SliderBox
          images = {this.state.images}
          sliderBoxHeight = {400}
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          autoplay
          circleLoop
        />
      </View>
    )
    return (
      <ScrollView style={localStyles.Container}>
        <View style={localStyles.HomeContent}>
          {hiking_trail}
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
  HomeContent: {
    paddingBottom: 30,
    minHeight: '100%',
  },
  map: {
    height: 300
  }


})

export default Detail;