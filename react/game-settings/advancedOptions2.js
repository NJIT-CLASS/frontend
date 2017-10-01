import React, { Component } from 'react';
import Toggle from '../shared/toggleSwitch';
import Tooltip from '../shared/tooltip';

class LeaderboardOptions extends Component {
    constructor(props){
        super(props);

        this.state = {};

    }
    render() {
        let {Strings} = this.props;
        return (
            <div className="leaderboard-settings">
                <div className="center-block">
                    <div className="header">{Strings.Leaderboard}</div>
                    <div className="option">
                        <div className="option-label">
                            <label>{Strings.UseAnnonymousNames}</label> <Tooltip ID={'leaderboard-anon-names-tooltip'} Text=''/><Toggle />
                            
                        </div>
                        <div className="option-value">
                            <label>{Strings.NumberOfRanksToShow}</label> <input type="number"/>
                            
                        </div>
                    </div>
                    <div className="option">
                        <div className="option-label">
                            <label>{Strings.CompeteAgainstOtherCourses}</label><Tooltip ID={'leaderboard-compete-courses-tooltip'} Text=''/><Toggle />
                            
                        </div>
                        
                    </div>
                    <br/>
                    
                   
                </div>
            </div>        
        );
    }
}

export default LeaderboardOptions;