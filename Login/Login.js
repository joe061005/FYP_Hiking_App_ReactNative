import React from "react";
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
} from "react-native";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={localStyles.Container}>
        <ImageBackground
          source={require("../assets/loginbg.jpeg")}
          resizeMode="cover"
          style={localStyles.backgroundImage}
        >
          <Image
            source={require("../assets/LandingLogo.png")}
            style={localStyles.Logo}
          />
          <View style={localStyles.FormContainer}>
            
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const localStyles = StyleSheet.create({
  Container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  Logo: {
    alignSelf: "center",
    marginTop: -60,
  },
  FormContainer: {
      width: "80%",
      height: "65%",
      backgroundColor: "white",
      alignSelf: "center",
      marginTop: -70,
      borderRadius: 30,
      borderWidth: 1
  }
});

export default Login;
