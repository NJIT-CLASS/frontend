

//PROPS:
//Files
import React, { Component } from 'react';


class FileLinksComponent extends Component {
    constructor(props){
        super(props);

        this.formatBytes = this.formatBytes.bind(this);
    }

    formatBytes(a, b) {
        if (0 == a) return '0 Bytes'; var c = 1024, d = b || 2, e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
    }
    render() {
        const downloadLink = `${window.location.protocol}//${window.location.host}/api/file/download/`;
        let { Files, Strings } = this.props;
        if (Files === null || Files.length <= 0) {
            return <div></div>;
        }

        return <div className="file-list">
            <label>{Strings.UploadFiles}:</label><br />
            {
                Files.map((file) => {
                    return <div key={`file-${file.FileID}`} className="file-link">
                        <a target="_blank" href={downloadLink + file.FileID}>{file.filename} - {this.formatBytes(file.size)}</a><br />
                    </div>;
                }, this)
            }
        </div>;

    };
}
FileLinksComponent.defaultProps = {
    Strings: {
        UploadFiles: 'Files Uploads'
        
    }
};

export default FileLinksComponent;
