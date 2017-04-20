import React from 'react';
import request from 'request';
import Select from 'react-select';
import {clone} from 'lodash';
class CourseDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courseName: props.courseName,
            courseNumber: props.courseNumber,
            courseAbb: props.courseAbb,
            courseDescription: props.courseDescription,
            organization_value: '',
            organization: [],
            change_organization_name: '',
            tmp_organization: '',
            courseNameError: false,
            courseNumberError: false,
            organizationNameError: false
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            courseName: nextProps.courseName,
            courseNumber: nextProps.courseNumber,
            organization_name: nextProps.organization_name,
            courseAbb: nextProps.courseAbb,
            courseDescription: nextProps.courseDescription
        });
    }
    onCourseNameChange(e) {
        this.setState({courseName: e.target.value});
    }

    onCourseNumberChange(e) {
        this.setState({courseNumber: e.target.value});
    }

    onCourseAbbChange(abb){
        this.setState({courseAbb: abb.target.value});
    }

    onCourseDescriptionChange(desc){
        this.setState({courseDescription: desc.target.value});
    }

    onOrganizationChange(org) {
        this.setState({organization_value: org.value});
    }
    onCreateOrganizationChange(changeOrg) {
        this.setState({change_organization_name: changeOrg.target.value});
    }


    createCourse(e) {
        e.preventDefault();
        const courseName = this.state.courseName;
        const courseNumber = this.state.courseNumber;
        const courseAbb = this.state.courseAbb;
        const courseDescription = this.state.courseDescription;
        const courseNameError = courseName.length === 0 ? true : false;
        const courseNumberError = courseNumber.length === 0 ? true : false;
        if (courseNameError || courseNumberError) {
            return this.setState({
                courseNameError: courseNameError,
                courseNumberError: courseNumberError
            });
        } else {
            this.setState({
                courseNameError: false,
                courseNumberError: false
            });
        }
        //alert(this.props.userId + " " + this.state.change_organization_name);
        if (this.state.organization_value ==  'create'){
            const org_options = {
                method: 'POST',
                uri: this.props.apiUrl +'/api/createorganization', // hard coded
                body: {
                    userid: this.props.userId,
                    organizationname: this.state.change_organization_name
                },
                json: true
            };
            request(org_options, (err, res, body) => {

                const res_organization = body.neworganization;
                if(body.org_feedback){
                    this.props.createCourse(courseName, courseNumber, courseAbb, courseDescription, res_organization.OrganizationID);
                } else {
                    this.setState({organizationNameError: body.org_feedback});
                }
            });
        } else {
            this.props.createCourse(courseName, courseNumber, courseAbb, courseDescription, this.state.organization_value);
        }
    }


    //This will get all the organization
    componentWillMount(){
        const orgFetchOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/organization', // hard coded
            json: true
        };

        request(orgFetchOptions, (err, res, body) => {
            let orgList = [];
            for (let org of body.Organization) {
                orgList.push({ value: org.OrganizationID, label: org.Name});
            }
            this.setState({
                organization: orgList
            });
        });
    }

    render() {
        let orgnaizationList = clone(this.state.organization);      // using lodash here
        orgnaizationList.push({ value: 'create', label: 'Create new organization...' });  // create new organization
        let createCourseButtonEl = null;
        //alert(!this.props.courseId + " " + typeof(this.props.courseId));
        if (!this.props.courseId) {
            createCourseButtonEl = (
                <div className="row">
                    <button type="submit">Create Course</button>
                </div>
            );
        }
        else {
            createCourseButtonEl = (
                <div className="row">
                    <button type="submit" className="success" disabled>
                        <i className="fa fa-check"></i>
                        Course Created
                    </button>
                </div>
            );
        }


        let organizationEl = null;
        if (this.state.organization_value == 'create') { // if create, new field for organization name
            organizationEl = (
              <div><p>Organization Name</p>
              <input
                    type="text"
                    value={this.state.change_organization_name}
                    onChange={this.onCreateOrganizationChange.bind(this)}
                />
                </div>
            );
        }

      /*  let errorDisplay = null;
        if(!this.props.displayMessage){
          errorDisplay = null
          }else {
            errorDisplay = (<div className="error form-error" role="alert">
                    <i className="fa fa-exclamation-circle"></i>
                      <span className="sr-only"> Error: Course already exist, please try again </span>
                    </div>);
          }*/

        return (

            <div className="section">
              <h2 className="title">Course Details</h2>
              <form className="section-content" onSubmit={this.createCourse.bind(this)}>

                <label>Title</label>
                <div>
                  <input
                    type="text"
                    value={this.state.courseName}
                    onChange={this.onCourseNameChange.bind(this)}
                    className={ this.state.courseNameError ? 'error' : '' }
                  />
                </div>
                {/*<label>Abbreviation</label>
                  <div>
                  <input
                    type="text"
                    value={this.state.courseAbb}
                    onChange={this.onCourseAbbChange.bind(this)}
                  />
                </div>*/}
                <label>Course Number</label>
                    <div>
                        <input
                            type="text"
                            value={this.state.courseNumber}
                            onChange={this.onCourseNumberChange.bind(this)}
                            className={ this.state.courseNumberError ? 'error' : '' }
                        />
                    </div>
                    <label>Description</label>
                    <div>
                        <textarea
                          value={this.state.courseDescription}
                          onChange={this.onCourseDescriptionChange.bind(this)}>
                        </textarea>
                    </div>
                    <label>Organization</label>
                    <div>
                    <Select options={orgnaizationList} value={this.state.organization_value} onChange={this.onOrganizationChange.bind(this)}
                    />
                    </div>
                    { organizationEl }
                    { createCourseButtonEl }
                </form>
            </div>
        );
    }
}

CourseDetails.defaultProps = {
    courseName: '',
    courseNumber: '',
    organization_name: ''
};

export default CourseDetails;
