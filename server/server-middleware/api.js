import { debug } from 'util';

const request = require('request');
const consts = require('../utils/constants');
const apiUrl = endpoint => `${consts.API_URL}/api${endpoint}`;

const checkAndRefreshToken = function(req){
    return new Promise(function(resolve, reject){

    });
};

const apiMethodInit = function(req,res,next){
    const apiMethods = {};
    apiMethods.get = function(endpoint, queryParameters, cb) {
        if (arguments.length === 2) {
            var cb = queryParameters;
            queryParameters = {};
            queryParameters.token = req.session.token;
        }
        if(!queryParameters.token){
            queryParameters.token = req.session.token;
        }

        const options = {
            method: 'GET',
            uri: apiUrl(endpoint),
            qs: queryParameters,
            json: true
        };
        

        request(options, function(err, response, body) {
            let responseCode = response === undefined ? 500 : response.statusCode;
            if(response !== undefined){
                if(response.statusCode === 409){
                    //bad token, try to refresh
                    console.log('token expired');
                    const refreshOptions = {
                        method: 'POST',
                        uri: apiUrl('/refreshToken'),
                        body: {
                            refreshToken:  req.session.refreshToken,
                            token: req.session.token,
                            userId: req.App.user.userId
                        },
                        json: true
                    };

                    console.log(refreshOptions);
                    request(refreshOptions, function(refreshErr, refreshResponse, refreshBody){
                        console.log(refreshBody);
                        if(refreshResponse.statusCode === 410){
                            delete req.session.userId;
                            delete req.session.token;
                            delete req.session.refreshToken;
                            console.log('Refesh token expired');
                            return res.redirect('/');
                        }
                        console.log('New token: ', refreshBody);
    
                        req.session.token = refreshBody.Token;
                        queryParameters.token = req.session.token;
                        apiMethods.get(endpoint, queryParameters, cb);

                        return;
                        // request(options, function(err2, response2, body2) {
                        //     let responseCode2 = response2 === undefined ? 500 : response2.statusCode;
                        //     console.log(responseCode2, body2);
                        //     return cb(err2, responseCode2, body2);

                        // });
    
                    });
                } else {
                    return cb(err, responseCode, body);
                    
                }
            } else {
                return cb(err, responseCode, body);
                
            }
            
        });
    };
    
    apiMethods.post = function(endpoint, body, cb) {
        if (arguments.length === 2) {
            var cb = body;
            body = {};
            body.token = req.session.token;
        }
        if(!body.token){
            body.token = req.session.token;
        }
        const options = {
            method: 'POST',
            uri: apiUrl(endpoint),
            json: true,
            body: body
        };
    
        request(options, function(err, response, body) {
            let responseCode = response === undefined ? 500 : response.statusCode;
            if(response.statusCode === 409){
                //bad token, try to refresh
                const refreshOptions = {
                    method: 'POST',
                    uri: apiUrl('/refreshToken'),
                    body: {
                        refreshToken:  req.session.refreshToken,
                        token: req.session.token,
                        userId: req.App.user.userId
                    },
                    json: true
                };
                request(refreshOptions, function(refreshErr, refreshResponse, refreshBody){
                    if(refreshResponse.statusCode === 410){
                        delete req.session.userId;
                        delete req.session.token;
                        delete req.session.refreshToken;

                        return res.redirect('/');
                    }

                    req.session.token = refreshBody.Token;
                    return this.post(endpoint, body, cb);

                });
            }
            return cb(err, responseCode, body);
        });
    };
    
    apiMethods.put = function(endpoint, body, cb) {
        if (arguments.length === 2) {
            var cb = body;
            body = {};
            body.token = req.session.token;
        }
        if(!body.token){
            body.token = req.session.token;
        }
    
        const options = {
            method: 'PUT',
            uri: apiUrl(endpoint),
            json: true,
            body: body
        };
    
        request(options, function(err, response, body) {
            if(response.statusCode === 409){
                //bad token, try to refresh
                const refreshOptions = {
                    method: 'POST',
                    uri: apiUrl('/refreshToken'),
                    body: {
                        refreshToken:  req.session.refreshToken,
                        token: req.session.token,
                        userId: req.App.user.userId
                    },
                    json: true
                };
                request(refreshOptions, function(refreshErr, refreshResponse, refreshBody){
                    if(refreshResponse.statusCode === 410){
                        delete req.session.userId;
                        delete req.session.token;
                        delete req.session.refreshToken;

                        return res.redirect('/');
                    }

                    req.session.token = refreshBody.Token;
                    return this.post(endpoint, body, cb);

                });
            }
            return cb(err, response.statusCode, body);
        });
    };
    
    apiMethods.delete = function(endpoint, body, cb) {
        if (arguments.length === 2) {
            var cb = body;
            body = {};
            body.token = req.session.token;
        }
        if(!body.token){
            body.token = req.session.token;
        }
    
        const options = {
            method: 'DELETE',
            uri: apiUrl(endpoint),
            json: true,
            body: body
        };
    
        request(options, function(err, response, body) {
            if(response.statusCode === 409){
                //bad token, try to refresh
                const refreshOptions = {
                    method: 'POST',
                    uri: apiUrl('/refreshToken'),
                    body: {
                        refreshToken:  req.session.refreshToken,
                        token: req.session.token,
                        userId: req.App.user.userId
                    },
                    json: true
                };
                request(refreshOptions, function(refreshErr, refreshResponse, refreshBody){
                    if(refreshResponse.statusCode === 410){
                        delete req.session.userId;
                        delete req.session.token;
                        delete req.session.refreshToken;

                        return res.redirect('/');
                    }

                    req.session.token = refreshBody.Token;
                    return this.post(endpoint, body, cb);

                });
            }
            return cb(err, response.statusCode, body);
        });
    };

    return apiMethods;
};

exports.apiMethodsInit = apiMethodInit ;


