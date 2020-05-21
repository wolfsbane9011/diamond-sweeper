const utils = require('./utils');

const users = {};

users.addUser = function({body}, tempDB) {
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
                squareCount: 0
            };
            const sessionId = utils.createSessionId();
            tempDB.session[sessionId] = {email: body.email.trim(), timestamp: new Date()};

            return {error: false, message: utils.success, sessionId};
        }
        else
            return {error: true, message: utils.emailError};
    }
    else
        return {error: true, message: utils.invalidFormData};
};

users.login = function({body}, tempDB) {
    let errorInFields = false;
    const formFields = Object.keys(body);

    formFields.forEach(function (value) {
        if (utils.validate(value, body[value]))
            errorInFields = true;
    });

    if (!errorInFields) {
        if (tempDB.users.hasOwnProperty(body.email.trim()) &&
            tempDB.users[body.email.trim()].password === utils.createPasswordHash(body.password)) {
            const sessionId = utils.createSessionId();
            tempDB.session[sessionId] = {email: body.email.trim(), timestamp: new Date()};

            return {error: false, message: utils.success, sessionId, firstName: tempDB.users[body.email.trim()].firstName};
        }
        else
            return {error: true, message: utils.loginError};
    }
    else
        return {error: true, message: utils.invalidFormData};
};

users.logout = function({body}, tempDB) {
    if (body.hasOwnProperty('sessionId') && !!body.sessionId && tempDB.session.hasOwnProperty(body.sessionId)) {
        delete tempDB.session[body.sessionId];
        return {error: false, message: utils.success};
    }
    else
        return {error: true, message: utils.invalidSession};
};

users.getUserProgress = function({query}, tempDB) {
    if (!!query.sessionId && tempDB.session.hasOwnProperty(query.sessionId) &&
        utils.validateSession(tempDB.session[query.sessionId].timestamp)
    ) {
        const email = tempDB.session[query.sessionId].email;
        const progress = {
            status: tempDB.gameProgress[email].status,
            currentProgress: utils.encryptTarget(tempDB.gameProgress[email].currentProgress),
            target: utils.encryptTarget(tempDB.gameProgress[email].target),
            squareCount: tempDB.gameProgress[email].squareCount
        };

        return {error: false, progress};
    }
    else
        return {error: true, message: utils.invalidSession};
};

users.updateUserProgress = function({body}, tempDB) {
    if (!!body.sessionId && tempDB.session.hasOwnProperty(body.sessionId) &&
        utils.validateSession(tempDB.session[body.sessionId].timestamp)
    ) {
        const email = tempDB.session[body.sessionId].email;
        tempDB.gameProgress[email].status = body.progress.status;
        tempDB.gameProgress[email].currentProgress = utils.decryptTarget(body.progress.currentProgress);
        tempDB.gameProgress[email].squareCount = body.progress.squareCount;

        return {error: false, message: utils.progressUpdate};
    }
    else
        return {error: true, message: utils.invalidSession};
};

users.checkSession = function({query}, tempDB) {
    if (!!query.sessionId &&
        tempDB.session.hasOwnProperty(query.sessionId) &&
        utils.validateSession(tempDB.session[query.sessionId].timestamp)
    )
        return {error: false, message: utils.success};
    else
        return {error: true, message: utils.invalidSession};
};

module.exports = users;