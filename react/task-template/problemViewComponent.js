/* This component will hold the user-made problem. It is shown during all stages after create-problem.
* It only makes one GET request to get the problem stored in the database.
*/
import React from 'react';
import request from 'request';

class ProblemViewComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      TaskActivityData:{
        field_titles:[]
      },
      TaskData:{}
    };
  }

  getComponentData(){
    const options = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/taskTemplate/create/' + this.props.TaskID,
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                TaskData: body.taskData,
                TaskActivityData:body.taskActivityData
            });
        });
  }

  componentWillMount(){
    this.getComponentData();
  }

  render(){
    let fields = this.state.TaskActivityData.field_titles.map(function(title, idx){

      if(this.state.TaskActivityData[title].input_type == "text"){
        let fieldView = (<div key={idx} className="regular-text"> {this.state.TaskData[title][0]}
      </div>);


        return (<div key={idx+200}>
          {fieldView}
          <br key={idx+500}/>
        </div>
        );

      }
    }, this);

      return (
        <div className="section animate fadeInDown">
          <h2 className="title">{this.props.problemHeader}:</h2>
          <div className="section-content">
            <div name="problem-text" className="regular-text">{fields}</div>
            <br />
          </div>
        </div>
    );

  }

}
export default ProblemViewComponent;
