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
            NumberJustUploaded: 0,
        };

        this.uploadFiles = this.uploadFiles.bind(this);
        this.selectClick = this.selectClick.bind(this);
    }



    uploadFiles(files){
        if(this.props.AllowUploads!== true){
            return;
        }

        ////## Send files to server
        let formData = new FormData();
        Object.keys(this.props.PostVars).forEach(key => {
            formData.append(key, this.props.PostVars[key]);
        });
        let filesAr = [];
        let upperLimit = 0;
        console.log('Maximum:', this.props.MaxUploads, this.props.MaxUploads === null || this.props.MaxUploads === undefined, typeof this.props.MaxUploads);
        upperLimit = files.length;
        if(this.props.MaxUploads === null || this.props.MaxUploads === undefined){
            console.log('No limit found');
            [].forEach.call(files, function (file) {
                filesAr.push(file);
                formData.append('files', file);
            });
        }
        else{
            console.log('limit found');
                
            let totalUploads = this.props.NumberUploaded;
            upperLimit = files.length < (this.props.MaxUploads - totalUploads) ?files.length : (this.props.MaxUploads - totalUploads);
            console.log('limit:', upperLimit, files.length < (this.props.MaxUploads - totalUploads) );
            for(let i = 0; i < upperLimit; i++){
                filesAr.push(files[i]);
                formData.append('files', files[i]);
            }
        }

        
        this.setState({
            UploadStatus: 'pending',
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
                    let netChangeInFiles = upperLimit;
                    let newNum = x.props.NumberUploaded + netChangeInFiles;
                    console.log('num vars', netChangeInFiles, newNum);
                    console.log(JSON.parse(this.responseText));
                    x.setState({
                        UploadStatus: 'success',
                        Response: this.responseText,
                        NumberUploaded: newNum,
                        NumberJustUploaded: 0
                    });

                    x.props.onChange(netChangeInFiles);
                }
                else{
                    x.setState({
                        UploadStatus: 'error',
                        Response: this.responseText,
                        NumberJustUploaded: 0
                        
                    });
                }
            }
            else{
                x.setState({
                    UploadStatus: 'pending',
                    Response: this.responseText,
                    NumberJustUploaded: 0
                    
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
        
        if(!this.props.AllowUploads){
            uploadStatus = 'full';
        }

        switch(this.props.View){
        case 'button':
            uploadView = (<ButtonView uploadFiles={this.uploadFiles} Strings={this.props.Strings} UploadStatus={uploadStatus}
                NumberUploaded={this.props.NumberUploaded} MinUploads={this.props.MinUploads}
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
    AllowUploads: true,
    onChange: function(newNum){}

};

export default FileUpload;
