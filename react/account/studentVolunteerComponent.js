import React, { Component } from 'react'; //import the React library and the Component class from the react package
import TableComponent from '../shared/tableComponent';
import Tooltip from '../shared/tooltip';
import apiCall from '../shared/apiCall';
import moment from 'moment';
import ToggleVolunteerComponent from './toggleVolunteerComponent';
import ToggleGlobalVolunteerComponent from './toggleGlobalVolunteerComponent';
import Select from 'react-select';

class StudentVolunteerComponent extends Component { //create a class for the component
    constructor(props) {
        super(props);
        this.state = {
            Tasks:[],
        };
    }
    componentWillMount () {
        this.fetchSections(this.props.UserID);
        this.setState({SectionListOn: this.getQS('section')});
    }

    fetchTasks(userId, sectionId){
        apiCall.get(`/VolunteerPool/${userId}/${sectionId}/${true}`, (err, res,body)=> {
          if(!body.Error){
                  this.setState({Tasks: body.Volunteers})
              }
      });
      this.GlobalUpdate();
    }

    fetchSections(userId){
      let sectionList = [];
        apiCall.get(`/getActiveEnrolledCourses/${userId}`, (err, res,body)=> {
          if(!body.Error){
            for (let i of body.Courses) {
                sectionList.push({label: i.Section.Course.Name.concat(' - ').concat(i.Section.Name), value: i.Section.SectionID});
            }
            this.setState({SectionList: sectionList, SectionListOn: sectionList[0].value});
            this.fetchTasks(this.props.UserID, sectionList[0].value);
          }
      });
    }

    handleChangeSection(event) {
        this.setState({SectionListOn: event.value});
        console.log(this.props.UserID, event.value);
        this.fetchTasks(this.props.UserID, event.value);
    }

    Update() {
        this.fetchTasks(this.props.UserID, this.state.SectionListOn);
    }

    toggleGlobalVolunteer(status){
      console.log('Global on', status);
      apiCall.post(`/sectionUsers/changeVolunteer/${this.props.UserID}/${this.state.SectionListOn}/${status}`, (err, res, body) => {
          if(res.statusCode === 201){
              this.setState({Volunteer: true});

          }
      });
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
            if(res.statusCode === 200){
                if(body){
                    let vpArray = this.state.VolunteerPoolID;
                    vpArray.push(body.VolunteerPoolID);
                    this.setState({
                        Volunteer: true,
                        VolunteerPoolID: vpArray,
                    });
                } else {
                    this.setState({
                        Volunteer: false,
                        VolunteerPoolID: -1
                    });
                }

            }
        });
        this.fetchTasks(this.props.UserID, this.state.SectionListOn);
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
        if (type = 'on') {
          this.toggleGlobalVolunteer('Pending');
        }
    }

    GlobalUpdate(){
      apiCall.get(`/SectionUsers/Volunteer/${this.props.UserID}/${this.state.SectionListOn}/${true}`, (err, res,body)=> {
        if(body.Message == 'Success'){
          this.setState({GlobalVolunteer: body.Volunteer});
          console.log(body.Volunteer);
        }
    });
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
          InstructorControlText: 'Instructor control'
        };
        let {Tasks} = this.state;
        console.log(this.state.Tasks);

        return (
            <div className="section card-2 sectionTable">
                {/*<h2 className="title">{Strings.CompletedTasks}</h2>
                <MainPageContainer />*/}
                <div className="section-content">

                    <Select
                        clearable={false} searchable={false}
                        options={this.state.SectionList} onChange={this.handleChangeSection.bind(this)}
                        value={this.state.SectionListOn}
                        placeholder={strings.SelectText + '...'}
                    />
                    {this.state.SectionListOn >= 0 && (<div><ToggleGlobalVolunteerComponent Volunteer={this.state.GlobalVolunteer} UserID={this.props.UserID} SectionID={this.state.SectionListOn} Update={() => this.Update()}/>
                    {(this.state.GlobalVolunteer == 0 || this.state.GlobalVolunteer == 'Removed' || this.state.GlobalVolunteer == 'Declined') && <TableComponent
                        data={Tasks}
                        columns={[
                            {
                                Header: strings.Assignment,
                                accessor: (row) => row.DisplayName,
                                id: 'DisplayName',

                            },
                            {
                                Header: strings.Volunteer,
                                accessor: (row) => row.AssignmentInstanceID,
                                Cell: (row) => (row.original.Status == 'Pending' || row.original.Status == null || row.original.Status == 0) ? <ToggleVolunteerComponent
                                      AssignmentInstanceID={row.original.AssignmentInstanceID}
                                      UserID={this.props.UserID}
                                      SectionID={this.state.SectionListOn}
                                      Volunteer={(row.original.Status == null) ? false : true}
                                      VolunteerPoolID={row.original.VolunteerPoolID}
                                      Update={() => this.Update()}
                                /> : <div>{strings.InstructorControlText}</div>,
                                maxWidth: 150,
                                id: 'AssignmentInstanceID'
                            },
                            {
                                Header: strings.Status,
                                accessor: (row) => row.Status,
                                id: 'Status',
                            }
                        ]}
                        noDataText={strings.NoTasks}

                    />}</div>)}
                </div>
            </div>
        );
    }
}
export default StudentVolunteerComponent;
