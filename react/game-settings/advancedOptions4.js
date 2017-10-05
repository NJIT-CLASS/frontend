import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import Toggle from '../shared/toggleSwitch';
import Tooltip from '../shared/tooltip';

class GoalOptions extends Component {
    constructor(props){
        super(props);

        this.state = {
            Goals: []
        };
    }

    componentWillMount() {
        this.fetchGoals(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.fetchGoals(nextProps);
    }
    fetchGoals(props){
        apiCall.get(`/getGoals/${props.SemesterID}/${props.CourseID}/${props.SectionID}`, (err,res,body) => {
            console.log(body);
            this.setState({
                Goals: body.Goals
            });
        });
    }
    render() {
        let {Goals} = this.state;
        let {Strings} = this.props;
        return (
            <div className="goal-settings">
                <div className="center-block">
                    <div className="header">{Strings.Goals}</div>
                    {
                        Goals.map(goal => 
                            <div>
                                <span>{goal.Name}</span>
                                <span className="tooltip-section">
                                    <Tooltip ID={`goal-${goal.GoalInstanceID}-tooltip`} Text='' />
                                    <Toggle />
                                </span>
                                <span className="requirement-section">
                                    
                                    <label>{Strings.Requirements}</label>&nbsp;<input type="text" />
                                </span>
                            </div>)
                    }
                </div>
                
            </div>
        );
    }
}

GoalOptions.defaultProps = {
    CourseID: 1,
    SectionID: 1,
    SemesterID: 1
};

export default GoalOptions;