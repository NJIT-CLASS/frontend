import React from 'react';
import PropTypes from 'prop-types';

class ToggleSwitch extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        let classStyle = 'toggle-switch ';
        if(!this.props.disabled){
            if(this.props.isClicked){
                classStyle += 'true';
            } else {
                classStyle += 'false';
            }
        } else {
            classStyle += 'disabled';
        }
        
        return(<div className={classStyle}
            onClick={() => {
                if(!this.props.disabled && this.props.click){
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
ToggleSwitch.PropTypes = {
    isClicked: PropTypes.bool,
    yesLabel: PropTypes.string,
    noLabel: PropTypes.string,
    disabled: PropTypes.bool,
    click: PropTypes.func
};

export default ToggleSwitch;
