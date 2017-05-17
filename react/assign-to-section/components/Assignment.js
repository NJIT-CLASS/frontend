/*  This Component collects the Assignment timing data. There should be only one per AssignToSectionContainer.
It gets its functions and data from its parent.
*/

import React from 'react';
var moment = require('moment');
import request from 'request';
import Checkbox from '../../shared/checkbox';
import Select from 'react-select';
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

    isSectionChecked(sectionID){
        if(this.props.Assignment.Section.indexOf(sectionID) == -1){//not in the list
            return false;
        }
        else{
            return true;
        }
    }

    render(){
        let CalendarView =  null;
        let strings = this.props.Strings;
        var yesterday = Datetime.moment();
        var valid = function( current ){  //this function is used in Datetime to block out days before and including today
            return current.isAfter( yesterday );
        };

        let semesterView = (<div className="inner">
          <label>{strings.Semester}</label>
          <Select
            options={this.props.Semesters}
            value={this.props.Assignment.Semester}
            onChange={this.props.onChangeSemesterAssignment.bind(this)}
            clearable={false}
            searchable={false}
            />
        </div>
      );

        if(this.props.Assignment.StartLater)
  {
            CalendarView =
    (
      <div style={{display: 'block', height: '400px'}}>
        <Datetime
              open={true}
              defaultValue={moment().add(3, 'days').format('MM/DD/YYYY')+(' 11:59 PM')}
              renderDay={this.renderDay}
              renderMonth={this.renderMonth}
              renderYear={this.renderYear}
              isValidDate={ valid }
              onChange={this.props.onChangeCalendarAssignment.bind(this)}
        />
      </div>
    );
        }

        let checkBoxList = this.props.SectionsList.map((section)=>{
            return(<div style={{display: 'inline-block'}}>
      <label>{section.label}</label> <Checkbox isClicked={this.isSectionChecked(section.value)} click={this.props.onChangeSectionAssignment.bind(this, section.value)}/>
    </div>);
        });

        return (
    <div style={{width:'fit-content',height: 'fit-content'}} className = "section">
      <h1 className = "title">{this.props.Assignment.AssigmentName}</h1>
      <div className = "section-content">
        <table border="0" cellPadding="0" cellSpacing="0" className="tab">
          <tbody className="children">
            {/*<tr className="children">
              <td className="children">
                <form>
                  <input type="text" name="AssigmentName" value={this.props.Assignment.AssigmentName} onChange = {this.props.onChangeAssigmentName.bind(this)}>
                  </input>
                </form>
              </td>
            </tr>*/}

            <tr className="children">
              <td className="children">
                {semesterView}
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <h1> Sections </h1>
              </td>
            </tr>

            <tr className="children" >
              <td className="children">

                {checkBoxList}
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <form>
                  <input type="radio" checked={this.props.Assignment.StartNow} onChange={this.props.onChangeStartNowAssignment.bind(this)}
                    name="Days" value="Days">
                  </input>
                  <label>{strings.StartNow}</label>
                </form>
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <form>
                  <input type="radio" checked={this.props.Assignment.StartLater}  onChange={this.props.onChangeStartLaterAssignment.bind(this)}
                    name="Days" value="Days">
                  </input>
                  <label>{strings.StartLater}</label>
                  {CalendarView}
              </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
        );
    }
}
export default Assignment;
