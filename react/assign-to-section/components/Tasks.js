/* This Component gets the timing input for the tasks. It is flexible enough to be used in a map or forEach.
* It gets its data and functions from AssignToSectionContainer
*/

import React from 'react';
import NumberField from '../../shared/numberField';
var moment = require('moment');
import Datetime from 'react-datetime';

class Tasks extends React.Component {
    constructor(props){
        super(props);

    /* Props: (from AssignToSectionContainer)
            - Tasks
            - index
            - workflowIndex
            -onChangeCalendarTasks
            -onChangeCertainTimeTasks
            -onChangeMultipleTasks
            -onChangeExpireNumberOfDaysTasks

    */
    }

    render(){
        let strings = this.props.Strings;
        let style={display: 'inline'};
        let CalendarView = null;
        let StartNow = null;

        var yesterday = Datetime.moment().subtract(1,'day');
        var valid = function( current ){
            return current.isAfter( yesterday );
        };

        if (this.props.Tasks.StartLater)
  {
            CalendarView =
    (
      <div style={{display: 'block', overflowX:'visible',overflow: 'visible',height: '400px'}}>
        <Datetime
              open={true}
              defaultValue={moment().add(3, 'days').format('MM/DD/YYYY')+(' 11:59 PM')}
              renderDay={this.renderDay}
              renderMonth={this.renderMonth}
              renderYear={this.renderYear}
              isValidDate={ valid }
              onChange={this.props.onChangeCalendarTasks.bind(this, this.props.index, this.props.workflowIndex)}
        />
      </div>
    );
        }

        if (this.props.Tasks.StartNow)
  {
            StartNow =
    (
      <div>
        <NumberField min={0} max={100} value= {this.props.Tasks.Time / 1440} onChange={this.props.onChangeMultipleTasks.bind(this,this.props.index, this.props.workflowIndex)}/>
        <h6 style={style}> Days </h6>
      </div>
    );
        }

        return (
    <div className = "section">
      <h1 className = "title"> {this.props.Tasks.Name} </h1>

      <div className = "section-content">
        <div className='inner'>
          <h6>{strings.WhenDue}</h6>
          <form>
            <input type="radio" checked={this.props.Tasks.StartNow} onChange={this.props.onChangeExpireNumberOfDaysTasks.bind(this,this.props.index, this.props.workflowIndex)}
              name="Days" value="Days">
            </input>
            <label>{strings.ExpireAfter}</label>
            {StartNow}
          </form>
        <div/>

        <div className='inner'>
          <form>
            <input type="radio" checked={this.props.Tasks.StartLater} onChange={this.props.onChangeCertainTimeTasks.bind(this,this.props.index, this.props.workflowIndex)}
              name="Days" value="Days">
            </input>
            <label>{strings.ExpireAt}</label>
            {CalendarView}
          </form>
        </div>
      </div>
    </div>
  </div>
        );
    }
}

export default Tasks;
