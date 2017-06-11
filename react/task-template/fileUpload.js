import React from 'react';

class FileUpload extends React.Component{
    constructor(props){
        super(props);
        //PROPS:
        // onChange({conditionsMet, numberOfUploads})
        // MinUploads
        //  MaxUploads
        //  apiObject: {   <Post_Var_Name>: <POST_Value>,
        //                          ...
        //                 <Post_Var_Name>: <POST_Value>,
        //                 apiUrl: ''
        //              }
        //  InitialNumberUploaded
        this.state = {
            UploadStatus: 'start', //start,error,pending,success
            Response: null,
            Files:[],
            HasFiles: false,
            NumberUploaded: this.props.InitialNumberUploaded
        };
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
                <label  htmlFor="file-upload-input">{label}</label><div className="inline"> {this.props.Strings.Min}: {this.props.MinUploads} {this.props.Strings.Max}: {this.props.MaxUploads}</div>


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
            if(this.state.NumberUploaded < this.props.MinUploads){
                uploadView = (
                  <form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
                    <input onChange={this.selectClick.bind(this)} ref="uploadInput" type="file" name="file-upload-input" id="file-upload-input" className="upload-file-input" multiple/>
                    <label  htmlFor="file-upload-input">{this.props.Strings.buttonLabel}</label>
                    <div className="inline">{this.props.Strings.uploadedLabel} {this.state.NumberUploaded}/{this.props.MinUploads}</div>
                    <button type="button" ref="button" value="Upload" onClick={this.uploadFiles.bind(this)}>{this.props.Strings.buttonLabel}</button>

                  </form>
              );
            }else{
                uploadView = (<div>Upload Complete</div>);

            }
            break;
        case 'error':
            uploadView = (<div>Upload Error
              <form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
                <input onChange={this.selectClick.bind(this)} ref="uploadInput" type="file" name="file-upload-input" id="file-upload-input" className="upload-file-input" multiple/>
                <label  htmlFor="file-upload-input">{this.props.Strings.buttonLabel}</label>
                <div className="inline">{this.props.Strings.uploadedLabel} {this.state.NumberUploaded}/{this.props.MinUploads}</div>
                <button type="button" ref="button" value="Upload" onClick={this.uploadFiles.bind(this)}>{this.props.Strings.buttonLabel}</button>

              </form>
            </div>);
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

export default FileUpload;
