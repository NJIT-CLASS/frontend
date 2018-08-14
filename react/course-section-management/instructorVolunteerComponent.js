import React, { Component } from 'react'; //import the React library and the Component class from the react package
import TableComponent from '../shared/tableComponent';
import Tooltip from '../shared/tooltip';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import ToggleInstructorVolunteerComponent from './toggleInstructorVolunteerComponent';
import ToggleInstructorGlobalVolunteerComponent from './toggleInstructorGlobalVolunteerComponent';
import Select from 'react-select';
import Modal from 'react-responsive-modal';

class InstructorVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {
            Tasks:[],
            Volunteer: false,
        };
    }
    componentWillMount () {
      this.fetchTasks(this.props.UserID, this.props.SectionID);
      console.log('Instructor volunteer component user ID ', this.props.UserID, this.props.FirstName, this.props.LastName, 'section ID ', this.props.SectionID);
      if (this.getQS('user') == this.props.UserID) {
        this.openModal();
      }
    }

    fetchTasks(userId, sectionId){
        apiCall.get(`/VolunteerPool/${userId}/${sectionId}/${false}`, (err, res,body)=> {
          if(!body.Error){
                  this.setState({Tasks: body.Volunteers})
              }
      });
      this.GlobalUpdate();
    }

    Update() {
        this.fetchTasks(this.props.UserID, this.props.SectionID);
        console.log('instructorVolunteerComponent update was called');
    }

    GlobalUpdate(){
      apiCall.get(`/SectionUsers/Volunteer/${this.props.UserID}/${this.props.SectionID}/${false}`, (err, res,body)=> {
        if(body.Message == 'Success'){
          this.setState({GlobalVolunteer: body.Volunteer});
          console.log(body.Volunteer);
        }
    });
    }

    openModal(){
      this.setState({open: true});
    }

    closeModal(){
      this.setState({open: false});
    }

    getQS(field) {
        let url = window.location.href;
        let regex = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
        let string = regex.exec(url);
        return string ? string[1] : null;
    }

    render() {
        let strings = {
          Assignment: 'Assignment',
          Status: 'Status',
          Volunteer: 'Volunteer?',
          NoTasks: 'There are no assignments to display',
          SelectText: 'Select a course/section',
          VolunteerSelected: 'Volunteer for selected assignments in this section',
          ViewText: 'View'
        };
        let {Tasks} = this.state;
        console.log(this.state.Tasks);

        return (
          <div>
          <button onClick={this.openModal.bind(this)}>{strings.ViewText}</button>
          <Modal open={this.state.open} onClose={this.closeModal.bind(this)}>
            <div className="section card-2 sectionTable">
                <h2 className="title">{this.props.FirstName.concat(' ').concat(this.props.LastName)}</h2><br />
                <div className="section-content" style={{minHeight: 150}}>
                    <a>{this.props.Email}</a>
                    <ToggleInstructorGlobalVolunteerComponent Status={this.state.GlobalVolunteer} UserID={this.props.UserID} SectionID={this.props.SectionID} Update={() => this.Update()}/>
                    {(this.state.GlobalVolunteer != 'Approved' && this.state.GlobalVolunteer != 'Pending' && this.state.GlobalVolunteer != 'Appointed') &&
                    (<div><a>{strings.VolunteerSelected}</a>
                      <TableComponent
                        data={Tasks}
                        style={{overflow: 'visible'}}
                        columns={[
                            {
                                Header: strings.Assignment,
                                accessor: (row) => row.DisplayName,
                                id: 'DisplayName',

                            },
                            {
                                Header: strings.Status,
                                accessor: (row) => row.AssignmentInstanceID,
                                Cell: (row) => <div>
                                <ToggleInstructorVolunteerComponent
                                      AssignmentInstanceID={row.original.AssignmentInstanceID}
                                      UserID={this.props.UserID}
                                      SectionID={this.props.SectionID}
                                      Volunteer={(row.original.Status == null) ? false : true}
                                      VolunteerPoolID={row.original.VolunteerPoolID}
                                      Update={() => this.Update()}
                                      Status={row.original.Status}
                                />
                                </div>,
                                maxWidth: 120,
                                id: 'AssignmentInstanceID'
                            },
                        ]}
                        noDataText={strings.NoTasks}

                    /></div>)}
                </div>
            </div>
            </Modal>
          </div>
        );
    }
}
export default InstructorVolunteerComponent;
