import React, { Component } from 'react';
import FileLinksComponent from './fileLinksComponent';
import FileLinksRemoveComponent from './fileLinksWithRemoveComponent';
import FileUpload from '../shared/fileUpload';
import apiCall from '../shared/apiCall';
import ReactLoading from 'react-loading';

class FileManagerComponent extends Component {
    constructor(props){
        super(props);

        this.state = {
            Files: [],
            Refreshing: false,
        };

        this.fetchFiles = this.fetchFiles.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
    }
    componentDidMount() {
        this.fetchFiles();
    }

    fetchFiles(){
        this.setState({
            Refreshing: true
        });
        apiCall.get(`/task/files/${this.props.TaskID}`, (err, res, body)=> {
            if(err || res.statusCode != 200){
                this.setState({
                    Refreshing: false
                });
                return;
            }
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
                Files: filesArr,
                Refreshing: false
            });
        });
    }

    handleUpload(args){
        this.props.onChange(args);
        this.fetchFiles();
    }


    render() {
        let {Files, Refreshing} = this.state;
        let { Strings, View, InitialNumberUploaded, PostVars, MinUploads, endpoint, MaxUploads, ViewOnly, AllowUploads, TaskID} = this.props;
        
        if(Refreshing){
            return <div>Loading Files...<br/> <b>Please allow file upload to finish before submitting.</b> <br/> <ReactLoading type={'spin'} color="#e7e7e7" /></div>;
        }

        let fileLinksView = ViewOnly === true ? <FileLinksComponent Files={Files} Strings={Strings} /> :
            <FileLinksRemoveComponent Files={Files} Strings={Strings} TaskID={TaskID} onChange={this.handleUpload}/>;

        let fileUpload = (ViewOnly !== true || endpoint !== '') ? (
            <FileUpload
                View={View}
                InitialNumberUploaded={InitialNumberUploaded}
                PostVars={PostVars}
                MinUploads={MinUploads}
                endpoint={endpoint}
                MaxUploads={MaxUploads}
                onChange={this.handleUpload}
                Strings={Strings}
                AllowUploads={AllowUploads}
                NumberUploaded={Files.length}
            />
        ): <div></div>;
        return (
            <div>
                {fileLinksView}
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
    endpoint: '',
    onChange: () => {}
};

export default FileManagerComponent;