import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

const api_path = {
    baseURL: 'https://d827-223-19-143-35.ngrok.io/'
}

let date = moment().format('YYYY-MM-DD');

var storage = {
    login_data: {},
    cookie: "",
}

var api = {
    // Login.js
    login: (props) => {
        var request = {
            method: 'user/login',
            params: props
        }

        return post(request)
    },
    register: (props) => {
        var request = {
            method: 'user/addUser',
            params: props
        }

        return post(request)
    },
    resendEmail: (props) => {
        var request = {
            method: 'user/resendEmail',
            params: props
        }
        
        return post(request)
    },
    changePasswordRequest: (props) => {
        var request = {
            method: 'user/changePasswordRequest',
            params: props
        }

        return post(request)
    },
    passwordVerification: (props) => {
        var request = {
            method: 'user/passwordVerification',
            params: props
        }

        return post(request)
    },
    changePassword: (props) => {
        var request = {
            method: 'user/changePassword',
            params: props
        }

        return post(request)
    },
    setLoginData: async (login_data, cookie) => {
        storage.login_data = login_data
        storage.cookie = cookie

        try{
           await AsyncStorage.setItem('LOGIN_DATA', JSON.stringify(login_data))
           await AsyncStorage.setItem('COOKIE',cookie)
        }catch (err){
            console.log("login data error: ", err)
        }
    },
    isLogin: async() => {
        let login_data = await AsyncStorage.getItem('LOGIN_DATA');
        let cookie = await AsyncStorage.getItem('COOKIE')

        storage.login_data = JSON.parse(login_data)
        storage.cookie = cookie

        return (login_data)? true : false;
    }

}

async function get(request){
    return fetch(api_path.baseURL + request.method, {
        method: 'GET'
    }).then(response => {
        const statusCode = response.status;
        const data = response.json();
        const header = response.headers;
        return Promise.all([statusCode, data, header]);
    })
}

async function post(request){
    return fetch(api_path.baseURL + request.method, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            request.params
        )
    }).then(response => {
        const statusCode = response.status;
        const data = response.json();
        const header = response.headers;
        return Promise.all([statusCode, data, header]);
    })
}

async function put(request){
    return fetch(api_path.baseURL + request.method, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            request.params
        )
    }).then(response => {
        const statusCode = response.status;
        const data = response.json();
        const header = response.headers;
        return Promise.all([statusCode, data, header]);
    })
}

module.exports = api;

