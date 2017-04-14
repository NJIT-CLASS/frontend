import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';
import ReactQuill from 'react-quill';
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

        return (
      <div>
        <ReactQuill
          theme={'snow'}
          onChange={this.onChange}
          value={this.state.EditorHTML}
        />
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: this.state.EditorHTML }}>
        </div>


   </div>
        );
    }
}

export default App;
