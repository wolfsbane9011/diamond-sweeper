const utils = require('./utils');
const config = require('./config');

const users = {};

users.addUser = function({body}, tempDB, callback) {
    let errorInFields = false;
    const formFields = Object.keys(body);

    formFields.forEach(function (value) {
        if (utils.validate(value, body[value]))
            errorInFields = true;
    });

    if (!errorInFields) {
        if (!tempDB.users.hasOwnProperty(body.email.trim())) {
            tempDB.users[body.email.trim()] = {
                firstName: body.firstName,
                lastName: body.lastName,
                country: body.country,
                password: utils.createPasswordHash(body.password)
            };
            tempDB.gameProgress[body.email.trim()] = {
                status: 'Incomplete',
                currentProgress: '',
                target: utils.generateTargetNumbers(),
                squaresUncovered: ''
            };
            const sessionId = utils.createSessionId();
            tempDB.session[sessionId] = {email: body.email.trim(), timestamp: new Date()};
            return callback(false, config.success, {sessionId});
        }
        else
            return callback(true, config.emailError);
    }
    else
        return callback(true, config.invalidFormData);
};

users.login = function({body}, tempDB, callback) {
    let errorInFields = false;
    const formFields = Object.keys(body);

    formFields.forEach(function (value) {
        if (utils.validate(value, body[value]))
            errorInFields = true;
    });

    if (!errorInFields) {
        if (tempDB.users.hasOwnProperty(body.email.trim()) &&
            tempDB.users[body.email.trim()].password === utils.createPasswordHash(body.password)
        ) {
            const sessionId = utils.createSessionId();
            tempDB.session[sessionId] = {email: body.email.trim(), timestamp: new Date()};
            return callback(false, config.success, {sessionId, firstName: tempDB.users[body.email.trim()].firstName});
        }
        else
            return callback(true, config.loginError);
    }
    else
        return callback(true, config.invalidFormData);
};

users.logout = function(body, tempDB, callback) {
    delete tempDB.session[body.sessionId];
    return callback(false, config.success);
};

users.getUserProgress = function(query, tempDB, callback) {
    const email = tempDB.session[query.sessionId].email;
    const progress = {
        status: tempDB.gameProgress[email].status,
        currentProgress: utils.encryptTarget(tempDB.gameProgress[email].currentProgress),
        target: utils.encryptTarget(tempDB.gameProgress[email].target),
        squaresUncovered: utils.encryptTarget(tempDB.gameProgress[email].squaresUncovered)
    };
    return callback(false, config.success, progress);
};

users.updateUserProgress = function(body, tempDB, callback) {
    const email = tempDB.session[body.sessionId].email;
    tempDB.gameProgress[email].status = body.progress.status;
    tempDB.gameProgress[email].currentProgress = utils.decryptTarget(body.progress.currentProgress);
    tempDB.gameProgress[email].squaresUncovered = utils.decryptTarget(body.progress.squaresUncovered);

    return callback(false, config.progressUpdate);
};

users.newGame = function(query, tempDB, callback) {
    const email = tempDB.session[query.sessionId].email;
    const newTarget = utils.generateTargetNumbers();
    const response = tempDB.gameProgress[email] = {
        status: 'Incomplete',
        currentProgress: '',
        target: utils.encryptTarget(newTarget),
        squaresUncovered: ''
    };
    tempDB.session[query.sessionId].timestamp = new Date();
    return callback(false, config.success, response);
};

module.exports = users;