import React from "react"
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    RefreshControl,
    Image,
    TouchableOpacity,
    ImageBackground,
    BackHandler,
    Dimensions,
    Platform,
    Modal,
    Alert
} from "react-native";
import NetInfo from "@react-native-community/netinfo"
import API from "../Api/api"
import { MaterialIcons, Entypo, AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import Spinner from 'react-native-loading-spinner-overlay'


class ChangePW extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            changedPassword: '',
            confirmPassword: '',
            spinner: false,

        }
        this.changePassword = this.changePassword.bind(this)
        this.checking = this.checking.bind(this)
        this.Message = this.Message.bind(this)

    }

    componentDidMount() {
        //  console.log('params: ', this.props.route)
    }

    Message(msg) {
        Alert.alert('錯誤', msg, [{ text: '確定' }])
    }

    async checking() {
        if (!this.state.currentPassword || !this.state.changedPassword || !this.state.confirmPassword) {
            this.Message('請輸入所有資料')
        } else if (!(this.state.changedPassword == this.state.confirmPassword)) {
            this.Message('密碼不相同')
        } else if (this.state.changedPassword == this.state.currentPassword) {
            this.Message('新密碼與現在的密碼相同')
        }
        else {
            this.setState({ spinner: true })
            await this.changePassword()
        }
    }

    async changePassword() {
        var params = {
            username: this.props.route.params.username,
            oldPassword: this.state.currentPassword,
            newPassword: this.state.changedPassword

        }

        API.changeCurrentPassword(params).then(([code, data, header]) => {
            if (code == '401') {
                this.setState({ spinner: false })
                setTimeout(() => {
                    this.Message('密碼錯誤')
                }, 200)
                
            } else {
                this.setState({ spinner: false })
                setTimeout(() => {
                    Alert.alert('提示', '成功更改密碼', [{ text: '確定', onPress: () => { this.props.navigation.goBack() } }])
                }, 200)

            }
        })
    }


    render() {

        return (
            <View style={localStyles.Container}>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'正在更改密碼'}
                    textStyle={{ color: 'white' }}
                />
                <View style={localStyles.formContainer}>
                    <Text style={localStyles.titleTextStyle}>現在的密碼</Text>
                    <View style={localStyles.inputFieldContainer}>
                        <TextInput
                            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
                            value={this.state.currentPassword}
                            autoCorrect={false}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent'
                            placeholder='現在的密碼'
                            onChangeText={(currentPassword) => this.setState({ currentPassword })}
                            selectTextOnFocus={true}
                            secureTextEntry={true}
                        />
                    </View>

                    <Text style={localStyles.titleTextStyle}>新密碼</Text>
                    <View style={localStyles.inputFieldContainer}>
                        <TextInput
                            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
                            value={this.state.changedPassword}
                            autoCorrect={false}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent'
                            placeholder='新密碼'
                            onChangeText={(changedPassword) => this.setState({ changedPassword })}
                            selectTextOnFocus={true}
                            secureTextEntry={true}
                        />
                    </View>

                    <Text style={localStyles.titleTextStyle}>再次輸入新密碼</Text>
                    <View style={localStyles.inputFieldContainer}>
                        <TextInput
                            style={{ flex: 1, fontSize: 18, textAlignVertical: 'center' }}
                            value={this.state.confirmPassword}
                            autoCorrect={false}
                            autoCapitalize='none'
                            underlineColorAndroid='transparent'
                            placeholder='再次輸入新密碼'
                            onChangeText={(confirmPassword) => this.setState({ confirmPassword })}
                            selectTextOnFocus={true}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity onPress={() => { this.checking() }}>
                        <View style={[localStyles.buttonContainer]}>
                            <View style={[localStyles.addButton, { width: '90%', backgroundColor: '#009dff' }]}>
                                <FontAwesome5 style={[localStyles.buttonIcon]} name="unlock-alt" size={24} color="white" />
                                <Text style={[localStyles.textCenter, localStyles.addText]}>更改</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    <Text style={[localStyles.titleTextStyle, { margin: 40, color: 'red' }]}>*如果忘記密碼，請登出並使用忘記密碼功能來重設密碼*</Text>

                </View>

            </View>
        )
    }
}

const localStyles = StyleSheet.create({
    Container: {
        flex: 1,
        backgroundColor: 'rgb(255,255,255)'
    },
    formContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleTextStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20
    },
    inputFieldContainer: {
        borderRadius: 5,
        borderWidth: 1,
        width: '80%',
        height: 50,
        marginTop: 10,
        padding: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        marginLeft: 20,
        //paddingTop: 10,
        backgroundColor: 'white',
        paddingBottom: 15
    },
    buttonIcon: {
        marginRight: 10
    },
    addButton: {
        width: '60%',
        height: 53,
        backgroundColor: 'rgba(45, 74, 105, 1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 27.5,
        flexDirection: 'row',
        marginTop: 20
        //marginBottom: 15
    },
    addText: {
        fontSize: 22,
        color: 'rgba(255, 255, 255, 1)',
        fontWeight: '900'
    },



})

export default ChangePW;