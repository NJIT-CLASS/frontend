import request from 'request';
import axios from 'axios';

const getCall = function(endpoint, queryStrings, cb){
    if (arguments.length === 2) {
        var cb = queryStrings;
        queryStrings = {};
    }
    queryStrings.endpoint = endpoint;

    const options = {
        method: 'GET',
        uri: `${window.location.protocol}//${window.location.host}/api/generalCall`,
        qs: queryStrings,
        json: true
    };

    request(options, (err, status, body) => {
        if(status.statusCode === 410 || status.statusCode === 401 || status.statusCode === 403){
            return window.location.href = '/';
        }
        cb(err, status, body);
    });
};

const postCall = function(endpoint, postVars, cb ){
    if (arguments.length === 2) {
        var cb = postVars;
        postVars = {};
    }

    postVars.endpoint = endpoint;

    const options = {
        method: 'POST',
        uri: `${window.location.protocol}//${window.location.host}/api/generalCall`,
        body: postVars,
        json: true
    };

    request(options, (err, status, body) => {
        if(status.statusCode === 410 || status.statusCode === 401){
            return window.location.href = '/';
        }
        cb(err, status, body);
    });

};

const putCall = function(endpoint, postVars, cb ){
    if (arguments.length === 2) {
        var cb = postVars;
        postVars = {};
    }

    postVars.endpoint = endpoint;

    const options = {
        method: 'PUT',
        uri: `${window.location.protocol}//${window.location.host}/api/generalCall`,
        body: postVars,
        json: true
    };

    request(options, (err, status, body) => {
        if(status.statusCode === 410 || status.statusCode === 401){
            return window.location.href = '/';
        }
        cb(err, status, body);
    });

};


const deleteCall = function(endpoint, postVars, cb ){
    if (arguments.length === 2) {
        var cb = postVars;
        postVars = {};
    }

    postVars.endpoint = endpoint;

    const options = {
        method: 'DELETE',
        uri: `${window.location.protocol}//${window.location.host}/api/generalCall`,
        body: postVars,
        json: true
    };

    request(options, (err, status, body) => {
        if(status.statusCode === 410 || status.statusCode === 401){
            return window.location.href = '/';
        }
        cb(err, status, body);
    });

};

const promiseGetCall = (endpoint, queryStrings ={}) => {
    queryStrings.endpoint = endpoint;
    
    return axios.get(`${window.location.protocol}//${window.location.host}/api/generalCall`, {
        params: queryStrings
    });
};

const promisePostCall = (endpoint, postVars ={}) => {
    postVars.endpoint = endpoint;
    return axios.post(`${window.location.protocol}//${window.location.host}/api/generalCall`, postVars);
};

const postMultiCall = (requestsArray) => {
    let axiosCalls = requestsArray.map((req) => {
        return axios.post(req.endpoint, req.data);
    });
};

const apiCall = {
    get: getCall,
    post: postCall,
    put: putCall,
    delete: deleteCall,
    multi: postMultiCall,
    getAsync: promiseGetCall,
    postAsync: promisePostCall
    
};
export default apiCall;
