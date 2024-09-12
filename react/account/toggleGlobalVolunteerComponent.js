import React, { Component } from 'react'; //import the React library and the Component class from the react package
import TableComponent from '../shared/tableComponent';
import Tooltip from '../shared/tooltip';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import Toggle from '../shared/toggleSwitch';

class ToggleGlobalVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {
            Volunteer: this.props.Volunteer,
            VolunteerToggle: (this.props.Volunteer != 0) ? true : false
        };
    }

    componentWillMount() {
      this.props.Update();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.Volunteer != this.state.Volunteer) {
        this.setState({Volunteer: nextProps.Volunteer, VolunteerToggle: (nextProps.Volunteer != 0) ? true : false})
      }
    }

    toggleGlobalVolunteer(status){
      apiCall.post(`/sectionUsers/changeVolunteer/${this.props.UserID}/${this.props.SectionID}/${status}/${'student'}`, (err, res, body) => {
          if(res.statusCode === 201){
              this.props.Update();
          }
      });
    }

    handleChangeGlobalVolunteer() {
      console.log('handleChangeGlobalVolunteer', this.state.Volunteer);
      if (this.state.Volunteer == 0) {
        this.toggleGlobalVolunteer('Pending');
      }
      else {
        this.toggleGlobalVolunteer(0);
      }
    }

    render() {
      return (
        <div>
        <a>Volunteer for all assignments in this section: </a>
        {(this.state.Volunteer == 0 || this.state.Volunteer == 'Pending') && (<Toggle
            isClicked={this.state.VolunteerToggle}
            click={() => this.handleChangeGlobalVolunteer()}
            />)}
        {this.props.Volunteer != 0 && <a>{this.props.Volunteer}</a>}
        </div>
        );
    }
}
export default ToggleGlobalVolunteerComponent;
