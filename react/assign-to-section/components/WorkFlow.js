import React from 'react';
var moment = require('moment');
import Dropdown from 'react-dropdown';
import Datetime from 'react-datetime';


class WorkFlow extends React.Component {
  constructor(props){
    super(props);
  }

render(){
  let CalendarView =  null;
  let StartNow = null;

  var today= Datetime.moment();
  var valid = function( current ){
    return current.isAfter( today );
  };

  if(this.props.WorkFlow.StartLater)
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
               onChange={this.props.onChangeCalendarWorkFlow.bind(this, this.props.workflowIndex)}
         />
       </div>
     )
  }

  return (
    <div className = "section">
    <h1 className = "title"> Tasks Start Time </h1>

      <div className = "section-content">
        <table table border="0" cellPadding="0" cellSpacing="0" className="tab">
          <tbody className="children">
            <tr className="children">
              <td className="children">
                <form>
                  <input type="radio" checked={this.props.WorkFlow.StartNow} onChange={this.props.onChangeStartNowWorkFlow.bind(this,this.props.workflowIndex)}
                    name="Days" value="Days">
                  </input>
                  <label> Start Now </label>
                </form>
              </td>
            </tr>

            <tr className="children">
              <td className="children">
                <form>
                  <input type="radio" checked={this.props.WorkFlow.StartLater} onChange={this.props.onChangeStartLaterWorkFlow.bind(this,this.props.workflowIndex)}
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
  export default WorkFlow;
