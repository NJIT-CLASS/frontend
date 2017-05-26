import React from 'react';

class ToggleSwitch extends React.Component{
    constructor(props){
        super(props);
    }


    render(){

        return(<div className={this.props.isClicked ? 'toggle-switch true' : 'toggle-switch false'}
        onClick={() => {
            if(this.props.click){
                this.props.click();
            }
        }} >
      <div className="bubble"></div>
      <div className="text-true">{this.props.yesLabel}</div>
      <div className="text-false">{this.props.noLabel}</div>
    </div>);
    }
}

ToggleSwitch.defaultProps = {
    isClicked: false,
    yesLabel: 'Yes',
    noLabel: 'No'
};

export default ToggleSwitch;
