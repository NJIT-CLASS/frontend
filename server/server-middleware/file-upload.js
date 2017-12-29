const fs = require('fs');
const path = require('path');
const mv = require('mv');
const consts = require('../utils/constants');
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
            uri: `${consts.API_URL}/api/file/upload/${type}`,
            method: 'POST',
            body: fullPostVars,
            json: true
        }, (err,response,body) => {
            if(response.statusCode == 200){
                let newFileID = body.FileID;
                mv(oldPath, newPath, {mkdirp: true}, function (e) {
                    if (e) {
                        console.error(e);
                        resolve({
                            file: file,
                            error: e
                        });
                        
                    } else {
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


function uploadFiles(fileArray, type, userId, postVars) {
    let successfulFiles = [];
    let unsuccessfulFiles = [];
    return new Promise(function (resolve, reject) {
        
        let newFileArray = fileArray.map(file => {
            let { path, destination, ...usefulFileInfo } = file;
            return usefulFileInfo;
        });
        let fullPostVars = {
            ...postVars,
            userId: userId,
            files: newFileArray,
        };
        request({
            uri: `${consts.API_URL}/api/files/upload/${type}`,
            method: 'POST',
            body: fullPostVars,
            json: true
        }, (err, response, body) => {
            body = typeof body == 'string' ? JSON.parse(body) : body;
            fileArray.forEach(file => {
                let oldPath = file.path;
                let newPath = consts.UPLOAD_DIRECTORY_PATH + `/${file.filename}`;
                // let newFileID = body.FileID;
                // console.log('Good response', newFileID);

                mv(oldPath, newPath, { mkdirp: true }, function (e) {
                    if (e) {
                        console.error(e);
                        unsuccessfulFiles.push({
                            file: file,
                            error: e
                        });

                    } else {
                        successfulFiles.push({
                            file: file,
                            //FileID: newFileID
                        });
                    }
                });
            });

            resolve ({successfulFileMoves: successfulFiles,
                unsuccessfulFileMoves: unsuccessfulFiles,
                successfulFiles: body.SuccessfulFiles,
                unsuccessfulFiles: body.UnsuccessfulFiles
            });
               
        });
    });
}
module.exports = {uploadFiles};