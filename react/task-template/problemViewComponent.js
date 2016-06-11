/* This component will hold the user-made problem. It is shown during all stages after create-problem.
* It only makes one GET request to get the problem stored in the database.
*/
import React from 'react';
import request from 'request';

import ErrorComponent from './errorComponent';

class ProblemViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      ShowContent: true,
      TaskData:{},
      TaskActivityFields:{},
      Error: false
    };
  }

  toggleContent(){
    const bool = this.state.ShowContent ? false : true;

    this.setState({
      ShowContent: bool
    });
  }
  componentWillMount(){
    let tdata = this.props.TaskData;
    let tAdata = this.props.TaskActivityFields;
    if(!tdata || tdata == "{}" || !tAdata || tAdata == "{}" || Object.keys(tdata).length === 0 && tdata.constructor === Object ){
      console.log("ERR");
      this.setState({Error: true});
      return ;
    }
    else {
      if(tdata.constructor !== Object){
        tdata = JSON.parse(this.props.TaskData)
      }
      if(tAdata.constructor !== Object){
        tAdata = JSON.parse(this.props.TaskActivityFields)
      }

      tAdata.field_titles.forEach(function(title){
        if(tdata[title] == null){
          this.setState({Error: true});
          return;
        }
      },this);

      this.setState({
        TaskData: tdata,
        TaskActivityFields: tAdata
      });
    }
  }


  render(){
    let content = null;

    if(this.state.Error){
        return(<ErrorComponent />);
    }

    let fields = this.state.TaskActivityFields.field_titles.map(function(title, idx){

      let justification = null;
      let fieldTitle = '';
      console.log(this.state.TaskActivityFields[title]);
      if(this.state.TaskActivityFields[title].show_title){
        if(this.state.TaskActivityFields[title].grade_type != null){
          fieldTitle = title +" Grade";
        }
        else{
          fieldTitle = title;
        }
      }
      if(this.state.TaskActivityFields[title].requires_justification){
        console.log(this.state.TaskActivityFields[title]);
        if(this.state.TaskData[title][1] == ''){
          justification = (<div></div>);
        }
        else{
          justification = (<div className="faded-big">{this.state.TaskData[title][1]}</div>)
        }
      }

      if(this.state.TaskActivityFields[title].input_type == "text"){
        let fieldView = (<div>
          <div key={idx + 600}><b>{fieldTitle}</b></div>
          <div key={idx} className="faded-big"> {this.state.TaskData[title][0]}
          </div>
          <br />
          {justification}
        </div>);


        return (<div key={idx+200}>
          {fieldView}
          <br key={idx+500}/>
        </div>
        );

      }
      else if(this.props.TaskActivityFields[title].input_type == "numeric"){
        let fieldView = (<div>
          <div key={idx + 600}><b>{fieldTitle}</b></div>
          <div key={idx} className="faded-small"> {this.state.TaskData[title][0]}
          </div>
          <br />
          {justification}
        </div>);


        return (<div key={idx+200}>
          {fieldView}
          <br key={idx+500}/>
        </div>
        );

      }
      else{
        return (<div></div>);
      }

    }, this);



      if(this.state.ShowContent){
        content = (<div className="section-content">
                      <div name="problem-text" className="regular-text">{fields}</div>
                      <br />
                    </div>);
      }
      else{
        content=(<div></div>);
      }

      return (
        <div className="task-section animate fadeInDown">
          <h2 className="title" onClick={this.toggleContent.bind(this)}>{this.props.problemHeader}:</h2>
            {content}
        </div>
    );

  }

}
export default ProblemViewComponent;
