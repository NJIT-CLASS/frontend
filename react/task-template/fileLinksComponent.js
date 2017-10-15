import React from 'react';

//PROPS:
//Files
//apiUrl
const FileLinksComponent = ({Files, apiUrl}) => {
    const downloadLink = `${window.location.protocol}//${window.location.host}/api/file/download/`;

    if(Files === null){
        return <div></div>;
    }

    return <div>
        {
            Files.map((fileID) => {
                return <div key={`file-${fileID}`}> <a target="_blank" href={downloadLink+fileID}>{fileID}</a><br/></div>;
            })
        }
    </div>;

};

export default FileLinksComponent;
