import React from 'react';
import ButtonView from './fileUploadViews/buttonView';
import DropzoneView from './fileUploadViews/dropzoneView';
import { API_URL } from '../../server/utils/react_constants';

class FileUpload extends React.Component{
    constructor(props){
        super(props);
        //PROPS:
        // onChange({conditionsMet, numberOfUploads})
        // MinUploads
        //  MaxUploads
        //  endpoint (URL)
        //  InitialNumberUploaded
        //  PostVars //object containing any POST variables to be sent with the files eg. userId
        //
        this.state = {
            UploadStatus: 'start', //start,error,pending,success, full
            Response: null,
            Files:[],
            NumberUploaded: this.props.InitialNumberUploaded || 0,
            HasFiles: false,
            NumberJustUploaded: 0
        };

        this.uploadFiles = this.uploadFiles.bind(this);
        this.selectClick = this.selectClick.bind(this);
    }



    uploadFiles(files){
        if(this.props.MaxUploads && this.state.NumberUploaded >= this.props.MaxUploads){
            return;
        }

        this.setState({
            UploadStatus: 'pending'
        });
        let formData = new FormData();

        Object.keys(this.props.PostVars).forEach(key => {
            formData.append(key, this.props.PostVars[key]);
        });

        let filesAr = [];
        let upperLimit = 0;

        if(files === undefined){ //regular button
            upperLimit = this.uploadRef.files.length;
            if(this.props.MaxUploads === null || this.props.MaxUploads === undefined){
                [].forEach.call(this.uploadRef.files, function (file) {
                    filesAr.push(file);
                    formData.append('files', file);
                });
            }
            else{
                let totalUploads = this.state.NumberUploaded;
                upperLimit = this.uploadRef.files.length < (this.props.MaxUploads - totalUploads) ? this.uploadRef.files.length : (this.props.MaxUploads - totalUploads);
                for(let i = 0; i < upperLimit; i++){
                    filesAr.push(this.uploadRef.files[i]);
                    formData.append('files', this.uploadRef.files[i]);
                }
            }
        } else{
            //DropZone
            upperLimit = files.length;
            [].forEach.call(files, function (file) {
                formData.append('files', file);
                filesAr.push(file);
            });
        }

        this.setState({
            Files: filesAr,
            NumberJustUploaded: upperLimit
        });
        
        const x = this;
        var xhr = new XMLHttpRequest();
        //xhr.open( 'POST',`${API_URL}${this.props.endpoint}`, true);
        xhr.open( 'POST', `${window.location.protocol}//${window.location.host}${this.props.endpoint}`, true);
        xhr.onreadystatechange = function(){
            if(this.readyState == 4) {
                if(this.status == 200){
                    let newNum = x.state.NumberUploaded + x.state.NumberJustUploaded;
                    x.setState({
                        UploadStatus: 'success',
                        Response: this.responseText,
                        NumberUploaded: newNum
                    });
                    let changedConditions = {
                        conditionsMet: (x.state.NumberUploaded >= x.props.MinUploads) && (x.state.NumberUploaded <= x.props.MaxUploads),
                        numberOfUploads: newNum
                    };
                    console.log(changedConditions);
                    x.props.onChange(changedConditions);
                }
                else{
                    x.setState({
                        UploadStatus: 'error',
                        Response: this.responseText
                    });
                }
            }
            else{
                x.setState({
                    UploadStatus: 'pending',
                    Response: this.responseText
                });
            }

        };
        xhr.send(formData);

    }

    selectClick(){
        this.setState({
            HasFiles: true
        });
    }

    render(){
        let uploadView = null;
        let uploadStatus = this.state.UploadStatus;
        
        if(this.props.MaxUploads && this.state.NumberUploaded >= this.props.MaxUploads){
            uploadStatus = 'full';
        }

        switch(this.props.View){
        case 'button':
            uploadView = (<ButtonView uploadFiles={this.uploadFiles} Strings={this.props.Strings} UploadStatus={uploadStatus}
                NumberUploaded={this.state.NumberUploaded} MinUploads={this.props.MinUploads}
                MaxUploads={this.props.MaxUploads} selectClick={this.selectClick}
                uploadRef={el => this.uploadRef = el} HasFiles={this.state.HasFiles}

            />);
            break;
        case 'dropzone':
            uploadView = (<DropzoneView uploadFiles={this.uploadFiles} Strings={this.props.Strings} UploadStatus={uploadStatus}/>
            );
            break;
        }

        return (
            <div >
                {uploadView}
            </div>
        );
    }
}

FileUpload.defaultProps = {
    Strings:{
        buttonLabel: 'Upload',
        filesLabel: 'Files',
        selectLabel: 'Select Files',
        uploadedLabel: 'Uploaded',
        Min: 'Min',
        Max: 'Max',
        upload: 'Upload',
        UploadComplete: 'Upload Complete',
        UploadError: 'Upload Error',
        fullLabel: 'Limit Reached'
    },
    MinUploads: 0,
    MaxUploads: 1,
    onChange: function(newNum){}

};

export default FileUpload;
