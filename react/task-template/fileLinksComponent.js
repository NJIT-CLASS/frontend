import React from 'react';

//PROPS:
//Files
//apiUrl

function formatBytes(a, b) { 
    if (0 == a) return '0 Bytes'; var c = 1024, d = b || 2, e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]; }

const FileLinksComponent = ({Files, apiUrl, Strings}) => {
    const downloadLink = `${window.location.protocol}//${window.location.host}/api/file/download/`;

    if(Files === null || Files.length <= 0){
        return <div></div>;
    }

    return <div className="file-list">
        <label>{Strings.UploadFiles}:</label><br/>
        {
            Files.map((file) => {
                return <div key={`file-${file.FileID}`} className="file-link">
                    <a target="_blank" href={downloadLink+file.FileID}>{file.filename} - {formatBytes(file.size)}</a><br/>
                </div>;
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
