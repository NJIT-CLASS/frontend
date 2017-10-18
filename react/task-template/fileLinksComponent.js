import React from 'react';

//PROPS:
//Files
//apiUrl
const FileLinksComponent = ({Files, apiUrl, Strings}) => {
    const downloadLink = `${window.location.protocol}//${window.location.host}/api/file/download/`;

    if(Files === null){
        return <div></div>;
    }

    return <div className="file-list">
        <label>{Strings.UploadFiles}:</label><br/>
        {
            Files.map((fileID) => {
                return <div key={`file-${fileID}`} className="file-link"> <a target="_blank" href={downloadLink+fileID}>{fileID}</a><br/></div>;
            })
        }
    </div>;

};

FileLinksComponent.defaultProps = {
    Strings: {
        UploadFiles: 'Files Uploads'
        
    }
};

export default FileLinksComponent;
