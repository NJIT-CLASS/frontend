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
            SectionListOn: this.props.SectionID,
        };
    }
    componentWillMount () {
      this.fetchTasks(this.props.UserID, this.props.SectionID);
      console.log('Instructor volunteer component user ID ', this.props.UserID);
    }

    fetchTasks(userId, sectionId){
        apiCall.get(`/VolunteerPool/${userId}/${sectionId}`, (err, res,body)=> {
          if(!body.Error){
                  this.setState({Tasks: body.Volunteers})
              }
      });
      this.GlobalUpdate();
    }

    Update() {
        this.fetchTasks(this.props.UserID, this.state.SectionListOn);
        console.log('instructorVolunteerComponent update was called');
    }

    toggleOnVolunteer(assignmentInstanceId, vpID){
        let postVars = {
            UserID: this.props.UserID,
            SectionID: this.state.SectionListOn,
            AssignmentInstanceID: assignmentInstanceId,
            VolunteerPoolID: vpID,
        };
        console.log(this.props.AssignmentInstanceID);
        let endpoint = '/VolunteerPool/add';

        apiCall.post(endpoint, postVars, (err, res, body) => {
            console.log(res, body);
            this.Update();
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

    toggleOffVolunteer(assignmentInstanceId, vpID){
        let postVars = {
            UserID: this.props.UserID,
            SectionID: this.state.SectionListOn,
            AssignmentInstanceID: assignmentInstanceId,
            VolunteerPoolID: vpID,
        };
        console.log(this.props.AssignmentInstanceID);
        let endpoint = '/VolunteerPool/deleteVolunteer';
        apiCall.post(endpoint, postVars, (err, res, body) => {
            console.log(res, body);
            this.Update();
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

    handleChangeAll(type) {
      for (let i of this.state.Tasks) {
        if (type = 'on') {
          this.toggleOnVolunteer(i.AssignmentInstanceID, i.vpID);
        }
        else {
          this.toggleOnVolunteer(i.AssignmentInstanceID, i.vpID);
        }
      }
    }

    GlobalUpdate(){
      apiCall.get(`/SectionUsers/Volunteer/${this.props.UserID}/${this.props.SectionID}`, (err, res,body)=> {
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
                <h2 className="title">{this.props.FirstName.concat(' ').concat(this.props.LastName)}</h2>
                <div className="section-content" style={{minHeight: 150}}>
                    <ToggleInstructorGlobalVolunteerComponent Status={this.state.GlobalVolunteer} UserID={this.props.UserID} SectionID={this.props.SectionID} Update={() => this.Update()}/>
                    {(this.state.GlobalVolunteer != 'Approved' && this.state.GlobalVolunteer != 'Pending' && this.state.GlobalVolunteer != 'Appointed') &&
                    (<div><a>{strings.VolunteerSelected}</a>
                      <TableComponent
                        data={Tasks}
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
                                      SectionID={this.state.SectionListOn}
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
