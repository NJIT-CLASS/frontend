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

    uploadFiles(){
        this.setState({
            UploadStatus: 'pending'
        });

        let formData = new FormData();
        for (let attr in this.props.apiObject) {
            formData.append(attr, this.props.apiObject[attr]);
        }

        /*formData.append('userId', this.props.UserID);
        formData.append('taskInstanceId', this.props.TaskInstanceID);*/
        let filesAr = [];
        let upperLimit = this.refs.uploadInput.files.length;
        if(this.props.MaxUploads === null || this.props.MaxUploads === undefined){
            [].forEach.call(this.refs.uploadInput.files, function (file) {
                filesAr.push(file);
                formData.append('files', file);
            });
        }
        else{
            let totalUploads = this.state.NumberUploaded;
            upperLimit = this.refs.uploadInput.files.length < (this.props.MaxUploads - totalUploads) ? this.refs.uploadInput.files.length : (this.props.MaxUploads - totalUploads);
            for(let i = 0; i < upperLimit; i++){
                formData.append('files', this.refs.uploadInput.files[i]);
            }
        }
        this.setState({Files: filesAr});
        const x = this;
        var xhr = new XMLHttpRequest();
        xhr.open( 'POST', this.props.apiObject.apiUrl, true);
        xhr.onreadystatechange = function(){
            if(this.readyState == 4) {
                if(this.status == 200){
                    let newNum = x.state.NumberUploaded + upperLimit;
                    x.setState({
                        UploadStatus: 'success',
                        NumberUploaded: newNum,
                        Response: this.responseText
                    });

                    let changedConditions = {
                        conditionsMet: (x.state.NumberUploaded >= x.props.MinUploads) && (x.state.NumberUploaded <= x.props.MaxUploads),
                        numberOfUploads: newNum
                    };
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
                    <label  htmlFor="file-upload-input">{this.props.Strings.uploadedLabel} {this.state.NumberUploaded}/{this.props.MinUploads}</label>

                    <button type="button" ref="button" value="Upload" onClick={this.uploadFiles.bind(this)}>{this.props.Strings.buttonLabel}</button>
                  </form>
              );
            }else{
                uploadView = (<div>Upload Complete</div>);

            }
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
        selectLabel: 'Select Files',
        uploadedLabel: 'Uploaded',
        Min: 'Min',
        Max: 'Max'
    },
    changeNumber: function(newNum){}

};

export default FileUpload;
