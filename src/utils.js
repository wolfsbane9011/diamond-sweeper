import axios from 'axios';
import atob from 'atob';
import btoa from 'btoa';
import config from "./config";

const util = {};

util.emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
util.passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

util.makeHTTPRequest = (url, requestType, requestBody) => {
    return axios[requestType](url, requestBody);
};

util.checkSession = () => {
    util.makeHTTPRequest('/check-session?sessionId=' + window.sessionStorage.getItem('session'), 'get')
        .then(res => {
            return res.data.error;
        })
        .catch(err => {
            console.log("err = ", err);
        });
};

util.encryptTarget = function(target) {
    return btoa(target);
};

util.decryptTarget = function(target) {
    return atob(target);
};

util.generateIndexNumbers = function (target) {
    return target.map(value => (Math.floor((value - 1) / config.gridLength) + '-' + ((value - 1) % config.gridLength)));
};

util.generateActualNumbers = function (target) {
    return ((+target.split('-')[0] * config.gridLength) + +target.split('-')[1] + 1);
};

util.getClosestNumber = function (target, currentNumber) {
    return target.reduce((prev, curr) => {
        return (Math.abs(curr - currentNumber) < Math.abs(prev - currentNumber) ? curr : prev);
    });
};

export default util;