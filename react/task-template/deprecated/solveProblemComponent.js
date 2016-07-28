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
      TaskActivityFields: {
        field_titles: []
      },
      TaskData: {

      },
      ShowRubric: false,
      FieldRubrics: [],
      InputError: false
    };
  }

    getComponentData () {
    /*  const options = {
              method: 'GET',
              uri: this.props.apiUrl + '/api/taskTemplate/create/' + this.props.TaskID,
              json: true
          };

      request(options, (err, res, body) => {*/
      let tdata = this.props.TaskData;
      let tAdata = this.props.TaskActivityFields;
      if(tdata.constructor !== Object){
        tdata = JSON.parse(this.props.TaskData)
      }
      if(tAdata.constructor !== Object){
        tAdata = JSON.parse(this.props.TaskActivityFields)
      }

      if(Object.keys(tdata).length === 0 && tdata.constructor === Object || tdata == null){
          tAdata.field_titles.forEach(function(title){
            tdata[title] = tAdata[title].default_content;
          });

      }
      this.setState({
          TaskData: tdata,
          TaskActivityFields: tAdata
      });
      //});
    }

    componentWillMount(){
      this.getComponentData();
    }

    saveData(e){
      e.preventDefault();
      let validData = true;

      this.state.TaskActivityFields.field_titles.forEach(function(title){

        if(this.state.TaskActivityFields[title].requires_justification){
          if((this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '' || this.state.TaskData[title][0] == 0 ) || (this.state.TaskData[title][1] == null || this.state.TaskData[title][1] == '' || this.state.TaskData[title][1] == 0)){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }

      }
        else {
          if(this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '' || this.state.TaskData[title][0] == 0){
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
            uri: this.props.apiUrl + '/api/taskTemplate/create/save',
            body: {
                taskid: this.props.TaskID,
                userid: this.props.UserID,
                taskData: this.state.TaskData
            },
            json: true
          };

        request(options, (err, res, body) => {
          if(res.statusCode != 200){
            this.setState({InputError: true});
            return;
          }
        });
      }
    }

    submitData(e){
      e.preventDefault();
      let validData = true;
      this.state.TaskActivityFields.field_titles.forEach(function(title){

        if(this.state.TaskActivityFields[title].requires_justification){
          if((this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '' || this.state.TaskData[title][0] == 0 ) || (this.state.TaskData[title][1] == null || this.state.TaskData[title][1] == '' || this.state.TaskData[title][1] == 0)){
            this.setState({
              InputError: true
            });
            validData = false;
            return;
          }

      }
        else {
          if(this.state.TaskData[title][0] == null || this.state.TaskData[title][0] == '' || this.state.TaskData[title][0] == 0){
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
              uri: this.props.apiUrl + '/api/taskTemplate/create/submit',
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
      if(this.state.TaskActivityFields[index] != null && this.state.TaskActivityFields[index].input_type == "numeric"){
          if(isNaN(event.target.value)){
            return;
          }
          if(event.target.value < this.state.TaskActivityFields[index].grade_min || event.target.value > this.state.TaskActivityFields[index].grade_max){
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

          if(this.props.Rubric != '' && this.props.Rubric != null){
            if(this.state.ShowRubric){
                TA_rubric = ( <div>
                    <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} > {TA_rubricButtonText}</button>
                    <br />
                    <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={true}>
                    <div className="regular-text"> {this.props.Rubric}</div>
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
          let fields = this.state.TaskActivityFields.field_titles.map(function(title, idx){
            let rubricView = null;
            let justification = null;
            let fieldTitle = '';

            if(this.state.TaskActivityFields[title].show_title){
              if(this.state.TaskActivityFields[title].grade_type != null){
                fieldTitle = title +" Grade";
              }
              else{
                fieldTitle = title;
              }
            }

            if(this.state.TaskActivityFields[title].rubric != ''){
              let buttonTextHelper = this.state.TaskActivityFields[title].show_title ? title : '';
              let rubricButtonText = this.state.FieldRubrics[title] ? ("Hide " + buttonTextHelper + " Rubric") : ("Show " + buttonTextHelper + " Rubric");
              if(this.state.FieldRubrics[title]){
                rubricView = ( <div>
                    <button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,title)} > {rubricButtonText}</button>
                    <br />
                    <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={true}>
                    <div className="regular-text"> {this.state.TaskActivityFields[title].rubric}</div>
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

            if(this.props.Instructions != '' && this.props.Instructions != null){
              TA_instructions = (<div className="regular-text instructions">
                    Insructions: {this.props.Instructions}
                    <br />
              </div>);
            }

            if(this.props.AssignmentDescription != undefined && this.props.AssignmentDescription != '' && this.props.AssignmentDescription != null){
              TA_assignmentDescription = (<div className="regular-text assignmentDescription">
                    Description: {this.props.AssignmentDescription}
                    <br />
              </div>);
            }

            if(this.state.TaskActivityFields[title].requires_justification){
              if(this.state.TaskData[title][1] == ''){
              justification = ( <div>
                                  <div>{this.state.TaskActivityFields[title].justification_instructions}</div>
                                  <textarea key={idx +100} className="big-text-field" value={this.state.TaskActivityFields[title].default_content[1]} onChange={this.handleJustificationChange.bind(this, title)} placeholder="Type your problem here ...">
                                   </textarea>
                              </div>);
                            }
              else {
                justification = ( <div>
                                    <div>{this.state.TaskActivityFields[title].justification_instructions}</div>
                                    <textarea key={idx +100} className="big-text-field" value={this.state.TaskData[title][1]} onChange={this.handleJustificationChange.bind(this, title)} placeholder="Type your problem here ...">
                                     </textarea>
                                </div>);
              }
            }


            if(this.state.TaskActivityFields[title].input_type == "numeric"){
              if(this.state.TaskActivityFields[title].grade_type == "grade"){
                let fieldInput = null;
                if(this.state.TaskData[title][0] == null){
                  fieldInput = (<input type="text"  key={idx}  className="number-input" value={this.state.TaskActivityFields[title].default_content[0]} onChange={this.handleContentChange.bind(this,title)} placeholder="...">
                  </input>);
                }
                else{
                  fieldInput = (<input type="text"  key={idx} className="number-input" value={this.state.TaskData[title][0]} onChange={this.handleContentChange.bind(this,title)} placeholder="...">
                  </input>);
                }

                return (
                  <div key={idx+200}>
                    <br />
                    <div className="regular-text">{this.state.TaskActivityFields[title].instructions}</div>
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
                else if(this.state.TaskActivityFields[title].grade_type == "rating"){
                  //add stars logic later
                }

            }
            else if(this.state.TaskActivityFields[title].input_type == "text"){
              let fieldInput = null;
              console.log(this.state.TaskData[title]);
              console.log(title);
              if(this.state.TaskData[title][0] == null){
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskActivityFields[title].default_content[0]} onChange={this.handleContentChange.bind(this,title)} placeholder="Type your problem here ...">
                </textarea>)
              }
              else{
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskData[title][0]} onChange={this.handleContentChange.bind(this,title)} placeholder="Type your problem here ...">
                </textarea>)
              }

              return (<div key={idx+200}>
                <br />
                <div key={idx + 600}><b>{fieldTitle}</b></div>
                <div className="regular-text">{this.state.TaskActivityFields[title].instructions}</div>
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
