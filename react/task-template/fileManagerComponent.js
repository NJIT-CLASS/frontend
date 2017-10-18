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
        apiCall.get(`/task/files/${this.props.TaskID}`, (err, res, body)=> {
            console.log(body);
            this.setState({
                Files: typeof body.Files == 'string' ? JSON.parse(body.Files) : body.Files
            });
        });
    }

    handleUpload(args){
        this.props.onChange(args);
        this.fetchFiles();
    }

    render() {
        let {Files} = this.state;
        let {Strings, View,InitialNumberUploaded, PostVars, MinUploads,endpoint,MaxUploads} = this.props;

        return (
            <div>
                <FileLinksComponent Files={Files} Strings={Strings}/>
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
            </div>
        );
    }
}

export default FileManagerComponent;