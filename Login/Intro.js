import * as React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    Image,
    Button,
} from 'react-native';

const slides = [
    {
        key: 'slide1',
        title: '遠足路線',
        text: '發掘香港的遠足路線',
        image: require("../assets/Intro_trail.jpg"),
        backgroundColor: "rgb(255,255,255)"
    },
    {
        key: 'slide2',
        title: '遠足資訊',
        text: '獲取有用的遠足資訊',
        image: require("../assets/Intro_facility.jpeg"),
        backgroundColor: "rgb(255,255,255)"
    },
    {
        key: 'slide3',
        title: '遠足群組',
        text: '認識更多志同道合的人',
        image: require("../assets/Intro_group.jpg"),
        backgroundColor: "rgb(255,255,255)"
    }

]

class Intro extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
        }
        this._renderItem = this._renderItem.bind(this)
        this._renderDoneButton = this._renderDoneButton.bind(this)
        this._renderNextButton = this._renderNextButton.bind(this)
        this.onDone = this.onDone.bind(this)
    }

    _renderItem({ item }) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: item.backgroundColor,
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                <Text style={styles.introTitleStyle}>{item.title}</Text>
                <Text style={styles.introTextStyle}>{item.text}</Text>
                <Image style={styles.introImageStyle} source={item.image} />

            </View>
        )
    }

    _renderNextButton() {
        return (
            <View style={styles.buttonCircle}>
                <Text style={styles.buttonText}>繼續</Text>
            </View>
        );
    };

    _renderDoneButton() {
        return (
            <View style={styles.buttonCircle}>
                <Text style={styles.buttonText}>立即開始體驗</Text>
            </View>
        );
    };

    onDone() {
       this.props.navigation.replace("tab")
    }

    render() {
        return (
            <AppIntroSlider
                data={slides}
                renderItem={this._renderItem}
                renderNextButton={this._renderNextButton}
                renderDoneButton={this._renderDoneButton}
                onDone={this.onDone}
                bottomButton={true}
                activeDotStyle={{backgroundColor:'#145f95'}}
                dotStyle={{backgroundColor: '#B3CDDF'}}
            />
        )
    }

}

const styles = StyleSheet.create({
    introImageStyle: {
        width: 300,
        height: 300,
        marginBottom: '45%'

    },
    introTextStyle: {
        marginBottom: '40%',
        color: '#145F95',
        fontSize: 18,
        textAlign: 'center',
        marginTop: '5%',
        marginLeft: '10%',
        marginRight: '10%'
    },
    introTitleStyle: {
        fontSize: 45,
        color: '#145F95',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '20%'
    },
    buttonCircle: {
        width: '100%',
        height: 50,
        backgroundColor: '#145F95',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },
    buttonText: {
        color: 'white',
        fontSize: 25,
        fontWeight: 'bold',
    }
})

export default Intro;

