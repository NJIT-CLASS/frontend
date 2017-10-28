import React, { Component } from 'react';
import FileLinksComponent from './fileLinksComponent';
import FileUpload from '../shared/fileUpload';
import apiCall from '../shared/apiCall';

class FileManagerComponent extends Component {
    constructor(props){
        super(props);

        this.state = {
            Files: [],
        };

        this.fetchFiles = this.fetchFiles.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }
    componentDidMount() {
        this.fetchFiles();
    }

    fetchFiles(){
        console.log('fileURL:', `/task/files/${this.props.TaskID}`);
        apiCall.get(`/task/files/${this.props.TaskID}`, (err, res, body)=> {
            console.log('Loaded files', body);
            let filesArr = typeof body.Files == 'string' ? JSON.parse(body.Files) : body.Files;
            filesArr = filesArr.map(file => {
                let newFileInfo = JSON.parse(file.Info);
                return {
                    FileID: file.FileID,
                    filename: newFileInfo.originalname,
                    size: newFileInfo.size,
                    mime: newFileInfo.mimetype
                };
            });
            this.setState({
                Files: filesArr
            });
        });
    }

    handleUpload(args){
        this.props.onChange(args);
        this.fetchFiles();
    }

    render() {
        let {Files} = this.state;
        let {Strings, View,InitialNumberUploaded, PostVars, MinUploads,endpoint,MaxUploads, ViewOnly} = this.props;
        let fileUpload = ViewOnly !== true ? (
            <FileUpload
                View={View}
                InitialNumberUploaded={InitialNumberUploaded}
                PostVars={PostVars}
                MinUploads={MinUploads}
                endpoint={endpoint}
                MaxUploads={MaxUploads}
                onChange={this.handleUpload}
                Strings={Strings}
            />
        ): <div></div>;
        return (
            <div>
                <FileLinksComponent Files={Files} Strings={Strings}/>
                {fileUpload}
            </div>
        );
    }
}
FileManagerComponent.defaultProps = {
    ViewOnly: false,
    View: 'button',
    MinUploads: 0,
    MaxUploads: 0,
    endpoint: '/'
};

export default FileManagerComponent;