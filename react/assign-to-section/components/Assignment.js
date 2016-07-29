/*  This Component collects the Assignment timing data. There should be only one per AssignToSectionContainer.
It gets its functions and data from its parent.
*/

import React from 'react'
var moment = require('moment');
import request from 'request';
import Dropdown from 'react-dropdown';
import Datetime from 'react-datetime';
var CheckBoxList = require('react-checkbox-list');

class Assignment extends React.Component {
  constructor(props){
    super(props);

    /*
      Props: (from AssignToSectionContainer)
            - Assignment
            - SectionsList
            - onChangeCalendarAssignment
            - onChangeStartLaterAssignment
            - onChangeStartNowAssignment
            - onChangeAssigmentName
            - onChangeSectionAssignment
    */
}



render(){
let CalendarView =  null;
let Section = [ //fake data
    {value:'cs280', label: 'CS280'},
    {value:'cs332', label: 'CS332'}
  ];
  var yesterday = Datetime.moment();
  var valid = function( current ){  //this function is used in Datetime to block out days before and including today
    return current.isAfter( yesterday );
  };


  if(this.props.Assignment.StartLater)
  {
    CalendarView =
    (
      <div style={{display: 'block', overflowX:'visible',overflow: 'visible',height: '400px'}}>
        <Datetime
              open={true}
              defaultValue={moment().add(3, 'days').format("MM/DD/YYYY")+(' 11:59 PM')}
              renderDay={this.renderDay} 
              renderMonth={this.renderMonth}
              renderYear={this.renderYear}
              isValidDate={ valid }
              onChange={this.props.onChangeCalendarAssignment.bind(this)}
        />
      </div>
    )
  }

  return (
    <div style={{height: 'fit-content'}} className = "section">
      <h1 className = "title"> Assignment Dates </h1>

      <div className = "section-content">
        <table border="0" cellPadding="0" cellSpacing="0" className="tab">
          <tbody className="children">
            <tr className="children">
              <td className="children">
                <h1> Assignment Name </h1>
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <form>
                  <input type="text" name="AssigmentName" value={this.props.Assignment.AssigmentName} onChange = {this.props.onChangeAssigmentName.bind(this)}>
                  </input>
                </form>
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <h1> Sections </h1>
              </td>
            </tr>

            <tr className="children" >
              <td className="children">
                <CheckBoxList ref="chkboxList" defaultData={this.props.SectionsList} style={{display:'block'}}
                  onChange = {this.props.onChangeSectionAssignment.bind(this)}
                />
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <form>
                  <input type="radio" checked={this.props.Assignment.StartNow} onChange={this.props.onChangeStartNowAssignment.bind(this)}
                    name="Days" value="Days">
                  </input>
                  <label> Start Now </label>
                </form>
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <form>
                  <input type="radio" checked={this.props.Assignment.StartLater}  onChange={this.props.onChangeStartLaterAssignment.bind(this)}
                    name="Days" value="Days">
                  </input>
                  <label> Start Later </label>
                  {CalendarView}
              </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
)
}
}
export default Assignment;
