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

    fetchGoals(){
        apiCall.get(`/goals/section/${this.props.SectionID}`, (err,res,body) => {
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
                {
                    Goals.map(goal => 
                        <div>
                            <span>{goal.Goal.Name}</span><Tooltip ID={`goal-${goal.GoalInstanceID}-tooltip`} Text='' />
                            <Toggle /> <label>{Strings.Requirements}</label><input type="text" />
                        </div>)
                }
            </div>
        );
    }
}

export default GoalOptions;