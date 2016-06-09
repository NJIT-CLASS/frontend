/* This component will get the user's response to the problem. It is shown only
* on a solve-problem task. It makes a GET request to get the stored data, a PUT
* request to save data for later, and a POST request to submit data.
*/

import React from 'react';
import request from 'request';
import Modal from '../shared/modal';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class SolveProblemComponent extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      AssignmentDescription: '',
      TaskActivityData: {
        field_titles: []
      },
      TaskData: {

      },
      Instructions:'',
      Rubric:'',
      ShowRubric: false,
      FieldRubrics: [],
      InputError: false
    };
  }

    getComponentData () {
      const options = {
              method: 'GET',
              uri: this.props.apiUrl + '/api/taskTemplate/solve/' + this.props.TaskID,
              json: true
          };

    request(options, (err, res, body) => {
      let tdata = JSON.parse(body.taskData);
      let tAdata = body.taskActivityData;
      if(Object.keys(tdata).length === 0 && tdata.constructor === Object || tdata == null){
          tAdata.field_titles.forEach(function(title){
            tdata[title] = tAdata[title].default_content;
          });

      }
        this.setState({
            AssignmentDescription: body.assignmentDescription,
            Instructions: body.taskInstructions,
            Rubric: body.taskRubric,
            TaskData: tdata,
            TaskActivityData: tAdata
        });
    });
    }

    componentWillMount(){
      this.getComponentData();
    }

    saveData(e){
      e.preventDefault();
      let validData = true;

      this.state.TaskActivityData.field_titles.forEach(function(title){

        if(this.state.TaskActivityData[title].requires_justification){
          if((this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '') || (this.state.TaskData[title][1] == null || this.state.TaskData[title][1] == '' || this.state.TaskData[title][1] == 0)){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }

      }
        else {
          if(this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == ''){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }
        }

      },this);


      if(validData){
        const options = {
            method: 'PUT',
            uri: this.props.apiUrl + '/api/taskTemplate/solve/save',
            body: {
                taskid: this.props.TaskID,
                userid: this.props.UserID,
                taskData: this.state.TaskData
            },
            json: true
          };

        request(options, (err, res, body) => {
        });
      }
    }

    submitData(e){
      e.preventDefault();
      let validData = true;
      this.state.TaskActivityData.field_titles.forEach(function(title){

        if(this.state.TaskActivityData[title].requires_justification){
          if((this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '') || (this.state.TaskData[title][1] == null || this.state.TaskData[title][1] == '' || this.state.TaskData[title][1] == 0)){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }

      }
        else {
          if(this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == ''){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }
        }



      },this);

        if(validData){
          const options = {
              method: 'POST',
              uri: this.props.apiUrl + '/api/taskTemplate/solve/submit',
              body: {
                  taskid: this.props.TaskID,
                  userid: this.props.UserID,
                  taskData: this.state.TaskData
              },
              json: true
            };

          request(options, (err, res, body) => {
          });
        }

      }


    modalToggle(){
      this.setState({InputError:false})
    }

    toggleRubric(){
      const bool = this.state.ShowRubric ? false : true;

      this.setState({
        ShowRubric: bool
      });
    }


    handleContentChange(index,event) {
      if(this.state.TaskActivityData[index] != null && this.state.TaskActivityData[index].input_type == "numeric"){
          if(isNaN(event.target.value)){
            return;
          }
          if(event.target.value < this.state.TaskActivityData[index].grade_min || event.target.value > this.state.TaskActivityData[index].grade_max){
              return;
          }
        }

      let newTaskData = this.state.TaskData;
      newTaskData[index][0] = event.target.value;
      this.setState({
          TaskData: newTaskData
        });
      }

      handleJustificationChange(index,event) {
        let newTaskData = this.state.TaskData;
        newTaskData[index][1] = event.target.value;


          this.setState({
            TaskData: newTaskData
          });
        }



    toggleFieldRubric(title){
          if(this.state.FieldRubrics[title] == null){
            let newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[title] = true;
            this.setState({
              FieldRubrics: newFieldRubrics
            });
          }
          else{
            let bool = this.state.FieldRubrics[title] ? false: true;
            let newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[title] = bool;
            this.setState({
              FieldRubrics: newFieldRubrics
            });
          }
        }

    render(){
          let errorMessage = null;
          let TA_rubric = null;
          let TA_assignmentDescription = null;
          let TA_instructions = null;
          let indexer =  "content";
          let TA_rubricButtonText = this.state.ShowRubric ? "Hide Rubric" : "Show Rubric";
          //if invalid data, shows error message
          if(this.state.InputError){
            errorMessage = (<Modal title="Submit Error" close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
          }

          if(this.state.Rubric != '' && this.state.Rubric != null){
            if(this.state.ShowRubric){
                TA_rubric = ( <div>
                    <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {TA_rubricButtonText}</button>
                    <br />
                    <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={true}>
                    <div className="regular-text"> {this.state.Rubric}</div>
                    </ReactCSSTransitionGroup>
                    <br />
                  </div>
                );
              }
              else{
                TA_rubric = (<button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {TA_rubricButtonText}</button>
              );
              }
            }


          //creating all input fields here
          let fields = this.state.TaskActivityData.field_titles.map(function(title, idx){
            let rubricView = null;
            let justification = null;
            let fieldTitle = '';

            if(this.state.TaskActivityData[title].show_title){
              if(this.state.TaskActivityData[title].grade_type != null){
                fieldTitle = (<div key={idx + 600}><b>{title} Grade:   </b></div>);
              }
              else{
                fieldTitle = title;
              }
            }

            if(this.state.TaskActivityData[title].rubric != ''){
              let buttonTextHelper = this.state.TaskActivityData[title].show_title ? title : '';
              let rubricButtonText = this.state.FieldRubrics[title] ? ("Hide " + buttonTextHelper + " Rubric") : ("Show " + buttonTextHelper + " Rubric");
              if(this.state.FieldRubrics[title]){
                rubricView = ( <div>
                    <button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,title)} > {rubricButtonText}</button>

                    <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={true}>
                    <div className="regular-text"> {this.state.TaskActivityData[title].rubric}</div>
                    </ReactCSSTransitionGroup>
                    <br />
                  </div>
                );
              }
              else{
                rubricView =(<button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,title)} > {rubricButtonText}</button>
                              );
              }

            }

            if(this.state.Instructions != '' && this.state.Instructions != null){
              TA_instructions = (<div className="regular-text">
                    {this.state.Instructions}
                    <br />
              </div>);
            }

            if(this.state.AssignmentDescription != undefined && this.state.AssignmentDescription != '' && this.state.AssignmentDescription != null){
              TA_assignmentDescription = (<div className="regular-text">
                    {this.state.AssignmentDescription}
                    <br />
                    <br />
              </div>);
            }

            if(this.state.TaskActivityData[title].requires_justification){
              if(this.state.TaskData[title][1] == ''){
              justification = ( <div>
                                  <div>{this.state.TaskActivityData[title].justification_instructions}</div>
                                  <textarea key={idx +100} className="big-text-field" value={this.state.TaskActivityData[title].default_content[1]} onChange={this.handleJustificationChange.bind(this, title)} placeholder="Type your problem here ...">
                                   </textarea>
                              </div>);
                            }
              else {
                justification = ( <div>
                                    <div>{this.state.TaskActivityData[title].justification_instructions}</div>
                                    <textarea key={idx +100} className="big-text-field" value={this.state.TaskData[title][1]} onChange={this.handleJustificationChange.bind(this, title)} placeholder="Type your problem here ...">
                                     </textarea>
                                </div>);
              }
            }


            if(this.state.TaskActivityData[title].input_type == "numeric"){
              if(this.state.TaskActivityData[title].grade_type == "grade"){
                let fieldInput = null;
                if(this.state.TaskData[title][0] == null){
                  fieldInput = (<input type="text"  key={idx}  className="number-input" value={this.state.TaskActivityData[title].default_content[0]} onChange={this.handleContentChange.bind(this,title)} placeholder="...">
                  </input>);
                }
                else{
                  fieldInput = (<input type="text"  key={idx} className="number-input" value={this.state.TaskData[title][0]} onChange={this.handleContentChange.bind(this,title)} placeholder="...">
                  </input>);
                }

                return (
                  <div key={idx+200}>
                    <br />
                    <div className="regular-text">{this.state.TaskActivityData[title].instructions}</div>
                    <br />
                    {rubricView}
                    <br/>
                    <div>{fieldTitle} </div>
                    {fieldInput}
                    <br key={idx+500}/>
                    {justification}
                  </div>
                  );
                }
                else if(this.state.TaskActivityData[title].grade_type == "rating"){
                  //add stars logic later
                }

            }
            else if(this.state.TaskActivityData[title].input_type == "text"){
              let fieldInput = null;
              if(this.state.TaskData[title][0] == null){
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskActivityData[title].default_content[0]} onChange={this.handleContentChange.bind(this,title)} placeholder="Type your problem here ...">
                </textarea>)
              }
              else{
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskData[title][0]} onChange={this.handleContentChange.bind(this,title)} placeholder="Type your problem here ...">
                </textarea>)
              }

              return (<div key={idx+200}>
                <br />
                <div>{fieldTitle} </div>
                <div className="regular-text">{this.state.TaskActivityData[title].instructions}</div>
                <br />
                {rubricView}
                <br/>
                {fieldInput}
                <br key={idx+500}/>
                {justification}
              </div>
              );
            }
          }, this);


          return(
            <div className="animate fadeInUp">
              {errorMessage}
              <form  role="form" className="section" onSubmit={this.submitData.bind(this)}>
                <div >
                  <h2 className="title">Solve the Problem </h2>
                </div>
                <div className="section-content">
                  {TA_assignmentDescription}
                  {TA_instructions}
                  {TA_rubric}
                  <br />
                    {fields}
                  <br />
                  <button type="submit" className="divider"><i className="fa fa-check"></i>Submit</button>
                  <button type="button" className="divider" onClick={this.saveData.bind(this)}>Save for Later</button>
               </div>
              </form>
            </div>
          );
        }
}

export default SolveProblemComponent;
