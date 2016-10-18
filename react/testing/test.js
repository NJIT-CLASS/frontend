import React from "react";
import RichTextEditor from 'react-rte';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    value: RichTextEditor.createEmptyValue(),
    finalString: ''};

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({value: value});
  };
  onButtonClick(){
    let str = this.state.value.toString('html')
    this.setState({
      finalString: str
    });
  }

  render() {
    return (
      <div>
        <RichTextEditor
         value={this.state.value}
         onChange={this.onChange}
          />

        <button style={{display: 'block'}} onClick={this.onButtonClick.bind(this)} >Click Me</button>


        <RichTextEditor value={RichTextEditor.createValueFromString(this.state.finalString, 'html')}
          readOnly={true}  />

   </div>
    );
  }
}

export default App;
