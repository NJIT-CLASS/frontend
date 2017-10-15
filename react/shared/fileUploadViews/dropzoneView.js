import React from 'react';
import Dropzone from 'react-dropzone';


const DropzoneView = ({uploadFiles, Strings, UploadStatus}) => {

    return (<Dropzone onDrop={(e,e2) => {
        console.log('Dropzone', e, e2);
        uploadFiles(e);
    }}
    >{Strings.upload} {UploadStatus}</Dropzone>);
};

export default DropzoneView;
