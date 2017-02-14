import React from "react";
import { Editor } from 'react-draft-wysiwyg';
import convertToHTML from 'draft-convert';

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
  };

  onEditorStateChange(editorState){
    const markup = convertToHTML(editorState.getCurrentContent());

  this.setState({
    EditorState: editorState,
    Marky: markup
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



   </div>
    );
  }
}

export default App;
