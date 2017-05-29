'use strict';

var request = require('request');

var consts = require('../utils/react_constants');

var apiUrl = function apiUrl(endpoint) {
    return consts.API_URL + '/api' + endpoint;
};

var apiMethods = {};

apiMethods.get = function (endpoint, queryParameters, cb) {
    if (arguments.length === 2) {
        var cb = queryParameters;
        queryParameters = {};
    }

    var options = {
        method: 'GET',
        uri: apiUrl(endpoint),
        qs: queryParameters,
        json: true
    };

    request(options, function (err, response, body) {
        var responseCode = response === undefined ? 500 : response.statusCode;
        return cb(err, responseCode, body);
    });
};

apiMethods.post = function (endpoint, body, cb) {
    if (arguments.length === 2) {
        var cb = body;
        body = {};
    }

    var options = {
        method: 'POST',
        uri: apiUrl(endpoint),
        json: true,
        body: body
    };

    request(options, function (err, response, body) {
        var responseCode = response === undefined ? 500 : response.statusCode;
        return cb(err, responseCode, body);
    });
};

apiMethods.put = function (endpoint, body, cb) {
    if (arguments.length === 2) {
        var cb = body;
        body = {};
    }

    var options = {
        method: 'PUT',
        uri: apiUrl(endpoint),
        json: true,
        body: body
    };

    request(options, function (err, response, body) {
        return cb(err, response.statusCode, body);
    });
};

exports.apiMethods = apiMethods;