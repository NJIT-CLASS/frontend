import React from "react";
import Popup from "reactjs-popup";
import Modal from "../modal";
// npm i reactjs-popup, npm audit fix

class ButtonView extends React.Component {
  constructor(props) {
    super(props);

    this.callUpload = this.callUpload.bind(this);
  }

  callUpload() {
    this.props.uploadFiles(this.refs.uploadInput.files);
  }

  render() {
    let {
      uploadFiles,
      selectClick,
      Strings,
      UploadStatus,
      NumberUploaded,
      MinUploads,
      MaxUploads,
      uploadRef,
      HasFiles
    } = this.props;
    let uploadView = null;
    let label = Strings.selectLabel;

    if (
      this.refs.uploadInput !== undefined &&
      this.refs.uploadInput.files.length > 0
    ) {
      label = `${this.refs.uploadInput.files.length} ${Strings.filesLabel}`;
    }

    let inputView = (
      <input
        onChange={selectClick}
        ref="uploadInput"
        type="file"
        name="file-upload-input"
        id="file-upload-input"
        className="upload-file-input"
        multiple
      />
    );

    let buttonView = (
      <button
        type="button"
        ref="button"
        value="Upload"
        onClick={this.callUpload}
      >
        {Strings.buttonLabel}
      </button>
    );

    let fileInstructionButtonView = (
      <Popup trigger={<button>File Upload Instructions</button>}>
            <div style="overflow-y:auto;">
              <ul>
                  <li>First select file(s), then choose “Upload”</li>
                  <li>There may be a 1-3 minute delay before you see the file you uploaded</li>
                  <li>To remove or replace a file, click on the “x” and then optionally upload a new one</li>
                  <li>To download the file, click on the link</li>
                  <li>If the file doesn’t download or you can’t read the downloaded file, right click on the file name and choose “Save As” and select the correct file type</li>
                  <li>If you still have trouble downloading, try in other browser</li>
              </ul>
              </div>
          </Popup>
    );

    switch (UploadStatus) {
      case "start":
        uploadView = (
          <form
            ref="uploadForm"
            className="fileUpload-view"
            encType="multipart/form-data"
          >
            {inputView}
            <label style={{ cursor: "pointer" }} htmlFor="file-upload-input">
              {label}
            </label>
            <div className="inline">
              {Strings.uploadedLabel}: {NumberUploaded} {Strings.Min}:{" "}
              {MinUploads} {Strings.Max}: {MaxUploads}
            </div>
            {buttonView}
            {fileInstructionButtonView}
          </form>
        );
        break;
      case "pending":
        uploadView = <i className="fa fa-spinner fa-pulse fa-2x fa-fw" />;
        break;
      case "success":
        if (NumberUploaded < MaxUploads) {
          uploadView = (
            <form
              ref="uploadForm"
              className="fileUpload-view"
              encType="multipart/form-data"
            >
              {inputView}
              <label style={{ cursor: "pointer" }} htmlFor="file-upload-input">
                {label}
              </label>
              <div className="inline">
                {Strings.uploadedLabel}: {NumberUploaded} {Strings.Min}:{" "}
                {MinUploads} {Strings.Max}: {MaxUploads}
              </div>
              {buttonView}
              {fileInstructionButtonView}
            </form>
          );
        } else {
          uploadView = <div>{Strings.UploadComplete}</div>;
        }
        break;
      case "error":
        uploadView = (
          <div>
            {Strings.UploadError}
            <form
              ref="uploadForm"
              className="fileUpload-view"
              encType="multipart/form-data"
            >
              {inputView}
              <label style={{ cursor: "pointer" }} htmlFor="file-upload-input">
                {Strings.buttonLabel}
              </label>
              <div className="inline">
                {Strings.uploadedLabel}: {NumberUploaded} {Strings.Min}:{" "}
                {MinUploads} {Strings.Max}: {MaxUploads}
              </div>
              {buttonView}
              {fileInstructionButtonView}
            </form>
          </div>
        );
        break;
      case "full":
        uploadView = (
          <div>
            <form
              ref="uploadForm"
              className="fileUpload-view"
              encType="multipart/form-data"
            >
              <label style={{ cursor: "pointer" }} htmlFor="file-upload-input">
                {Strings.fullLabel}
              </label>
              <div className="inline">
                {Strings.uploadedLabel}: {NumberUploaded} {Strings.Min}:{" "}
                {MinUploads} {Strings.Max}: {MaxUploads}
              </div>
            </form>
          </div>
        );
        break;
      default:
        uploadView = <div />;
    }
    return <div className="upload-view-section">{uploadView}</div>;
  }
}

export default ButtonView;
