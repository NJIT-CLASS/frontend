/* This component will hold the user-made problem. It is shown during all stages after create-problem.
* It only makes one GET request to get the problem stored in the database.
*/
import React from 'react';
import request from 'request';
import Rater from 'react-rater';
import ErrorComponent from './errorComponent';
/**** PROPS:
    TaskData,
    TaskActivityFields,
    ComponentTitle


*/




class SuperViewComponent extends React.Component {
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


      for(let i = 0; i< tAdata.number_of_fields;i++){
        if(tdata[i] == null){
          this.setState({Error: true});
          return;
        }
      }
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
      console.log(this.state.TaskActivityFields[idx]);
      if(this.state.TaskActivityFields[idx].show_title){
        if(this.state.TaskActivityFields[idx].grade_type != null){
          fieldTitle = title +" Grade";
        }
        else{
          fieldTitle = title;
        }
      }
      if(this.state.TaskActivityFields[idx].requires_justification){
        console.log(this.state.TaskActivityFields[idx]);
        if(this.state.TaskData[idx][1] == ''){
          justification = (<div></div>);
        }
        else{
          justification = (<div className="faded-big">{this.state.TaskData[idx][1]}</div>)
        }
      }

      if(this.state.TaskActivityFields[idx].input_type == "text"){
        let fieldView = (<div>
          <div key={idx + 600}><b>{fieldTitle}</b></div>
          <div key={idx} className="faded-big"> {this.state.TaskData[idx][0]}
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
      else if(this.props.TaskActivityFields[idx].input_type == "numeric"){
        if(this.state.TaskActivityFields[idx].grade_type == "grade"){
          let fieldView = (<div>
            <div key={idx + 600}><b>{fieldTitle}</b></div>
            <div key={idx} className="faded-small"> {this.state.TaskData[idx][0]}
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
        else if(this.state.TaskActivityFields[idx].grade_type == "rating"){
          let val = (this.state.TaskData[idx][0] == null || this.state.TaskData[idx][0] == '') ? 0 : this.state.TaskData[idx][0];
          let fieldView = (<div>
            <div key={idx + 600}><b>{fieldTitle}   </b>
               <Rater total={this.state.TaskActivityFields[idx].rating_max} rating={val} interactive={false} />
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
        <div className="section task-hiding animate fadeInDown">
          <h2 className="title" onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}:</h2>
            {content}
        </div>
    );

  }

}
export default SuperViewComponent;
