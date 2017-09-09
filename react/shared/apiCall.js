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
        cb(err, status, body);
    });

};

const promiseGetCall = (endpoint, params) => {
    return axios.get(endpoint, {
        params: params
    });
};

const promisePostCall = (endpoint, postVars) => {
    return axios.post(endpoint, postVars);
};

const postMultiCall = (requestsArray) => {
    let axiosCalls = requestsArray.map((req) => {
        return axios.post(req.endpoint, req.data);
    });
};

const apiCall = {
    get: getCall,
    post: postCall,
    multi: postMultiCall,
    getAsync: promiseGetCall,
    postAsync: promisePostCall
    
};
export default apiCall;
