import React from 'react';

class Checkbox extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      Clicked: this.props.isClicked
    }
  }



  render(){
    return(<div className={this.state.Clicked ? "checkbox checked" : "checkbox"}  onClick={() => {
      this.setState({
        Clicked: this.state.Clicked ? false: true
      });
      this.props.click();
    }}>

    </div>)
  }
}

export default Checkbox;
