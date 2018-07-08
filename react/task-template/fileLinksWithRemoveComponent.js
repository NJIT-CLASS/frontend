import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serverCall from '../shared/serverCall';

class FileLinkRemoveComponent extends Component {
    constructor(props){
        super(props);
        
        this.formatBytes = this.formatBytes.bind(this);
    }

    formatBytes(a, b) {
        if (0 == a) return '0 Bytes'; var c = 1024, d = b || 2, e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], f = Math.floor(Math.log(a) / Math.log(c)); return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f];
    }

    deleteFile(file){
        const postVars = {
            taskId: this.props.TaskID,
            fileId: file.FileID
        };
        if(confirm('Are you sure you want to delete this file?')){
            serverCall.delete('/api/file/delete/', postVars, (err, res, body) => {
                console.log(body);
                this.props.onChange(-1);
            });
        }
        
    }

    render() {
        let { Files, Strings } = this.props;
        const downloadLink = `${window.location.protocol}//${window.location.host}/api/file/download/`;
        
        if (Files === null || Files.length <= 0) {
            return <div></div>;
        }

        return <div className="file-list">
            <label>{Strings.UploadFiles}:</label><br />
            {
                Files.map((file) => {
                    let bytes = this.formatBytes(file.size);
                    return <div key={`file-${file.FileID}`} className="file-link">
                        <a target="_blank" href={downloadLink + file.FileID}>{file.filename} - {bytes}</a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a key={`file-delete-${file.FileID}`} onClick={this.deleteFile.bind(this, file)}><i className="fa fa-times" aria-hidden="true"></i></a><br />
                    </div>;
                }, this)
            }
        </div>;
    }
}



FileLinkRemoveComponent.defaultProps = {
    Strings: {
        UploadFiles: 'Files Uploads'

    }
};

export default FileLinkRemoveComponent;
