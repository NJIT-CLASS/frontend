import React, { Component } from 'react'; //import the React library and the Component class from the react package
import TableComponent from '../shared/tableComponent';
import Tooltip from '../shared/tooltip';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import Select from 'react-select';

class ToggleInstructorGlobalVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {

        };
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

    handleChangeStatus(status){
      apiCall.post(`/sectionUsers/changeVolunteer/${this.props.UserID}/${this.props.SectionID}/${status.value}/${'instructor'}`, (err, res, body) => {
          if(res.statusCode === 201){
              this.props.Update();
          }
      });
    }

    render() {
      let strings = {
        VolunteerAll: 'Volunteer for all assignments in this section'
      };
      let Approved = <div><a>{strings.VolunteerAll}</a><Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Approved', value: 'Approved'}, {label: 'Removed', value: 'Removed'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      /></div>;
      let Appointed = <div><a>{strings.VolunteerAll}</a><Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Appointed', value: 'Appointed'}, {label: 'Removed', value: 'Removed'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      /></div>;
      let Pending = <div><a>{strings.VolunteerAll}</a><Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Pending', value: 'Pending'}, {label: 'Approved', value: 'Approved'}, {label: 'Declined', value: 'Declined'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      /></div>;
      let RemovedAppoint = <div><a>{strings.VolunteerAll}</a><Select style={{width: '100px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Removed', value: 'Removed'}, {label: 'Approved', value: 'Approved'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      /></div>
      let DeclinedAppointed = <div><a>{strings.VolunteerAll}</a><Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Declined', value: 'Declined'}, {label: 'Appointed', value: 'Appointed'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      /></div>;
      let Others = <div><a>{strings.VolunteerAll}</a><Select style={{width: '110px'}} className="small-select"
          clearable={false} searchable={true}
          options={[{label: 'Appointed', value: 'Appointed'}]} onChange={this.handleChangeStatus.bind(this)}
          value={this.props.Status}
          placeholder={'Select...'}
      /></div>;
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
export default ToggleInstructorGlobalVolunteerComponent;
