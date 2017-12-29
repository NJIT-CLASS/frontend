import request from 'request';
import axios from 'axios';

const getCall = function (endpoint, queryStrings, cb) {
    if (arguments.length === 2) {
        var cb = queryStrings;
        queryStrings = {};
    }

    const options = {
        method: 'GET',
        uri: `${window.location.protocol}//${window.location.host}${endpoint}`,
        qs: queryStrings,
        json: true
    };

    request(options, (err, status, body) => {
        cb(err, status, body);
    });
};

const postCall = function (endpoint, postVars, cb) {
    if (arguments.length === 2) {
        var cb = postVars;
        postVars = {};
    }


    const options = {
        method: 'POST',
        uri: `${window.location.protocol}//${window.location.host}${endpoint}`,
        body: postVars,
        json: true
    };

    request(options, (err, status, body) => {
        cb(err, status, body);
    });

};

const putCall = function (endpoint, postVars, cb) {
    if (arguments.length === 2) {
        var cb = postVars;
        postVars = {};
    }


    const options = {
        method: 'PUT',
        uri: `${window.location.protocol}//${window.location.host}${endpoint}`,
        body: postVars,
        json: true
    };

    request(options, (err, status, body) => {
        cb(err, status, body);
    });

};


const deleteCall = function (endpoint, postVars, cb) {
    if (arguments.length === 2) {
        var cb = postVars;
        postVars = {};
    }


    const options = {
        method: 'DELETE',
        uri: `${window.location.protocol}//${window.location.host}${endpoint}`,
        body: postVars,
        json: true
    };

    request(options, (err, status, body) => {
        cb(err, status, body);
    });

};

const serverCall = {
    get: getCall,
    post: postCall,
    put: putCall,
    delete: deleteCall

};
export default serverCall;