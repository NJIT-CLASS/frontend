import React, { Component } from 'react';
import apiCall from '../shared/apiCall';

class Goal extends Component {
    constructor(props) {
        super(props);

        this.claimClick = this.claimClick.bind(this);
    }

    claimClick(){
        let {Claim, Points,Threshold, UserPointInstanceID} = this.props.Goal;
        
        if(Claim){
            this.props.claimReward(UserPointInstanceID);
        }

    }
    
    render() {
        let {Strings} = this.props;
        let {Logo, Name, Claim, Points,Threshold, Description, LogoAchieved } = this.props.Goal;
        let displayText = <div className="points">{Points} {Strings.Out} {Threshold}</div>;
        if(Claim){
            displayText = <div className="points">{Strings.ClickToClaim}</div>;
        }
        return (
            <div className="section goal">
                <div className="section-content" onClick={this.claimClick} style={{cursor: Claim ? 'pointer':'default'}}>
                    <div className="name">{Name}</div>
                    <img href={Logo} ></img>
                    <div className="description">{Description}</div>
                    {displayText}
                </div>
                
            </div>
        );
    }
}

export default Goal;