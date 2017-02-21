import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import {stateToHTML} from 'draft-js-export-html';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      EditorState: null,
      Marky: null
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({value: value});
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

  render() {
    let toolbarOptions = null;

    return (
      <div>
        <Editor
          editorState={this.state.EditorState}
          onEditorStateChange={this.onEditorStateChange.bind(this)}
        />

        <div dangerouslySetInnerHTML={{ __html: this.state.Marky }}>
        </div>
        <div dangerouslySetInnerHTML={{ __html: "I'm alive" }}>
        </div>


   </div>
    );
  }
}

export default App;
