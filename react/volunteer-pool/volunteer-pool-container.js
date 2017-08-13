import React, { Component } from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import request from 'request';
import _ from 'lodash';
import ReactTable from 'react-table';
import TableCell from './tableCellComponent';
import CustomRender from '../shared/CustomRender';

class VolunteerPool extends Component {
    constructor(props) {
      super(props);

      this.handleClick = this.handleClick.bind(this);
      this.state = {
        allChecked: false,
        checkedCount: 0,
        sectionUsers: [],
        volunteerData: [],
        isLoaded: false,
        options: [
      ]
    };
  }

  // commponentWillRecieveProps(nextProps){
  //
  //
  // }
  //
  // shouldComponentUpdate(nextProps, nextState){
  //   console.log(this.props.sectionID === nextProps.sectionID)
  //   if(this.props.sectionID === nextProps.sectionID)
  //     return(false);
  //     else {
  //       return(true);
  //     }
  // }
    componentWillMount(){
      this.updateData(this.props);

  }

    componentWillReceiveProps(nextProps){
      this.updateData(nextProps);

  }

    selectRenderValue(option) {
      return <span><strong style={{ color: option.color }}>&#x25cf;</strong>{option.label}</span>;
  }

    changeSelectedStatus(selectedStatusValue){
      console.log('selectedStatusValue: ',selectedStatusValue);
      console.log('this: ',this);
      var getIndex = -1;
      this.state.data.forEach((object) => {
      //  if(object.User.UserID === selectedStatusValue.Status.Row.USerID && object.User. === selectedStatusValue.User.USerID)
    });
      this.setState({ });
  }

