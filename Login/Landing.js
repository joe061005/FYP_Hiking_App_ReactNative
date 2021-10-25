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
    ImageBackground
  } from "react-native";


class Landing extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    render(){
        return(
          <View style={localStyles.Container}>
              <ImageBackground source={require("../assets/landingbg.jpg")} resizeMode="cover" style={localStyles.backgroundImage}>
                  <Image source={require("../assets/LandingLogo.png")} style={localStyles.Logo}/>
                  <TouchableOpacity onPress = {()=> {this.props.navigation.navigate("login", {type: 1})}} style={localStyles.Button}>
                      <Text>註冊帳號</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress = {()=> {this.props.navigation.navigate("login", {type: 0})}} style={localStyles.Button}>
                      <Text>登入</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress = {()=> {}} style={localStyles.Button}>
                      <Text>訪客登入</Text>
                  </TouchableOpacity>
              </ImageBackground>
          </View>
        )
    }
}

const localStyles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    Logo: {
        alignSelf: "center",
        position: "absolute",
        top: 0,
    },
    Button: {
        borderRadius: 30,
        borderWidth: 1,
        width: 150,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.5)",
        marginTop: 60,
    },
    Margin: {
        marginTop: 20
    }

})

export default Landing;