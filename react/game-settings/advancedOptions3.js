import React, { Component } from 'react';
import Strings from './strings';
import Tooltip from '../shared/tooltip';


class LevelOptions extends Component {
    constructor(props){
        super(props);

    }
    render() {
        return (
            <div className="level-settings">
                <div className="center-block">
                    <div className="header">{Strings.Levels}</div>
                    <div className="full-width">
                        <div className="first-third"><b>{Strings.LevelThresholds}</b>&nbsp;<Tooltip ID={'level-threshold-tooltip'} Text={''}/></div>
                        <div className="second-third">Hello</div>
                        <div className="third-third">Holla</div>
                    </div>
                    <div className="full-width">
                        <div className="first-third"><b>{Strings.PointsAllocation}</b>&nbsp;<Tooltip ID={'level-points-alloc-tooltip'} Text={''}/></div>
                        <div className="second-third">Hello</div>
                        <div className="third-third">Holla</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LevelOptions;