    updateData(nextProps){

      console.log('Called commponentWillReceiveProps');
      const sectionUserRequestOptions = {
        method: 'GET',
        uri: this.props.apiUrl + '/api/course/getsection/' + nextProps.sectionID, // get all assignments in section
        json: true
    };
      const assignmentRequestOptions = {
      method: 'GET',
      uri: this.props.apiUrl + '/api/AssignmentsBySection/' + nextProps.sectionID, // get all assignments in section
      json: true
  };
      const volunteerpoolRequestOptions = {
      method: 'GET',
      uri: this.props.apiUrl + '/api/VolunteerPool/VolunteersInSection/' + nextProps.sectionID, // get all volunteers in section
      json: true
  };

      var x = this;
      var userArray = [];
      var volunteersArray = [];
      var assignmentArray = [];
      var columnsArray = [];
      var volunteerData = [];
      var poolTableData = [];
      var statusOptions = [
        			{ label: ' Rejected', value: 'Rejected', color: '#ff2e00' },
        			{ label: ' Pending', value: 'Pending', color: '#ffbf00' },
        			{ label: ' Approved', value: 'Approved', color: '#57d500' },
              { label: ' Instructor Assigned', value: 'Assigned', color: '#002eff' }
  ];



      request(sectionUserRequestOptions, (sectErr, sectRes, sectBody) => {
      console.log('sectionUsersData: ' , sectBody);

      let userObject = {};
      sectBody.UserSection.forEach(function(sectUser){
            console.log(sectUser.UserID, sectUser.UserRole === 'Student' && sectUser.UserStatus === 'Active');
            if(sectUser.UserRole === 'Student' && sectUser.UserStatus === 'Active'){

              userObject[sectUser.UserID] = sectUser;
          }
        });
      request(assignmentRequestOptions, (err, res, body) => {

              assignmentArray = body.Assignments.map(function(assignment){
                    return ({value: assignment.AssignmentInstanceID, text: assignment.Assignment.DisplayName  });
                });
              assignmentArray.unshift({ value: 'selectAll', text: 'Select All' });
              console.log('AssignmentData: ' , body);

              columnsArray = body.Assignments.map(function(assignment){
                      var cellName= '_'+assignment.AssignmentInstanceID;
                      return ({id: assignment.AssignmentInstanceID, header: assignment.Assignment.DisplayName , accessor: 'assignments.AID_' + assignment.AssignmentInstanceID + '.status', minWidth: '200px',maxWidth: '250px' , render: row =>(<TableCell nameEnd={cellName} changeSelectedStatus={x.changeSelectedStatus.bind(x)} renderValue={x.selectRenderValue(statusOptions)} options={statusOptions} status={row} />)});
                  });
              columnsArray.unshift({ id: 'user', header: 'Student Name', accessor: 'UserName', minWidth: '200px',maxWidth: '250px' },{ id: 'all', header: 'Select All', accessor: 'selectAll', minWidth: '200px',maxWidth: '250px' });

              request(volunteerpoolRequestOptions, (err, res, poolBody) => {
                        console.log('volunteerData: ' , poolBody);

                        let volunteerDataObject = _.groupBy(poolBody.Volunteers,'UserID');


                 //          poolBody.Volunteers.forEach(function(volunteer){
                 //
                 //           volunteerDataObject[volunteer.UserID] = volunteer;
                 //            });
                        console.log(volunteerDataObject);


                 //       volunteerData = poolBody.Volunteers;
                 // console.log("VolunteerData: ", poolBody);
                 //       var volunteersArray1 = _.chain(volunteerData)
                 //       .groupBy("UserID")
                 //       .toPairs()
                 //       .map(function(currentItem) {
                 //           return _.zipObject(["UserID", "assignments"], currentItem);
                 //       })
                 //       .value();
                 //
                 //
                 //   console.log(volunteerData);
                 //
                 //
                 //       volunteersArray = poolBody.Volunteers.map(function(volunteer){
                 //         let assignmentsVolunteered = [];
                 //         let AID = 'AID_' + volunteer.AssignmentInstanceID;
                 //           return ({userName: volunteer.UserID , [AID]: 'true' });
                 //         });

                        this.setState({
                     options: assignmentArray,
                     columns: columnsArray,
                     assignmentData: assignmentArray,
                     assignmentBody: body,
                     volunteerData: poolBody.Volunteers,
                     poolData: poolBody,
                     sectionUsers: userObject,
                     userData: sectBody
                 });

                        poolTableData = Object.keys(this.state.sectionUsers).map(function(key){
                let user = this.state.sectionUsers[key];
                let tempRowObject = {};
                console.log(user);
                tempRowObject.UserID = user.UserID;
                tempRowObject.UserName = user.User.UserName;
                tempRowObject.UserRole = user.UserRole;
                tempRowObject.UserStatus = user.UserStatus;
                console.log(tempRowObject);

                let tempObj = new Object();

                this.state.columns.filter(function(column){
                       return(_.isNumber(column.id));
                   }).forEach(function(assignmentColumn){
                       tempObj['AID_' + assignmentColumn.id] = {AssignmentInstanceID: assignmentColumn.id, UserID: tempRowObject.UserID,status: '' };
                   });

                this.state.volunteerData.filter(function(obj){
                       return (obj.UserID === tempRowObject.UserID);
                   }).forEach(function(obj){
                       tempObj['AID_' + obj.AssignmentInstanceID] = obj;
                   });

                tempRowObject.assignments = tempObj;
                  //  tempRowObject.assignments2 = this.state.volunteerData[user.UserID].map(function(ai){
                  //    let AID = 'AID_' + ai.AssignmentInstanceID;
                  //    return ([AID]: ai);
                  //  });
                console.log(tempRowObject);
                return (tempRowObject);
            }, this);

                        console.log(this.state.sectionUsers);
                        console.log(this.state.volunteerData);
                        console.log('poolData: ',poolTableData);

                        this.setState({
                     data: poolTableData,
                     isLoaded: true
                 });

                        //  this.setState({
                        //    volunteerData: poolBody.Volunteers,
                        //    poolData: poolBody
                        //  });

                    });

                    //  this.setState({
                    //    options: assignmentArray,
                    //   columns: columnsArray,
                    //   assignmentData: assignmentArray,
                    //   assignmentBody: body
                    // });
          });



          // this.setState({
          //   sectionUsers: userObject,
          //   userData: sectBody
          // });
  });


//      poolTableData = _.merge(this.state.sectionUsers, this.state.volunteerData);




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
<div>
        <CustomRender label="Custom Render Methods"/>
        <div className='SelectBox'>
          <form>
            <ul>
              {options}
            </ul>
          </form>
        </div>
</div>
      );
    }

      if(!this.state.isLoaded){
        return <div></div>;
    }


      const columns = this.state.columns;
      var totalRecords = this.state.data.length;
      return(
  <div>
    <CustomRender label="Custom Render Methods"/>
      <ReactTable
      data={this.state.data}
      showPagination={false}
      defaultPageSize={10}
      min={1}
      pageSize={totalRecords}
      columns={columns}
    />
  </div>
    );
  }
}

export default VolunteerPool;
