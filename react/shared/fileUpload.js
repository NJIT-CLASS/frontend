import React from 'react';

class FileUpload extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            UploadStatus: 'start', //start,error,pending,success
            Response: null,
            Files:[],
            HasFiles: false
        };
    }

    uploadFiles(){
        this.setState({
            UploadStatus: 'pending'
        });
        let formData = new FormData();
        formData.append('userId', this.props.UserID);
        let filesAr = [];
        if(this.props.NumberOfFiles === null || this.props.NumberOfFiles === undefined){
            [].forEach.call(this.refs.uploadInput.files, function (file) {
                filesAr.push(file);
                formData.append('files', file);
            });
        }
        else{
            for(let i = 0; i < this.props.NumberOfFiles; i++){
                formData.append('files', this.refs.uploadInput.files[i]);
            }
        }
        this.setState({Files: filesAr});
        const x = this;
        var xhr = new XMLHttpRequest();
        xhr.open( 'POST', `${this.props.apiUrl}/api/upload/profile-picture`, true);
        xhr.onreadystatechange = function(){
            if(this.readyState == 4) {
                if(this.status == 200){
                    x.setState({
                        UploadStatus: 'success',
                        Response: this.responseText
                    });
                }
                else{
                    console.log('Sorry, there was an error', this.responseText);
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
        let label = this.props.Strings.selectLabel;
        if(this.refs.uploadInput !== undefined && this.refs.uploadInput.files.length > 0){
            label = `${this.refs.uploadInput.files.length} ${this.props.Strings.filesLabel}`;
        }

        switch(this.state.UploadStatus){
        case 'start':
            uploadView = (
              <form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
                <input onChange={this.selectClick.bind(this)} ref="uploadInput" type="file" name="file-upload-input" id="file-upload-input" className="upload-file-input" multiple/>
                <label  htmlFor="file-upload-input">{label}</label>

                <button type="button" ref="button" value="Upload" onClick={this.uploadFiles.bind(this)}>{this.props.Strings.buttonLabel}</button>
              </form>
          );
            break;
        case 'pending':
            uploadView = (
              <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
            );
            break;
        case 'success':
            uploadView = (<div>Upload Complete</div>);
            break;
        case 'error':
            uploadView = (<div>Upload Error</div>);
            break;
        default:
            uploadView = <div></div>;
        }

        return (
          <div className="upload-view-section">
            {uploadView}
          </div>
        );
    }
}

FileUpload.defaultProps = {
    Strings:{
        buttonLabel: 'Upload',
        filesLabel: 'Files',
        selectLabel: 'Select Files'
    }

};

export default FileUpload;
