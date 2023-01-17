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
  KeyboardAvoidingView,
  BackHandler
} from "react-native";
import SwitchSelector from "react-native-switch-selector";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'
import NetInfo from '@react-native-community/netinfo'
import { showMessage } from "react-native-flash-message"
import API from "../Api/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Spinner from "react-native-loading-spinner-overlay";


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginSpinner: false,
      registerSpinner: false,
      page: "",

      user_name: "",
      password: "",
      passwordSecurityEntry: true,
      validInput: true,
      approvedInput: true,

      register_username: "",
      register_password: "",
      register_confirm_password: "",
      register_email: "",
      register_validInput: true,
      register_validConfirmPassword: true,
      register_validEmail: true,

      resendEmail_username: "",
      EmailvalidUsername: true,

      PasswordvalidUsername: true,
      forgetPassword_username: "",

      verificationCode: "",
      codevalid: true,

      //passwordUsername: "",

      changedPassword: "",
      confirmChangedPassword: "",
      changedPasswordValid: true



    };

    this.login = this.login.bind(this)
    this.isValidLoginInput = this.isValidLoginInput.bind(this)
    this.resendEmail = this.resendEmail.bind(this)
    this.Message = this.Message.bind(this)
    this.forgetPassword = this.forgetPassword.bind(this)
    this.codeVerification = this.codeVerification.bind(this)
    this.changePassword = this.changePassword.bind(this)
    this.isValidRegisterInput = this.isValidRegisterInput.bind(this)
    this.handleBackButton = this.handleBackButton.bind(this)
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

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton)

    this.isLogin();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    Alert.alert(
      '溫馨提示',
      '是否離開本程式',
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

  async isLogin() {
    if (await API.isLogin()) {
      return true;
    }
    else {
      return false;
    }
  }

  async login() {
    console.log("login")
    if (!this.isValidLoginInput()) return;
    this.setState({ validInput: true, approvedInput: true });

    var params = {
      username: this.state.user_name,
      password: this.state.password
    }

    this.setState({loginSpinner: !this.state.loginSpinner})

    API.login(params).then(([code, data, header]) => {
      if (code == '401') {
        this.setState({ validInput: false })
        this.setState({loginSpinner: !this.state.loginSpinner})
      } else if (code == '400') {
        this.setState({ approvedInput: false })
        this.setState({loginSpinner: !this.state.loginSpinner})
      } else {
        console.log("header", header)
        var set_cookies = ""
        for (const [name, value] of header) {
          if (name == "set-cookie") {
            set_cookies = value
          }
        }
        API.setLoginData(data, set_cookies)
        console.log("set_cookie", set_cookies)
        this.props.navigation.replace("intro")
      }
    })
   
  }

  isValidLoginInput() {
    this.setState({approvedInput: true})
    this.setState({ validInput: this.state.user_name && this.state.password })
    return (this.state.user_name && this.state.password)
  }

  async resendEmail() {
    if (!this.state.resendEmail_username) {
      this.setState({ EmailvalidUsername: false })
      return
    }
    this.setState({ EmailvalidUsername: true })

    var params = {
      username: this.state.resendEmail_username
    }

    API.resendEmail(params).then(([code, data]) => {
      if (code == '401') {
        this.setState({ EmailvalidUsername: false })
      } else if (code == '200') {
        //Alert.alert('注意', '己完成驗證', [{text: '確定'}])
        this.Message('此帳號己完成驗證')
      } else {
        this.setState({ resendEmail_username: "" })
        Alert.alert('注意', '己發送驗證電郵，請查看電子郵箱或垃圾郵件',
          [{
            text: '確定',
            onPress: () => this.setState({ page: "login" })
          }]
        )
      }
    })

  }

  Message(msg) {
    Alert.alert('注意', msg, [{ text: '確定' }])
  }

  async forgetPassword() {
    if (!this.state.forgetPassword_username) {
      this.setState({ PasswordvalidUsername: false })
      return
    }
    this.setState({ PasswordvalidUsername: true })

    var params = {
      username: this.state.forgetPassword_username
    }

    API.changePasswordRequest(params).then(([code, data]) => {
      if (code == '401') {
        this.setState({ PasswordvalidUsername: false })
      } else if (code == '400') {
        this.Message('請先完成驗證')
      } else {
        //  this.setState({ forgetPassword_username: "" })
        this.Message('己發出電郵，請查看電子郵箱或垃圾郵件')
        this.setState({ page: "enterCode" })
      }
    })

  }

  async codeVerification() {
    if (!this.state.verificationCode) {
      this.setState({ codevalid: false })
      return
    }
    this.setState({ codevalid: true })

    var params = {
      code: this.state.verificationCode
    }

    API.passwordVerification(params).then(([code, data]) => {
      if (code == '401') {
        this.setState({ codevalid: false })
      } else if (code == '400') {
        this.Message('驗證碼己過期')
      } else {
        console.log("DATA :", data)
        if (data != this.state.forgetPassword_username) {
          this.setState({ codevalid: false })
        } else {
          this.Message('驗證成功')
          this.setState({ page: "changePassword" })
        }
      }


    })
  }

  async changePassword() {
    if (!this.state.changedPassword || !this.state.confirmChangedPassword || !(this.state.changedPassword == this.state.confirmChangedPassword)) {
      this.setState({ changedPasswordValid: false })
      return
    }
    this.setState({ changedPasswordValid: true })

    var params = {
      code: this.state.verificationCode,
      password: this.state.changedPassword
    }

    API.changePassword(params).then(([code, data]) => {
      if (code == '400') {
        this.Message('驗證碼己過期')
      } else if (code == '401') {
        this.Message('無效的驗證碼')
      } else {
        this.Message('成功更改密碼')
        this.setState({ verificationCode: "" })
        this.setState({ forgetPassword_username: "" })
        this.setState({ changedPassword: "" })
        this.setState({ page: "login" })
      }
    })
  }

  async register() {
    if (!this.isValidRegisterInput()) return;
    this.setState({ register_validInput: true, register_validConfirmPassword: true })

    var params = {
      username: this.state.register_username,
      password: this.state.register_password,
      email: this.state.register_email
    }

    this.setState({registerSpinner: !this.state.registerSpinner})

    API.register(params).then(([code, data]) => {
      if (code == '409') {
        this.setState({registerSpinner: !this.state.registerSpinner})
        setTimeout(() => {
          this.Message('用戶名或電郵己存在')
        }, 200)  
        
      } else if (code == '200') {
        this.setState({registerSpinner: !this.state.registerSpinner})
        setTimeout(() => {
          this.Message('成功創立帳戶，請查看電子郵箱或垃圾郵件以啟用您的帳號')
        }, 200)  
        this.setState({register_username: ''})
        this.setState({register_password: ''})
        this.setState({register_email: ''})
        this.setState({register_confirm_password: ''})
      }
    })


  }

  isValidRegisterInput() {
    console.log("checking: ", this.state.register_username && this.state.register_password && this.state.register_confirm_password && this.state.register_email)
    if (!(this.state.register_username && this.state.register_password && this.state.register_confirm_password && this.state.register_email)) {
      this.setState({ register_validInput: false })
      this.setState({ register_validConfirmPassword: true })
      this.setState({ register_validEmail: true })
      return false
    } else if (!(this.state.register_password == this.state.register_confirm_password)) {
      this.setState({ register_validConfirmPassword: false })
      this.setState({ register_validInput: true })
      this.setState({ register_validEmail: true })
      return false
    } else if (this.state.register_email) {
      let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/
      if (!emailRegex.test(this.state.register_email)) {
        this.setState({ register_validEmail: false })
        this.setState({ register_validConfirmPassword: true })
        this.setState({ register_validInput: true })
        return false
      }
    }
    return true
  }


  render() {

    const member_login = (
      <View style={localStyles.FormInputContainer}>
        <Spinner
          visible={this.state.loginSpinner}
          textContent={'正在登入...'}
          textStyle={{ color: 'white' }}
        />
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
            selectTextOnFocus={true}
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
            selectTextOnFocus={true}
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
          <TouchableOpacity onPress={() => { this.setState({ page: "resendEmail" }) }}>
            <View style={localStyles.ButtonContainer}>
              <View style={localStyles.ResendEmailButton}>
                <Text style={localStyles.ButtonText}>重新發送電郵</Text>
              </View>
            </View>
          </TouchableOpacity>
        }

        <Text style={localStyles.ForgetPasswordField}
          onPress={() => { this.setState({ page: "forgetPassword" }) }}
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

        {/* <TouchableOpacity onPress={() => { this.props.navigation.replace("intro") }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.GuestButton}>
              <Text style={localStyles.ButtonText}>訪客登入</Text>
            </View>
          </View>
        </TouchableOpacity> */}

      </View>


    )

    const member_register = (
      <View style={localStyles.FormInputContainer}>
        <Spinner
          visible={this.state.registerSpinner}
          textContent={'正在註冊...'}
          textStyle={{ color: 'white' }}
        />
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
            selectTextOnFocus={true}
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
            selectTextOnFocus={true}
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
            selectTextOnFocus={true}
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
            placeholder='電郵地址'
            onChangeText={(register_email) => this.setState({ register_email: register_email })}
            selectTextOnFocus={true}
          />
        </View>

        {!this.state.register_validInput &&
          <Text style={localStyles.ErrorField}>
            請輸入所有資料
          </Text>
        }

        {!this.state.register_validConfirmPassword &&
          <Text style={localStyles.ErrorField}>
            密碼不相同
          </Text>
        }

        {!this.state.register_validEmail &&
          <Text style={localStyles.ErrorField}>
            無效的電郵
          </Text>
        }



        <TouchableOpacity onPress={() => { this.register() }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.LoginButton}>
              <Text style={localStyles.ButtonText}>註冊</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => { this.props.navigation.replace("intro") }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.GuestButton}>
              <Text style={localStyles.ButtonText}>訪客登入</Text>
            </View>
          </View>
        </TouchableOpacity> */}

      </View>
    )

    const resendEmail = (
      <View style={localStyles.FormInputContainer}>
        <Text style={localStyles.functionTitleField}>電郵驗證</Text>

        <Text style={localStyles.userNameField}>您的用戶名稱</Text>

        <View style={localStyles.InputField}>
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.resendEmail_username}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            placeholder='用戶名稱'
            onChangeText={(resendEmail_username) => this.setState({ resendEmail_username: resendEmail_username })}
            selectTextOnFocus={true}
          />
        </View>

        {!this.state.EmailvalidUsername &&
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

    const forget_password = (
      <View style={localStyles.FormInputContainer}>
        <Text style={localStyles.functionTitleField}>忘記密碼</Text>

        <Text style={localStyles.userNameField}>您的用戶名稱</Text>

        <View style={localStyles.InputField}>
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.forgetPassword_username}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            placeholder='用戶名稱'
            onChangeText={(forgetPassword_username) => this.setState({ forgetPassword_username: forgetPassword_username })}
            selectTextOnFocus={true}
          />
        </View>

        {!this.state.PasswordvalidUsername &&
          <Text style={localStyles.ErrorField}>
            用戶名稱不正確
          </Text>
        }

        <TouchableOpacity onPress={() => { this.forgetPassword() }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.LoginButton}>
              <Text style={localStyles.ButtonText}>發出電郵驗證</Text>
            </View>
          </View>
        </TouchableOpacity>

      </View>
    )

    const enter_code = (
      <View style={localStyles.FormInputContainer}>
        <Text style={localStyles.functionTitleField}>請輸入驗證碼</Text>

        <Text style={localStyles.userNameField}>驗證碼</Text>

        <View style={localStyles.InputField}>
          <TextInput
            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
            value={this.state.verificationCode}
            autoCorrect={false}
            autoCapitalize='none'
            underlineColorAndroid='transparent'
            placeholder='驗證碼'
            onChangeText={(verificationCode) => this.setState({ verificationCode: verificationCode })}
            selectTextOnFocus={true}
          />
        </View>

        {!this.state.codevalid &&
          <Text style={localStyles.ErrorField}>
            無效的驗證碼
          </Text>
        }

        <TouchableOpacity onPress={() => { this.codeVerification() }}>
          <View style={localStyles.ButtonContainer}>
            <View style={localStyles.LoginButton}>
              <Text style={localStyles.ButtonText}>驗證</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )

    const change_password = (
      <View style={localStyles.FormInputContainer}>
        <View style={localStyles.FormInputContainer}>
          <Text style={localStyles.functionTitleField}>更改密碼</Text>

          <Text style={localStyles.userNameField}>新密碼</Text>

          <View style={localStyles.InputField}>
            <TextInput
              style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
              value={this.state.changedPassword}
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              placeholder='新密碼'
              onChangeText={(changedPassword) => this.setState({ changedPassword: changedPassword })}
              selectTextOnFocus={true}
            />
          </View>

          <Text style={localStyles.userNameField}>確認新密碼</Text>

          <View style={localStyles.InputField}>
            <TextInput
              style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
              value={this.state.confirmChangedPassword}
              autoCorrect={false}
              autoCapitalize='none'
              underlineColorAndroid='transparent'
              placeholder='確認新密碼'
              onChangeText={(confirmChangedPassword) => this.setState({ confirmChangedPassword: confirmChangedPassword })}
              selectTextOnFocus={true}
            />
          </View>

          {!this.state.changedPasswordValid &&
            <Text style={localStyles.ErrorField}>
              請檢查密碼是否一致
            </Text>
          }

          <TouchableOpacity onPress={() => { this.changePassword() }}>
            <View style={localStyles.ButtonContainer}>
              <View style={localStyles.LoginButton}>
                <Text style={localStyles.ButtonText}>確認更改</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )


    return (

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"} keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : -300}>
        <ScrollView
          // style= {{
          //   flex: 1ƒ
          // }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}
        >

          <ImageBackground
            source={require("../assets/loginbg.jpg")}
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
                  fontSize={20}
                />
                {this.state.page == "login" ?
                  member_login
                  : this.state.page == "register" ?
                    member_register
                    : this.state.page == "resendEmail" ?
                      resendEmail
                      : this.state.page == "forgetPassword" ?
                        forget_password
                        : this.state.page == "enterCode" ?
                          enter_code
                          : this.state.page == "changePassword" ?
                            change_password
                            : null
                }
              </View>
            </View>
          </ImageBackground>

        </ScrollView>
      </KeyboardAvoidingView>
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
    height: "75%",
    backgroundColor: "white",
    alignSelf: "center",
    marginTop: -70,
    borderRadius: 30,
    borderWidth: 1,
  },
  FormContentContainer: {
    width: "70%",
    alignSelf: "center",
  },
  FormInputContainer: {
    marginTop: 10
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
    fontSize: 18,
  },
  functionTitleField: {
    alignSelf: "center",
    fontSize: 22,
    marginBottom: 30,
    color: "red"
  }

});

export default Login;
