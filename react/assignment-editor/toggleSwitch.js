import React from 'react';

class ToggleSwitch extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      Clicked: this.props.isClicked
    }
  }



  render(){
    return(<div className={this.state.Clicked ? "toggle-switch true" : "toggle-switch false"} style={{float:'right', clear: 'right', margin: '8px 0px' }} onClick={() => {
        this.setState({Clicked: this.state.Clicked ? false : true});
        this.props.click();
      }} >
      <div className="bubble"></div>
      <div className="text-true">Yes</div>
      <div className="text-false">No</div>
    </div>)
  }
}

export default ToggleSwitch;
