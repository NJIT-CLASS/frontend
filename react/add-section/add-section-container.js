import React from 'react';
import request from 'request';
import Select from 'react-select';
import {clone, cloneDeep} from 'lodash';
class AddSectionContainer extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        courses: null,
        selected_course: null,
        semesters: [],
        semesterId: '',
        semester_name: '',
        start_date: '',
        end_date: ''
      }
  }

  componentWillMount(){
    let courseArray = null
    const options = {
      method: 'GET',
      uri: this.props.apiUrl + '/api/getCourseCreated/' + this.props.userId, // get all course created
      json: true
    };

    request(options, (err, res, body) => {
      courseArray = body.Courses.map(function(course){
              return ({value: course.CourseID, label: course.Abbreviations + "-" + course.Number  + " (" + course.Name + ")" });
            });

      this.setState({
        courses: courseArray
      });
    });

    const semFetchOptions = { // get all semester
        method: 'GET',
        uri: this.props.apiUrl + '/api/semester',
        json: true
    };

    request(semFetchOptions, (err, res, body) => {
        let semList = [];
        for (let sem of body.Semesters) {
            semList.push({ value: sem.SemesterID, label: sem.Name});
        }
        this.setState({
            semesters: semList
        });
    });


  }

  onChangeCourse(course){
    this.setState({selected_course: course.value});
  }

  onSemesterChange(sem){
    this.setState({semesterId: sem.value});
  }

  onChangeSemesterName(name){
    this.setState({semester_name: name.value});
  }

  onChangeStartDate(start){
    this.setState({start_date: start.value});
  }

  onChangeEndDate(end){
    this.setState({end_date: end.value});
  }

  render() {

      let semestersList = clone(this.state.semesters);      // using lodash here
      semestersList.push({ value: "create", label: 'Create new semester...' });


      let createSection = null;
      if (this.state.selected_course != null){
        createSection = (
          <div>
            <label>Section Identifier</label>
            <div>
            <input type="text"></input>
            </div>
            <label>Semester</label>
            <div>
            <Select options={semestersList} value={this.state.semesterId} onChange={this.onSemesterChange.bind(this)} searchable={false}/>
            </div>
          </div>
        );
      }


      let createSemester = null;
      if (this.state.semesterId == 'create'){
        createSemester = (
          <div>
            <label>Semester Name</label>
            <div>
                <input
                  type="text"
                  value={this.state.semester_name}
                  onChange={this.onChangeSemesterName.bind(this)}/>
            </div>
            <label>Start Date</label>
            <div>
                <input
                  type="date"
                  value={this.state.start_date}
                  onChange={this.onChangeStartDate.bind(this)}
                  />
            </div>
            <label>End Date</label>
            <div className="col-sm-10">
                <input
                  type="date"
                  value={this.state.end_date}
                  onChange={this.onChangeEndDate.bind(this)}/>
            </div>
          </div>
        );
      }




      //alert(this.state.courses);
      return(
        <div className="section add-section-details">
            <h2 className="title">Select Course</h2>
            <form className="section-content">
            <label>Course</label>
            <div>
              <Select options={this.state.courses} value={this.state.selected_course} onChange={this.onChangeCourse.bind(this)} searchable={false}/>
              { createSection }
              { createSemester }
              <button>Submit</button>
            </div>
            </form>
        </div>

      );
  }

}


export default AddSectionContainer;
