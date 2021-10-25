import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

const api_path = {
    baseURL: 'https://b057-223-19-143-35.ngrok.io/'
}

let date = moment().format('YYYY-MM-DD');

var api = {
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

}

async function get(request){
    return fetch(api_path.baseURL + request.method, {
        method: 'GET'
    }).then(response => {
        const statusCode = response.status;
        const data = response.json();
        return Promise.all([statusCode, data]);
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
        return Promise.all([statusCode, data]);
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
        return Promise.all([statusCode, data]);
    })
}

module.exports = api;

