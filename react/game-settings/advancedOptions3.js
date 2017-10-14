import React, { Component } from 'react';
import Strings from './strings';
import Tooltip from '../shared/tooltip';


class LevelOptions extends Component {
    constructor(props){
        super(props);
        this.state = {
            NumberOfLevels: 10
        };
    }
    render() {
        let {NumberOfLevels} = this.state;
        let {Strings} = this.props;
        let levels = [...Array(NumberOfLevels).keys()].map(n => n+1);
        let lowerLevels = levels.slice(0, Math.floor(NumberOfLevels)/2);
        let upperLevels = levels.slice(Math.ceil(NumberOfLevels)/2, NumberOfLevels);

        return (
            <div className="level-settings">
                <div className="center-block">
                    <div className="header">{Strings.Levels}</div>
                    <div className="full-width">
                        <div className="first-third"><b>{Strings.LevelThresholds}</b>&nbsp;<Tooltip ID={'level-threshold-tooltip'} Text={''}/></div>
                        <div className="second-third">
                            {
                                lowerLevels.map(level => {
                                    return <label key={Strings.level + '-key'}>{Strings.Level}&nbsp;{level} <input type="text"/><br/></label>; 

                                })
                            }
                        </div>
                        <div className="third-third">
                            {
                                upperLevels.map(level => {
                                    return <label>{Strings.Level}&nbsp;{level} <input type="text"/><br/></label>; 

                                })
                            }
                        </div>
                    </div>
                    <div className="full-width">
                        <div className="first-third"><b>{Strings.PointsAllocation}</b>&nbsp;<Tooltip ID={'level-points-alloc-tooltip'} Text={''}/></div>
                        <div className="second-third">
                            <label>Create Question Placeholder &nbsp;<input type="text" /></label><br/>
                            <label>Create Solution Placeholder &nbsp;<input type="text" /></label>
                        </div>
                        <div className="third-third">
                            <label>Grade Others Placeholder &nbsp;<input type="text" /></label>
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LevelOptions;