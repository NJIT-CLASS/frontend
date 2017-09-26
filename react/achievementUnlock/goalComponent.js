import React, { Component } from 'react';
import apiCall from '../shared/apiCall';

class Goal extends Component {
    constructor(props) {
        super(props);

        this.claimClick = this.claimClick.bind(this);

        this.state = {
            NoImage: false
        };
    }

    claimClick(){
        let {Claim, Points,Threshold, UserPointInstanceID} = this.props.Goal;
        
        if(Points >= Threshold){
            this.props.claimReward(UserPointInstanceID);
        }

    }
    
    render() {
        let {Strings} = this.props;
        let {NoImage} = this.state;
        let {Logo, Name, Claim, Points,Threshold, Description, LogoAchieved } = this.props.Goal;
        let displayText = <div className="points">{Points} {Strings.Out} {Threshold}</div>;
        if(Points >= Threshold){
            displayText = <div className="points">{Strings.ClickToClaim}</div>;
        }
        if(Claim){
            displayText = <div className="points">{Strings.EarnedECPoints}</div>;
        }

        let logoToShow = Points >= Threshold ? LogoAchieved : Logo;
        return (
            <div className="section goal">
                <div className="section-content" onClick={this.claimClick} style={{cursor: Points >= Threshold ? 'pointer':'default'}}>
                    <div className="name">{Name}</div>
                    <img className={NoImage ? 'no-image' : ''}onError={()=> {
                        this.setState({
                            NoImage: true
                        });
                    }} height="80" width="80" src={'/static/images/achievements/' + logoToShow} ></img>
                   
                    <div className="description">{Description}</div>
                    {displayText}
                </div>
                
            </div>
        );
    }
}

export default Goal;