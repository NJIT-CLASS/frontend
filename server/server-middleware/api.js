const request = require('request');

const consts = require('../utils/constants');

const apiUrl = endpoint => `${consts.API_URL}/api${endpoint}`;

const apiMethods = {};

apiMethods.get = function(endpoint, queryParameters, cb) {
    if (arguments.length === 2) {
        var cb = queryParameters;
        queryParameters = {};
    }

    const options = {
        method: 'GET',
        uri: apiUrl(endpoint),
        qs: queryParameters,
        json: true
    };

    request(options, function(err, response, body) {
        let responseCode = response === undefined ? 500 : response.statusCode;
        return cb(err, responseCode, body);
    });
};

apiMethods.post = function(endpoint, body, cb) {
    if (arguments.length === 2) {
        var cb = body;
        body = {};
    }

    const options = {
        method: 'POST',
        uri: apiUrl(endpoint),
        json: true,
        body: body
    };

    request(options, function(err, response, body) {
        let responseCode = response === undefined ? 500 : response.statusCode;
        return cb(err, responseCode, body);
    });
};

apiMethods.put = function(endpoint, body, cb) {
    if (arguments.length === 2) {
        var cb = body;
        body = {};
    }

    const options = {
        method: 'PUT',
        uri: apiUrl(endpoint),
        json: true,
        body: body
    };

    request(options, function(err, response, body) {
        return cb(err, response.statusCode, body);
    });
};

apiMethods.delete = function(endpoint, body, cb) {
    if (arguments.length === 2) {
        var cb = body;
        body = {};
    }

    const options = {
        method: 'DELETE',
        uri: apiUrl(endpoint),
        json: true,
        body: body
    };

    request(options, function(err, response, body) {
        return cb(err, response.statusCode, body);
    });
};

exports.apiMethods = apiMethods;
