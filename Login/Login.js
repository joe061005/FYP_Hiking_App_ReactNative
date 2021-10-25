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
  ColorPropType,
  Alert,
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'
import NetInfo from '@react-native-community/netinfo'
import { showMessage } from "react-native-flash-message"
import API from "../Api/api"


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "",
      user_name: "",
      password: "",
      passwordSecurityEntry: true,
      register_username: "",
      register_password: "",
      register_confirm_password: "",
      register_email: "",
      validInput: true,
      approvedInput: true,
      resendEmail_username: "",
      validUsername: true,


    };

    this.login = this.login.bind(this)
    this.isValidInput = this.isValidInput.bind(this)
    this.resendEmail = this.resendEmail.bind(this)
    this.Message = this.Message.bind(this)
  }

  componentDidMount() {
    console.log("componentDidMount()")

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

    if (this.props.route.params.type == 0) {
      this.setState({ page: "login" })
    } else {
      this.setState({ page: "register" })
    }
  }

  async login() {
    console.log("login")
    if (!this.isValidInput()) return;
    this.setState({ validInput: true, approvedInput: true });

    var params = {
      username: this.state.user_name,
      password: this.state.password
    }

    API.login(params).then(([code, data]) => {
      if (code == '401') {
        this.setState({ validInput: false })
      } else if (code == '400') {
        this.setState({ approvedInput: false })
      } else {
        
      }
    })
  }

  isValidInput() {
    this.setState({ validInput: this.state.user_name && this.state.password })
    return (this.state.user_name && this.state.password)
  }

  async resendEmail() {
     if(!this.state.resendEmail_username){
       this.setState({validUsername: false})
       return
     }
     this.setState({validUsername: true})

     var params = {
       username: this.state.resendEmail_username
     }

     API.resendEmail(params).then(([code,data]) => {
       if(code == '401'){
        this.setState({validUsername: false})
       }else if (code == '200'){
        //Alert.alert('注意', '己完成驗證', [{text: '確定'}])
         this.Message('此帳號己完成驗證')
       }else {
         Alert.alert('注意', '己發送驗證電郵', 
         [{text: '確定',
           onPress : () => this.setState({page: "login"})
         }]
         )
       }
     })

  }

  Message(msg){
     Alert.alert('注意', msg, [{text: '確定'}])
  }


  render() {

    const member_login = (
      <View style={localStyles.FormInputContainer}>
        <View style={localStyles.InputField}>
          <FontAwesome name="user-circle" size={25} color="#D3D3D3"
            style={{
              paddingRight: 20,
              paddingLeft: 10
            }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.user_name}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            placeholder='用戶名稱'
            onChangeText={(user_name) => this.setState({ user_name: user_name })}
          />
        </View>

        <View style={localStyles.InputField}>
          <MaterialIcons name="lock-outline" size={25} color="#D3D3D3"
            style={{
              paddingRight: 20,
              paddingLeft: 10
            }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.password}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            secureTextEntry={this.state.passwordSecurityEntry}
            placeholder='密碼'
            onChangeText={(password) => this.setState({ password: password })}
          />
          {this.state.passwordSecurityEntry ?
            <Ionicons name="eye" size={25} color="#D3D3D3"
              style={{
                alignSelf: "flex-end"
              }}
              onPress={() => {
                this.setState((prevState) => ({ passwordSecurityEntry: !prevState.passwordSecurityEntry }))
              }}
            /> :
            <Ionicons name="eye-off" size={25} color="#D3D3D3"
              style={{
                alignSelf: "flex-end"
              }}
              onPress={() => {
                this.setState((prevState) => ({ passwordSecurityEntry: !prevState.passwordSecurityEntry }))
              }}
            />
          }
        </View>

        {!this.state.validInput &&
          <Text style={localStyles.ErrorField}>
            用戶名稱或密碼不正確
          </Text>
        }
        {!this.state.approvedInput &&
          <Text style={localStyles.ErrorField}>
            此帳號未被啓動，請透過電郵驗證！
          </Text>
        }

        {!this.state.approvedInput &&
          <TouchableOpacity onPress={() => { this.setState({page: "resendEmail"}) }}>
            <View style={localStyles.ButtonContainer}>
              <View style={localStyles.ResendEmailButton}>
                <Text style={localStyles.ButtonText}>重新發送電郵</Text>
              </View>
            </View>
          </TouchableOpacity>
        }

        <Text style={localStyles.ForgetPasswordField}
          onPress={() => { console.log("Pressed") }}
        >
          忘記密碼?
        </Text>

        <TouchableOpacity onPress={() => { this.login() }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.LoginButton}>
              <Text style={localStyles.ButtonText}>登入</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.GuestButton}>
              <Text style={localStyles.ButtonText}>訪客登入</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>


    )

    const member_register = (
      <View style={localStyles.FormInputContainer}>
        <View style={localStyles.InputField}>
          <FontAwesome name="user-circle" size={25} color="#D3D3D3"
            style={{
              paddingRight: 20,
              paddingLeft: 10
            }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.register_username}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            placeholder='用戶名稱'
            onChangeText={(register_user_name) => this.setState({ register_username: register_user_name })}
          />
        </View>

        <View style={localStyles.InputField}>
          <MaterialIcons name="lock-outline" size={25} color="#D3D3D3"
            style={{
              paddingRight: 20,
              paddingLeft: 10
            }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.register_password}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            secureTextEntry={this.state.passwordSecurityEntry}
            placeholder='密碼'
            onChangeText={(register_password) => this.setState({ register_password: register_password })}
          />
        </View>

        <View style={localStyles.InputField}>
          <MaterialIcons name="lock-outline" size={25} color="#D3D3D3"
            style={{
              paddingRight: 20,
              paddingLeft: 10
            }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.register_confirm_password}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            secureTextEntry={this.state.passwordSecurityEntry}
            placeholder='確認密碼'
            onChangeText={(register_confirm_password) => this.setState({ register_confirm_password: register_confirm_password })}
          />
        </View>

        <View style={localStyles.InputField}>
          <Ionicons name="mail-outline" size={25} color="#D3D3D3"
            style={{
              paddingRight: 20,
              paddingLeft: 10
            }}
          />
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.register_email}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            secureTextEntry={this.state.passwordSecurityEntry}
            placeholder='電郵地址'
            onChangeText={(register_email) => this.setState({ register_email: register_email })}
          />
        </View>



        <TouchableOpacity onPress={() => { }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.LoginButton}>
              <Text style={localStyles.ButtonText}>註冊</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => { }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.GuestButton}>
              <Text style={localStyles.ButtonText}>訪客登入</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    )

    const resendEmail = (
      <View style={localStyles.FormInputContainer}>
        <Text style={localStyles.userNameField}>您的用戶名稱</Text>

        <View style={localStyles.InputField}>
        <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.resendEmail_username}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            placeholder='用戶名稱'
            onChangeText={(resendEmail_username) => this.setState({ resendEmail_username: resendEmail_username})}
          />
        </View>

        {!this.state.validUsername &&
          <Text style={localStyles.ErrorField}>
            用戶名稱不正確
          </Text>
        }
        
        <TouchableOpacity onPress={() => { this.resendEmail() }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.LoginButton}>
              <Text style={localStyles.ButtonText}>發出電郵驗證</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    )


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
            <View style={localStyles.FormContentContainer}>
              <SwitchSelector
                style={localStyles.SwitchBar}
                initial={this.props.route.params.type}
                onPress={value => this.setState({ page: value })}
                textColor="#000000"
                selectedColor="#000000"
                buttonColor="#B1E6EE"
                borderColor="#707070"
                hasPadding
                options={[
                  { label: "登入", value: "login" },
                  { label: "註冊", value: "register" }
                ]}
              />
              {this.state.page == "login" ?
                member_login 
                : this.state.page == "register"?
                member_register
                : 
                resendEmail
              }
            </View>
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
    height: "70%",
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: -70,
    borderRadius: 30,
    borderWidth: 1
  },
  FormContentContainer: {
    width: "70%",
    alignSelf: "center",
  },
  FormInputContainer: {
    marginTop: 50
  },

  SwitchBar: {
    marginTop: 20
  },
  InputField: {
    marginTop: 20,
    flexDirection: 'row',
    borderBottomColor: "#D3D3D3",
    borderBottomWidth: 1,
    paddingBottom: 2,
    marginBottom: 10
  },
  ForgetPasswordField: {
    marginTop: 20,
    color: "#D3D3D3",
    fontSize: 18,
    alignSelf: "flex-end"

  },
  ErrorField: {
    marginTop: 20,
    color: 'rgba(218, 132, 156, 1)',
    fontWeight: '700',
    alignSelf: "center"
  },
  ButtonContainer: {
    alignItems: 'center',
  },
  LoginButton: {
    width: '90%',
    height: 40,
    backgroundColor: "#B1E6EE",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 27.5,
    marginTop: 30
  },
  ButtonText: {
    alignSelf: "center"
  },
  ResendEmailButton: {
    width: '50%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27.5,
    marginTop: 20,
    borderColor: 'rgba(218, 132, 156, 1)',
    borderWidth: 2
  },
  GuestButton: {
    width: '90%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 27.5,
    marginTop: 30,
    borderColor: "#B1EED7",
    borderWidth: 2
  },
  userNameField: {
    fontSize: 20,

  }

});

export default Login;
