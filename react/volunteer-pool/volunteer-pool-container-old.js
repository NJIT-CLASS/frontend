/*import React, {Component} from "react";
import Checkbox from '../shared/checkbox';
import ToggleSwitch from '../shared/toggleSwitch';


class VolunteerPool extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange(value) {
    this.setState({value: value});
  };


  render() {



    return (
      <div className="Page_header">Volunteer Pool Page</div>
      <div className="toggleToggle"><ToggleSwitch /></div>
      <Checkbox isClicked=false click={this.props.onChangeSectionAssignment.bind(this, section.value)}/>
    );
  }
}

export default VolunteerPool; */

import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import request from 'request';
import ToggleSwitch from '../shared/toggleSwitch';
import _ from 'lodash';
import ReactTable from 'react-table';

class VolunteerPool extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.state = {
      allChecked: false,
      checkedCount: 0,
      data: [{
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },{
        name: 'Jason Maurer',
        age: 23,
        friend: {
          name: 'Tanner Linsley',
          age: 26,
        }
      }],
      data2: [{
        name: 'Tanner Linsley',
        age: 26,
        friend: {
          name: 'Jason Maurer',
          age: 23,
        }
      },{
        name: 'Jason Maurer',
        age: 23,
        friend: {
          name: 'Tanner Linsley',
          age: 26,
        }
      }],
      options: [
        { value: 'selectAll', text: 'Select All' },
        { value: 'orange', text: 'Orange' },
        { value: 'apple', text: 'Apple' },
        { value: 'grape', text: 'Grape' }
      ],
      columns: [{
        header: 'Student Name',
        accessor: 'name' // String-based value accessors!
      }, {
        header: 'All',
        accessor: 'all',
        render: props => <span className='number'>{props.value}</span> // Custom cell components!
      }, {
        id: 'friendName',
        header: 'Friend Name',
        accessor: 'user.User.UserName' // Custom value accessors!
      }, {
        header: props => <span>Friend Age</span>, // Custom header components!
        accessor: 'friend.age'
      }],
      columns2: [{
        header: 'Student Name',
        accessor: 'name' // String-based value accessors!
      }, {
        header: 'All',
        accessor: 'all',
        render: props => <span className='number'>{props.value}</span> // Custom cell components!
      }, {
        id: 'friendName',
        header: 'Friend Name',
        accessor: 'user.User.UserName' // Custom value accessors!
      }, {
        header: props => <span>Friend Age</span>, // Custom header components!
        accessor: 'friend.age'
      }]


    };
    console.log("Props:", props);
  }


  componentWillMount(){
  const assignmentRequestOptions = {
    method: 'GET',
    uri: this.props.apiUrl + '/api/AssignmentsBySection/' + this.props.sectionID, // get all assignments in section
//    uri: 'http://localhost:4000/api/getAssignments/2', // get all assignments in section
    json: true
  };
  const volunteerpoolRequestOptions = {
    method: 'GET',
    uri: this.props.apiUrl + '/api/VolunteerPool/VolunteersInSection/' + this.props.sectionID, // get all volunteers in section
    json: true
  };

  request(assignmentRequestOptions, (err, res, body) => {
    let assignmentArray = [];
    let columnsArray = [];
        assignmentArray = body.Assignments.map(function(assignment){
            return ({value: assignment.AssignmentInstanceID, text: assignment.Assignment.DisplayName  });
          });
          assignmentArray.unshift({ value: 'selectAll', text: 'Select All' });

          columnsArray = body.Assignments.map(function(assignment){
            return ({id: assignment.AssignmentInstanceID, header: assignment.Assignment.DisplayName , accessor: 'assignments.AssignmentInstanceID'  });
/*              return ({id: assignment.AssignmentInstanceID, header: assignment.Assignment.DisplayName , accessor: 'AID_' + assignment.AssignmentInstanceID  });
*/            });
            columnsArray.unshift({ id: 'user', header: 'Student Name', accessor: 'assignments.User.UserName' },{ id: 'all', header: 'Select All', accessor: 'selectAll' });


/*        assignmentArray = body.Assignments.map(function(assignment){
            return ({value: assignment.AssignmentID, text: assignment.DisplayName  });
          });
          assignmentArray.unshift({ value: 'selectAll', text: 'Select All' });
*/


  request(volunteerpoolRequestOptions, (err, res, poolBody) => {
    let volunteersArray = [];
    let volunteerData = poolBody.Volunteers;

    var volunteersArray1 = _.chain(volunteerData)
    .groupBy("UserID")
    .toPairs()
    .map(function(currentItem) {
        return _.zipObject(["UserID", "assignments"], currentItem);
    })
    .value();

    volunteerObject = JSON.parse(volunteersArray1);

console.log(volunteersArray1);


    volunteersArray = poolBody.Volunteers.map(function(volunteer){
      let assignmentsVolunteered = [];
      let AID = 'AID_' + volunteer.AssignmentInstance.AssignmentInstanceID;
        return ({userName: volunteer.User.UserName , [AID]: 'true' });
      });



      this.setState({
        options: assignmentArray,
        columns: columnsArray,
        assignmentData: body,
        data1: volunteersArray1,
        data2: volunteersArray,
        poolData: poolBody
      });
    });

  });

}
  handleClick(e) {
    let clickedValue = e.target.value;

    if (clickedValue === 'selectAll' && ReactDOM.findDOMNode(this.refs.selectAll).checked) {
      for (let i = 1; i < this.state.options.length; i++) {
        let value = this.state.options[i].value;
        ReactDOM.findDOMNode(this.refs[value]).checked = true;
      }
      this.setState({
        checkedCount: this.state.options.length - 1
      });

    } else if (clickedValue === 'selectAll' && !ReactDOM.findDOMNode(this.refs.selectAll).checked) {
      for (let i = 1; i < this.state.options.length; i++) {
        let value = this.state.options[i].value;
        ReactDOM.findDOMNode(this.refs[value]).checked = false;
      }
      this.setState({
        checkedCount: 0
      });
    }

    if (clickedValue !== 'selectAll' && ReactDOM.findDOMNode(this.refs[clickedValue]).checked) {
      this.setState({
        checkedCount: this.state.checkedCount + 1
      });
    } else if (clickedValue !== 'selectAll' && !ReactDOM.findDOMNode(this.refs[clickedValue]).checked) {
      this.setState({
        checkedCount: this.state.checkedCount - 1
      });
    }
  }
  //        <ToggleSwitch isClicked={true} click={this.handleClick}/>

  render() {
    const userRole = this.props.userRole;

    if(userRole != 'Instructor') {
      console.log('Selected boxes: ', this.state.checkedCount);
      const options = this.state.options.map(option => {
        return (
          <li key={option.value}><input onClick={this.handleClick} type='checkbox' name={option.value} key={option.value}
                 value={option.value} ref={option.value} /> {option.text}</li>
        );
      });


      return (
        <div className='SelectBox'>
          <form>
            <ul>
              {options}
            </ul>
          </form>
        </div>
      );
    }



    const columns = this.state.columns;

    const totalRecords = this.state.data.length;
    return(
  <div>
      <ReactTable
      data={this.state.data1}
      showPagination={false}
      defaultPageSize={totalRecords}
      columns={columns}
    />
  </div>
    );
  }
}

export default VolunteerPool;
