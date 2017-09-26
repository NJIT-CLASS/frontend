import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Strings from './strings';
import {Radio, RadioGroup} from 'react-radio-group';
class BasicSettings extends Component {
    constructor(props){
        super(props);

        this.state = {};

    }

    render() {
        return (
            <div className="general-settings">
                <span className='header'>{Strings.GeneralSettings}</span>

                <div className="center-block">
                    <div className="option">
                        <div className="option-label">
                            <label>{Strings.CourseGamificationFeatures}</label>
                        </div>
                        <div className="option-value">
                            <RadioGroup className='radio-group'>
                                <label>{Strings.On}
                                    <Radio value="on" />
                                </label>
                                <label>
                                    {Strings.Off}
                                    <Radio value="off" />
                                </label>
                            </RadioGroup>
                        </div>
                    </div>
                    <div className="option">
                        <div className="option-label">
                            <label>{Strings.AverageNumOfAssignments}</label>
                        </div>
                        <div className="option-value">
                            <input type="text" className="avg-input"/>
                        </div>
                    </div>
                    <div className="option">
                        <div className="option-label">
                            <label>{Strings.PointsAwardedForEachTask}</label>
                        </div>
                        <div className="option-value">
                            <RadioGroup className='radio-group'>
                                <label>{Strings.Low}
                                    <Radio value="low" />
                                </label>
                                <label>
                                    {Strings.Medium}
                                    <Radio value="medium" />
                                </label>
                                <label>
                                    {Strings.High}
                                    <Radio value="high" />
                                </label>
                            </RadioGroup>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BasicSettings;