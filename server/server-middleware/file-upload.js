const fs = require('fs');
const path = require('path');
const mv = require('mv');
const consts = require('../utils/constants');
const react_consts = require('../utils/react_constants');
const request = require('request');

function uploadFile(file, type, userId, postVars){
    return new Promise(function(resolve, reject){
        let oldPath = file.path;
        let newPath = consts.UPLOAD_DIRECTORY_PATH + `/${file.filename}`;
        let { path, destination, ...usefulFileInfo } = file;
        let fullPostVars = {
            ...postVars,
            userId: userId,
            fileInfo: usefulFileInfo,
        };
        request({
            uri: `${react_consts.API_URL}/api/file/upload/${type}`,
            method: 'POST',
            body: fullPostVars,
            json: true
        }, (err,response,body) => {
            console.log(body);
            if(response.statusCode == 200){
                let newFileID = body.FileID;
                console.log('Good response', newFileID);
                
                mv(oldPath, newPath, {mkdirp: true}, function (e) {
                    console.log('done moving file response', e);
                    
                    if (e) {
                        console.error(e);
                        resolve({
                            file: file,
                            error: e
                        });
                        
                    } else {
                        console.log('Good response', file);
                        resolve({
                            file: file,
                            FileID: newFileID
                        });
                    }
                });
            } else {
                resolve({
                    file: file,
                    error: err
                });
            }
        });
    });
}

module.exports = {uploadFile};