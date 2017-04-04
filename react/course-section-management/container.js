import React from 'react';
import request from 'request';
import Select from 'react-select';

class Container extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      organizations: [],
      //courses: null,
      //description:'',
      //selected_course: null,
      //semesters: [],
      //semesterId: '',
      //semester_name: '',
      //section_identifier:'',
      //start_date: '',
      //end_date: '',
      //submitted: null
    }
    this.strings = { 
      organization: "Organization",
      course: "Course",
      semester: "Semester",
      section: "Section",
      newOrganization: "New Organization",
      newCourse: "New Course",
      newSemester: "New Semester",
      newSection: "New Section",
      editOrganization: "Edit Organization",
      editCourse: "Edit Course",
      editSemester: "Edit Semester",
      editSection: "Edit Section",
      edit: "Edit",
      new: "New",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      add: "Add"
    }
  }


  onChangeOrganization(organization){
    this.setState({
      selected_organization: organization.value
    });

    const courseFetchOptions = {
        method: 'GET',
        uri: this.props.apiUrl + '/api/getOrganizationCourses/' + organization.value,
        json: true
    };

    request(courseFetchOptions, (err, res, body) => {
        let courseList = [];
        for (let course of body.Courses) {
            courseList.push({ value: course.CourseID, label: course.Number + ' – ' + course.Name });
        }
        this.setState({
            courses: courseList
        });
    });
  }

  onChangeCourse(course) {
    this.setState({
      selected_course: course.value
    });

    const semFetchOptions = {
        method: 'GET',
        uri: this.props.apiUrl + '/api/semester/',
        json: true
    };

    request(semFetchOptions, (err, res, body) => {
        let semList = [];
        for (let sem of body.Semesters) {
            semList.push({ value: sem.SemesterID, label: sem.Name });
        }
        this.setState({
            semesters: semList
        });
    });
  }

  onChangeSemester(semester) {
    this.setState({
      selected_semester: semester.value
    });

    const sectionFetchOptions = {
        method: 'GET',
        qs: {
          semesterID: semester.value
        },
        uri: this.props.apiUrl + '/api/getCourseSections/' + this.state.selected_course,
        json: true
    };

    request(sectionFetchOptions, (err, res, body) => {
        let sectionList = [];
        for (let section of body.Sections) {
            sectionList.push({ value: section.SectionID, label: section.Name });
        }
        this.setState({
            sections: sectionList
        });
    });
  }

  onChangeSection(section) {
    this.setState({
      selected_section: section
    });
  }

  componentWillMount(){

    const orgFetchOptions = {
        method: 'GET',
        uri: this.props.apiUrl + '/api/organization',
        json: true
    };

    request(orgFetchOptions, (err, res, body) => {
        let orgList = [];
        for (let org of body.Organization) {
            orgList.push({ value: org.OrganizationID, label: org.Name});
        }
        this.setState({
            organizations: orgList
        });
    });
  }

  render() {

    return (

      <div>
        <div className="section">
          <h2 className="title">{this.strings.organization}</h2>
          <button type="button">{this.strings.new}</button>
          <button type="button">{this.strings.edit}</button>
          <form className="section-content">
            <div>
              <Select options={this.state.organizations} value={this.state.selected_organization} onChange={this.onChangeOrganization.bind(this)} resetValue={''} clearable={true} searchable={true}/>
            </div>
          </form>
        </div>
        <div className="section add-section-details">
          <h2 className="title">{this.strings.course}</h2>
          <button type="button">{this.strings.new}</button>
          <button type="button">{this.strings.edit}</button>
          <form className="section-content">
            <div>
              <Select options={this.state.courses} value={this.state.selected_course} onChange={this.onChangeCourse.bind(this)} resetValue={''} clearable={true} searchable={true}/>
            </div>
          </form>
        </div>
        <div className="section">
          <h2 className="title">{this.strings.semester}</h2>
          <button type="button">{this.strings.new}</button>
          <button type="button">{this.strings.edit}</button>
          <form className="section-content">
            <div>
              <Select options={this.state.semesters} value={this.state.selected_semester} onChange={this.onChangeSemester.bind(this)} resetValue={''} clearable={true} searchable={true}/>
            </div>
          </form>
        </div>
        <div className="section add-section-details">
          <h2 className="title">{this.strings.section}</h2>
          <button type="button">{this.strings.new}</button>
          <button type="button">{this.strings.edit}</button>
          <form className="section-content">
            <div>
              <Select options={this.state.sections} value={this.state.selected_section} onChange={this.onChangeSection.bind(this)} resetValue={''} clearable={true} searchable={true}/>
            </div>
          </form>
        </div>
      </div>
    );
  }

}

export default Container;
