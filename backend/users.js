const utils = require('./utils');

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
                target: utils.generateTargetNumbers,
                squaresUncovered: ''
            };
            const sessionId = utils.createSessionId();
            tempDB.session[sessionId] = {email: body.email.trim(), timestamp: new Date()};
            callback(false, utils.success, {sessionId});
        }
        else
            callback(true, utils.emailError);
    }
    else
        callback(true, utils.invalidFormData);
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
            callback(false, utils.success, {sessionId, firstName: tempDB.users[body.email.trim()].firstName});
        }
        else
            callback(true, utils.loginError);
    }
    else
        callback(true, utils.invalidFormData);
};

users.logout = function({body}, tempDB, callback) {
    if (body.hasOwnProperty('sessionId') && !!body.sessionId && tempDB.session.hasOwnProperty(body.sessionId)) {
        delete tempDB.session[body.sessionId];
        callback(false, utils.success);
    }
    else
        callback(true, utils.invalidSession);
};

users.getUserProgress = function({query}, tempDB, callback) {
    if (!!query.sessionId && tempDB.session.hasOwnProperty(query.sessionId) &&
        utils.validateSession(tempDB.session[query.sessionId].timestamp)
    ) {
        const email = tempDB.session[query.sessionId].email;
        const progress = {
            status: tempDB.gameProgress[email].status,
            currentProgress: utils.encryptTarget(tempDB.gameProgress[email].currentProgress),
            target: utils.encryptTarget(tempDB.gameProgress[email].target),
            squaresUncovered: utils.encryptTarget(tempDB.gameProgress[email].squaresUncovered)
        };
        callback(false, progress);
    }
    else
        callback(true, utils.invalidSession);
};

users.updateUserProgress = function({body}, tempDB, callback) {
    if (!!body.sessionId && tempDB.session.hasOwnProperty(body.sessionId) &&
        utils.validateSession(tempDB.session[body.sessionId].timestamp)
    ) {
        const email = tempDB.session[body.sessionId].email;
        tempDB.gameProgress[email].status = body.progress.status;
        tempDB.gameProgress[email].currentProgress = utils.decryptTarget(body.progress.currentProgress);
        tempDB.gameProgress[email].squaresUncovered = utils.decryptTarget(body.progress.squaresUncovered);

        callback(false, utils.progressUpdate);
    }
    else
        callback(true, utils.invalidSession);
};

users.checkSession = function({query}, tempDB, callback) {
    if (!!query.sessionId &&
        tempDB.session.hasOwnProperty(query.sessionId) &&
        utils.validateSession(tempDB.session[query.sessionId].timestamp)
    ) {
        tempDB.session[query.sessionId].timestamp = new Date();
        callback(false, utils.success);
    }
    else
        callback(true, utils.invalidSession);
};

module.exports = users;