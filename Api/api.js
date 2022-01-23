import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

const api_path = {
    baseURL: 'https://be7a-223-19-143-35.ngrok.io/'
}

let date = moment().format('YYYY-MM-DD');

var storage = {
    login_data: {},
    cookie: "",
    cookie_ID: ""
}

var api = {
    // Login Page
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

        try {
            await AsyncStorage.setItem('LOGIN_DATA', JSON.stringify(login_data))
            await AsyncStorage.setItem('COOKIE', cookie)
        } catch (err) {
            console.log("login data error: ", err)
        }
    },
    isLogin: async () => {
        let login_data = await AsyncStorage.getItem('LOGIN_DATA');
        let cookie = await AsyncStorage.getItem('COOKIE')

        storage.login_data = JSON.parse(login_data)
        storage.cookie = cookie

        console.log("COOKIEBEFORE", cookie)
        console.log("isLogin storage:", storage.cookie)

        if (cookie) {
            const parseCookie = cookie.split(";")
                .map(v => v.split('='))
                .reduce((acc, v) => {
                    acc[decodeURIComponent(v[0].trim())] = v[1] ? decodeURIComponent(v[1].trim()) : ""
                    return acc;
                }, {});

            console.log("parse Cookie: ", parseCookie)
            console.log("COOKIE Expries", parseCookie.Expires)
            console.log("isAfter:,", moment().isAfter(parseCookie.Expires))

            if (moment().isAfter(parseCookie.Expires)) {
                await api.logout()
                await AsyncStorage.removeItem('LOGIN_DATA')
                await AsyncStorage.removeItem('COOKIE')
                return false;
            }

        }

        return (cookie) ? true : false;
    },

    // Home page
    getTrails: () => {
        var request = {
            method: 'trail/getTrail'
        }
        return get(request);
    },

    // Home District page
    getTrailsByDistrict: (district) => {
        var request = {
            method: `trail/getTrailByDistrict/${district}`,
        }
        return get(request)
    },

    getTrailByTitle: (title) => {
        var request = {
            method: `trail/getTrailByTitle/${title}`,
        }
        return get(request)
    },


    // Info page
    getTrailInfo: () => {
        var request = {
            method: 'trail/getTrailInfo'
        }

        return get(request)
    },

    addInfo: (props) => {
        var request = {
            method: 'info/addInfo',
            params: props,
        }

        return post(request)
    },

    getInfo: () => {
        var request = {
            method: 'info/getInfo'
        }

        return get(request)
    },

    getUserInfo: () => {
        var request = {
            method: 'user/getInfo'
        }

        return get(request)
    },

    getInfoByTrail: (id) => {
        var request = {
            method: `trail/getInfo/${id}`
        }
        return get(request)

    },

    getOtherInfo: () => {
        var request = {
            method: 'info/getOtherInfo'
        }

        return get(request)
    },

    getNearbyInfo: (lat, long) => {
        var request = {
            method: `info/getNearbyInfo/${lat}/${long}`
        }
        return get(request)
    },

    //record page

    storeRecord: async (record) => {
        let recordStorage = await AsyncStorage.getItem('recordStorage')
        console.log("RecordStorage: ", JSON.parse(recordStorage))
        console.log("Record: ", record)

        if (!recordStorage) {
            try {
                const firstRecord = [record]
                await AsyncStorage.setItem('recordStorage', JSON.stringify(firstRecord))
                return
            } catch (err) {
                console.log("error: ", err)
            }
        }

        try {
            const recordArr = JSON.parse(recordStorage)
            recordArr.push(record)
            await AsyncStorage.setItem('recordStorage', JSON.stringify(recordArr))
        } catch (err) {
            console.log("error: ", err)
        }
    },

    deleteAllRecords: async () => {
        try {

            await AsyncStorage.removeItem('recordStorage')

        } catch (err) {
            console.log("error: ", err)
        }
    },

    getRecord: async () => {
        try {
            let recordStorage = await AsyncStorage.getItem('recordStorage')
            return JSON.parse(recordStorage)
        } catch (err) {
            console.log("error: ", err)
        }
    },

    deleteRecord: async (index) => {
        try {
            let recordStorage = await AsyncStorage.getItem('recordStorage')
            recordStorage = JSON.parse(recordStorage)
            const newRecordArr = [...recordStorage.slice(0,index), ...recordStorage.slice(index+1)]
            await AsyncStorage.setItem('recordStorage', JSON.stringify(newRecordArr))
            return true;
        } catch (err) {
            console.log("error: ", err)
        }

        return false;
    },

    sendUserLocation: (props, finish) => {
        var request= {
            method: 'record/sendUserLocation',
            params: {...props, finish: finish}
        }

        return post(request)
    },

    addContact: async(contact) => {
        let recordStorage = await AsyncStorage.getItem('MyContacts')
        console.log("RecordStorage: ", JSON.parse(recordStorage))
        console.log("Record: ", contact)

        if (!recordStorage) {
            try {
                const firstRecord = [contact]
                await AsyncStorage.setItem('MyContacts', JSON.stringify(firstRecord))
                return
            } catch (err) {
                console.log("error: ", err)
            }
        }

        try {
            const recordArr = JSON.parse(recordStorage)
            recordArr.push(contact)
            await AsyncStorage.setItem('MyContacts', JSON.stringify(recordArr))
        } catch (err) {
            console.log("error: ", err)
        }
    },

    getContact: async() => {
        try {
            let recordStorage = await AsyncStorage.getItem('MyContacts')
            return JSON.parse(recordStorage)
        } catch (err) {
            console.log("error: ", err)
        }
    },

    deleteContact: async(index) => {
        try {
            let recordStorage = await AsyncStorage.getItem('MyContacts')
            recordStorage = JSON.parse(recordStorage)
            const newRecordArr = [...recordStorage.slice(0,index), ...recordStorage.slice(index+1)]
            await AsyncStorage.setItem('MyContacts', JSON.stringify(newRecordArr))
            return true;
        } catch (err) {
            console.log("error: ", err)
        }
        return false;
    },

    // match page
    getMatchForm: () => {
        var request = {
            method: 'match/getMatchForm'
        }

        return get(request)
    },

    submitMatchForm: (props) => {
        var request = {
            method: 'match/submitMatchForm',
            params: props
        }

        return post(request)
    },

    getMatchResult: () => {
        var request = {
            method: 'match/getMatchResult'
        }

        return get(request)
    },

    quitGroup: () => {
        var request = {
            method: 'match/quitGroup'
        }

        return post(request)
    },

    // setting page
    logout:  () => {
        var request = {
            method: 'user/logout'
        }

        return post(request)
    },

    userInfo: () => {
        return storage.login_data;
    },

    resetUserData: async () => {
        storage.login_data = null;
        storage.cookie = null;

        try {
            await AsyncStorage.removeItem('LOGIN_DATA')
            await AsyncStorage.removeItem('COOKIE')
        } catch (error) {
            console.log("error", error)
        }
    },

    changeCurrentPassword: (props) => {
        var request = {
            method: 'user/changeCurrentPassword',
            params: props
        }

        return post(request)
    }

}

async function get(request) {
    return fetch(api_path.baseURL + request.method, {
        method: 'GET'
    }).then(response => {
        const statusCode = response.status;
        const data = response.json();
        const header = response.headers;
        return Promise.all([statusCode, data, header]);
    })
}

async function post(request) {
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

async function put(request) {
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

