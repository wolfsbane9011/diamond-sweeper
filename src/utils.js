import axios from 'axios';

const util = {};

util.emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
util.passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
util.requiredFieldErrorMsg = 'This field is required.';
util.emailFieldErrorMsg = 'Please enter a valid email.';
util.passwordFieldErrorMsg = 'Please enter a valid password.';
util.passwordHint = 'Password must be at least 8 characters and should contain at least 1 lowercase, 1 uppercase, 1 number and any special character.';
util.signUp = 'Sign Up';
util.login = 'Log In';
util.loginQuestion = 'Already a member?';
util.signUpQuestion = 'New to us?';
util.signUpHeader = 'Sign up for a new account';
util.loginHeader = 'Log-in to your account';
util.homepageHeader = 'Diamond Sweeper';
util.makeHTTPRequest = (url, requestType, requestBody) => {
    return axios[requestType](url, requestBody);
};

export default util;