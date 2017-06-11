import React from 'react';

class ButtonView extends React.Component {
    constructor(props){
        super(props);

        this.callUpload = this.callUpload.bind(this);
    }

    callUpload(){
        this.props.uploadFiles(this.refs.uploadInput.files);
    }

    render(){
        let {uploadFiles, selectClick, Strings, UploadStatus, NumberUploaded, MinUploads, MaxUploads, uploadRef, HasFiles} = this.props;
        let uploadView = null;
        let label = Strings.selectLabel;

        if(this.refs.uploadInput !== undefined && this.refs.uploadInput.files.length > 0){
            label = `${this.refs.uploadInput.files.length} ${Strings.filesLabel}`;
        }

        let inputView = (
          <input onChange={selectClick} ref="uploadInput" type="file" name="file-upload-input" id="file-upload-input" className="upload-file-input" multiple/>
        );

        let buttonView = (
          <button type="button" ref="button" value="Upload" onClick={this.callUpload}>{Strings.buttonLabel}</button>
        );

        switch(UploadStatus){
        case 'start':
            uploadView = (
          <form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
          {inputView}
            <label  htmlFor="file-upload-input">{label}</label><div className="inline"> {Strings.Min}: {MinUploads} {Strings.Max}: {MaxUploads}</div>
            {buttonView}

          </form>
      );
            break;
        case 'pending':
            uploadView = (
          <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
        );
            break;
        case 'success':
            if(NumberUploaded < MinUploads){
                uploadView = (
              <form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
              {inputView}
                <label  htmlFor="file-upload-input">{Strings.buttonLabel}</label>
                <div className="inline">{Strings.uploadedLabel} {NumberUploaded} {Strings.Min}: {MinUploads} {Strings.Max}: {MaxUploads}</div>
                {buttonView}

              </form>
          );
            }else{
                uploadView = (<div>{Strings.UploadComplete}</div>);

            }
            break;
        case 'error':
            uploadView = (<div>{Strings.UploadError}
          <form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
            {inputView}
            <label  htmlFor="file-upload-input">{Strings.buttonLabel}</label>
            <div className="inline">{Strings.uploadedLabel} {NumberUploaded} {Strings.Min}: {MinUploads} {Strings.Max}: {MaxUploads}</div>
            {buttonView}

          </form>
        </div>);
            break;
        case 'full':
            uploadView = (<div>
            <form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
              <label  htmlFor="file-upload-input">{Strings.fullLabel}</label>
              <div className="inline">{Strings.uploadedLabel} {NumberUploaded} {Strings.Min}: {MinUploads} {Strings.Max}: {MaxUploads}</div>

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

export default ButtonView;
