import React from 'react';

class Container extends React.Component{
  constructor(props){
    super(props);

    this.state = {

    };
  }

  render(){

    return (
      <div>
        <div>Hello</div>
        <div>{this.props.UserID}</div>
        <div>{this.props.apiUrl}</div>
      </div>
    );
  }

}

export default Container;
