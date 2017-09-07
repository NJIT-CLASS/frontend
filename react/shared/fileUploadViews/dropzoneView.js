import React from 'react';
import Dropzone from 'react-dropzone';


const DropzoneView = ({uploadFiles, Strings}) => {

    return (<Dropzone accept="image/*" onDrop={uploadFiles}>{Strings.upload}</Dropzone>);
};

export default DropzoneView;
