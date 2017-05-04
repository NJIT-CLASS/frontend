import React from 'react';

//PROPS:
//Files
//apiUrl
const FileLinksComponent = ({Files, apiUrl}) => {
    const downloadLink = `${apiUrl}/api/download/file/`;

    if(Files === null){
        return <div></div>;
    }
    
    return <div>
          {
            Files.map((fileID) => {
                return <div> <a href={downloadLink+fileID}>{fileID}</a><br/></div>;
            })
          }
        </div>;

};

export default FileLinksComponent;
