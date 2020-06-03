const config = {};
config.port = 4200;
config.gridLength = 8;
config.minPasswordLength = 8;
config.sessionTimeout = 30;
config.sessionHouseKeepingInterval = 60000;
config.success = 'Success';
config.progressUpdate = 'Progress updated.';
config.invalidSession = 'Invalid session id.';
config.emailError = 'Email id already exists.';
config.invalidFormData = 'Invalid form data.';
config.loginError = 'Incorrect email id or password.';
config.defaultStatus = 'Incomplete';

module.exports = config;