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
      // this checks to make sure all the necessary data isn't empty. If it is, it will cause errors, so set the Error state to true
      // to prevent rendering
      this.setState({Error: true});
      return ;
    }
    else {
      if(tdata.constructor !== Object){ //if the TaskData is not an object, it mut be a JSON, so parse it before continuing
        tdata = JSON.parse(this.props.TaskData)
      }
      if(tAdata.constructor !== Object){
        tAdata = JSON.parse(this.props.TaskActivityFields)
      }


      for(let i = 0; i< tAdata.number_of_fields;i++){
        if(tdata[i] == null){       //make sure that the number of fields in the Task matches the number of fields in the Task activity
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

    if(this.state.Error){ // if there was an error loading the data, show an Error component
        return(<ErrorComponent />);
    }
    let fields = this.state.TaskActivityFields.field_titles.map(function(title, idx){ //go over the fields and display the data appropriately
      // this is a bunch of conditionals that check the fields in the TA fields object.
      // NOTE: Add better indexes to the divs and inputs so React won't give the warning message
      let justification = null;
      let fieldTitle = '';
      if(this.state.TaskActivityFields[idx].show_title){ // fieldTitle is shown next to the field, so only show if instructor sets show_title to true
        if(this.state.TaskActivityFields[idx].assessment_type != null){ //if it's  grade task, simply add 'Grade' to make it prettier
          fieldTitle = title +" Grade";
        }
        else{
          fieldTitle = title;
        }
      }
      if(this.state.TaskActivityFields[idx].requires_justification){
        if(this.state.TaskData[idx][1] == ''){
          justification = (<div></div>);
        }
        else{
          justification = (<div className="faded-big">{this.state.TaskData[idx][1]}</div>)
        }
      }

      if(this.state.TaskActivityFields[idx].field_type == "text"){
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
      else if(this.state.TaskActivityFields[idx].field_type== "assessment" || this.state.TaskActivityFields[idx].field_type == "self assessment"){

        if(this.state.TaskActivityFields[idx].assessment_type == "grade"){
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
        else if(this.state.TaskActivityFields[idx].assessment_type == "rating"){
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
        else if(this.state.TaskActivityFields[idx].assessment_type == "pass"){
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
        else if(this.state.TaskActivityFields[idx].assessment_type == "evaluation"){
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
        else{
          return(<div> Hi</div>);
        }
      }
      else if(this.state.TaskActivityFields[idx].field_type == "numeric"){

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
      else{
        return (<div></div>);
      }

    }, this);



      if(this.state.ShowContent){ //if the title is clicked on, this will be false and the content won't be shown
        content = (<div className="section-content">
                      <div name="problem-text" className="regular-text">{fields}</div>
                      <br />
                    </div>);
      }
      else{
        content=(<div></div>);
      }

      return (
        <div className="section animate fadeInUp card-1">
          <h2 className="title" onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}:</h2>
            {content}
        </div>
    );

  }

}
export default SuperViewComponent;
