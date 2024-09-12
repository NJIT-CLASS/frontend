import React, { Component } from 'react'; //import the React library and the Component class from the react package
import TableComponent from '../shared/tableComponent';
import Tooltip from '../shared/tooltip';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import Toggle from '../shared/toggleSwitch';

class ToggleVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {
            Tasks:[],
            Volunteer: this.props.Volunteer,
            VolunteerPoolID: (this.props.VolunteerPoolID != null) ? this.props.VolunteerPoolID : -1
        };
    }

    toggleVolunteer(assignmentInstanceId){
        let postVars = {
            UserID: this.props.UserID,
            SectionID: this.props.SectionID,
            AssignmentInstanceID: assignmentInstanceId,
            VolunteerPoolID: this.state.VolunteerPoolID,
        };
        console.log(this.props.AssignmentInstanceID);
        let endpoint = '';
        if(this.state.VolunteerPoolID != -1){
            endpoint = '/VolunteerPool/deleteVolunteer';
        } else {
            endpoint = '/VolunteerPool/add';
        }

        apiCall.post(endpoint, postVars, (err, res, body) => {
            console.log(res, body);
            this.props.Update();
            if(res.statusCode === 200){
                if(body){
                    this.setState({
                        Volunteer: true,
                        VolunteerPoolID: body.VolunteerPoolID
                    });
                } else {
                    this.setState({
                        Volunteer: false,
                        VolunteerPoolID: -1
                    });
                }

            }
        });
    }

    render() {
      return (
        <Toggle
            isClicked={this.state.Volunteer}
            click={() => this.toggleVolunteer(this.props.AssignmentInstanceID)}
            />
        );
    }
}
export default ToggleVolunteerComponent;
