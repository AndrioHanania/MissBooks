import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js";

const STORAGE_KEY_LOGGEDIN = 'user';
const STORAGE_KEY = 'userDB';

_createUsers();

export const userService = {
    getLoggedinUser,
    login,
    logout,
    signup,
    getById,
    query,
    getEmptyCredentials,
    isLoginUserAdmin,
    isLogin,
};

async function query() {
    return await storageService.query(STORAGE_KEY);
}

async function getById(userId) {
    return await storageService.get(STORAGE_KEY, userId);
}

async function login({ username, password }) {
    const users = await storageService.query(STORAGE_KEY);
    const user = users.find(user => user.username === username);
    return user ?  _setLoggedinUser(user) : Promise.reject('Invalid login');
}

async function signup({ username, password, fullname }) {
    const user = { username, password, fullname };
    user.createdAt = user.updatedAt = Date.now();
    const newUser = await storageService.post(STORAGE_KEY, user);
    return _setLoggedinUser(newUser);
}

function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN);
    return Promise.resolve();
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN));
}

function _setLoggedinUser(user) {
    const userToSave = { _id: user._id, fullname: user.fullname };
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN, JSON.stringify(userToSave));
    return userToSave;
}

function getEmptyCredentials() {
    return {
        fullname: '',
        username: '',
        password: '',
    };
}

async function isLoginUserAdmin() {
    const loginUser = getLoggedinUser();
    if(loginUser === null) return false;
    console.log("what");
    const user = await getById(loginUser._id);
    console.log(user);
    return (await getById(loginUser._id)).isAdmin;
}

function isLogin() {
    return !!getLoggedinUser();
}

function _createUsers(){
    let users = utilService.loadFromStorage(STORAGE_KEY);
    if (!users || !users.length) {
        users = [];

        users.push({
            username: `admin`, 
            password: '1234', 
            fullname: `admin fullname`,
            updatedAt: Date.now(),
            updatedAt:  Date.now(),
            _id: utilService.makeId(),
            isAdmin: true,
        });

        for(let i = 1; i <= 60; i++) {
            users.push({
                username: `user${i}`,
                password: '1234', 
                fullname: `user${i} fullname`,
                updatedAt: Date.now(),
                updatedAt:  Date.now(),
                _id: utilService.makeId(),
                isAdmin: false,
            });
        }

        utilService.saveToStorage(STORAGE_KEY, users);
    }
}

// signup({username: 'muki', password: 'muki1', fullname: 'Muki Ja'})
// login({username: 'muki', password: 'muki1'})

// Data Model:
// const user = {
//     _id: "KAtTl",
//     username: "muki",
//     password: "muki1",
//     fullname: "Muki Ja",
//     createdAt: 1711490430252,
//     updatedAt: 1711490430999
// }