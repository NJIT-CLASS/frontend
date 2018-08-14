import React, { Component } from 'react'; //import the React library and the Component class from the react package
import TableComponent from '../shared/tableComponent';
import Tooltip from '../shared/tooltip';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import Select from 'react-select';

class ToggleInstructorVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {
            Tasks:[],
            Volunteer: this.props.Volunteer,
            VolunteerPoolID: (this.props.VolunteerPoolID != null) ? this.props.VolunteerPoolID : -1
        };
    }

    componentWillMount() {
      console.log('Mounting', this.state.VolunteerPoolID, this.props.VolunteerPoolID, this.props.AssignmentInstanceID);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.VolunteerPoolID != this.state.VolunteerPoolID) {
        this.setState({VolunteerPoolID: nextProps.VolunteerPoolID})
      }
    }

    toggleVolunteer(assignmentInstanceId){
        let postVars = {
            UserID: this.props.UserID,
            SectionID: this.props.SectionID,
            AssignmentInstanceID: assignmentInstanceId,
            //VolunteerPoolID: this.state.VolunteerPoolID,
        };
        console.log(this.props.AssignmentInstanceID, this.state.VolunnteerPoolID);

        apiCall.post('/VolunteerPool/appoint', postVars, (err, res, body) => {
            console.log(res, body);
            this.props.Update();
        });
    }

    handleAppoint() {
      apiCall.post('/VolunteerPool/appoint', {userId: this.props.UserID, SectionID: this.props.SectionID, AssignmentInstanceID: this.props.AssignmentInstanceID}, (err, res, body) => {
          console.log(res, body);
          this.props.Update();
      });
    }

    handleChangeStatus(event) {
      console.log('Event value - handling change', event.value);
      //if (event.value == 'Appointed') {
        //apiCall.post('/VolunteerPool/appoint', {UserID: this.props.UserID, SectionID: this.props.SectionID, AssignmentInstanceID: this.props.AssignmentInstanceID}, (err, res, body) => {
          //  console.log(res, body);
            //this.props.Update();
      //  });
      //}
      //else {
      apiCall.post('/VolunteerPool/individualStatusUpdate', {VolunteerPoolID: this.state.VolunteerPoolID, status: event.value}, (err, res, body) => {
          console.log(res, body);
          this.props.Update();
      });
    //}
  }

    render() {
      let Approved = <Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Approved', value: 'Approved'}, {label: 'Removed', value: 'Removed'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      />
      let Appointed = <Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Appointed', value: 'Appointed'}, {label: 'Removed', value: 'Removed'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      />
      let Pending = <Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Pending', value: 'Pending'}, {label: 'Approved', value: 'Approved'}, {label: 'Declined', value: 'Declined'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      />
      let RemovedAppoint = <Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Removed', value: 'Removed'}, {label: 'Approved', value: 'Approved'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      />
      let DeclinedAppointed = <Select style={{width: '100px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Declined', value: 'Declined'}, {label: 'Appointed', value: 'Appointed'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      />
      let Others = <Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Appointed', value: 'Appointed'}]} onChange={this.handleAppoint.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      />
        if (this.props.Status == 'Approved') {
          return Approved;
        }
        else if (this.props.Status == 'Appointed') {
          return Appointed;
        }
        else if (this.props.Status == 'Pending') {
          return Pending;
        }
        else if (this.props.Status == 'Removed') {
          return RemovedAppoint;
        }
        else if (this.props.Status == 'Declined') {
          return DeclinedAppointed;
        }
        else {
          return Others;
        }
    }
}
export default ToggleInstructorVolunteerComponent;
