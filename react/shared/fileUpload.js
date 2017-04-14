import React from 'react';

class FileUpload extends React.Component{
    constructor(props){
        super(props);

    }

    uploadFiles(){
        console.log('Uploading now');
        let formData = new FormData();
        formData.append('userId', this.props.UserID);

        if(this.props.NumberOfFiles === null || this.props.NumberOfFiles === undefined){
            [].forEach.call(this.refs.uploadInput.files, function (file) {
                formData.append('files', file);
            });
        }
        else{
            for(let i = 0; i < this.props.NumberOfFiles; i++){
                formData.append('files', this.refs.uploadInput.files[i]);
            }
        }

        var xhr = new XMLHttpRequest();
        xhr.open( 'POST', `${this.props.apiUrl}/api/upload/profile-picture`, true);
        xhr.onreadystatechange = function(){
            if(this.readyState == 4) {
                if(this.status == 200){
                    console.log('Uploads successful', this.responseText);
                }
                else{
                    console.log('Sorry, there was an error', this.responseText);
                }
            }
            else{
                console.log('Uploading...');
            }

        };
        xhr.send(formData);

    }

    render(){
        return (
			<form ref="uploadForm" className="fileUpload-view" encType="multipart/form-data" >
				<input ref="uploadInput" type="file" name="file" className="upload-file" multiple/>
				<button type="button" ref="button" value="Upload" onClick={this.uploadFiles.bind(this)}>Upload</button>
			</form>
        );
    }
}

export default FileUpload;
