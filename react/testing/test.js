import React from 'react';
import ReactQuill from 'react-quill';
import FileUpload from '../shared/fileUpload';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            EditorState: null,
            EditorHTML: '',
            Marky: null
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(html) {
        this.setState({EditorHTML:html});
    }

    onEditorStateChange(editorState){
        const markup = editorState.getCurrentContent();
        let html = stateToHTML(markup);
        console.log(html);
        this.setState({
            EditorState: editorState,
            Marky: html
        });

    }


    // <Editor
    //   editorState={this.state.EditorState}
    //   onEditorStateChange={this.onEditorStateChange.bind(this)}
    // />

    render() {
        let toolbarOptions = null;
        let gray = <div className="text"></div>;
        return (<div>
            <div className="section placeholder-card">
                <h2 className="title">{gray}</h2>
                <div className="section-content">
                    {gray}
                    <br/>
                    <div className="textarea"></div>
                </div>
            </div>

            <div>
                <ReactQuill
                    theme={'snow'}
                    onChange={this.onChange}
                    value={this.state.EditorHTML}
                />
                <div className="ql-editor" dangerouslySetInnerHTML={{ __html: this.state.EditorHTML }}>
                </div>


            </div>

            <FileUpload View="dropzone" endpoint={'/api/upload/profile-picture'} PostVars={{userId: 70}}/>

        </div>
        );
    }
}

export default App;
