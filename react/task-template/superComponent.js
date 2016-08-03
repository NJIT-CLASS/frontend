/* This component is show when the tasks is to create the problem. It will show
* the assignment description, the rubric, the instructions, and a text area. The
* component will be able to make a PUT request to save the data for later, a GET
* request to get the initial data, and a POST request for final submission.
*/
import React from 'react';
import request from 'request';
import ErrorComponent from './errorComponent';
import Checkbox from '../shared/checkbox';
import Dropdown from 'react-dropdown';
import Rater from 'react-rater';
import {RadioGroup, Radio} from 'react-radio-group';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class SuperComponent extends React.Component {
  constructor (props){
    super(props);
    /*
    PROPS:  -TaskData
            -TaskActivityFields (TaskAcitivtyData)
            -ComponentTitle
            -Instructions
            -TaskStatus
            -Rubric

    */

    this.state = {
      TaskActivityFields: {
        field_titles: []
      },
      TaskData: {},
      ShowRubric: false,
      FieldRubrics: [],
      InputError: false,
      TaskStatus: '',
      ShowContent: true,
      Error: false,
      SaveSuccess: false,
      SubmitSuccess: false,
      PassFailValue: null
    };
  }

  componentWillMount(){

        let tdata = this.props.TaskData;
        let tAdata = this.props.TaskActivityFields;
        //checks to see if either data prop is null
        if(!tdata ){
          tdata = {};
        }
        if(!tAdata){
          this.setState({Error: true});
          return;
        }

        if(tdata.constructor !== Object){
          tdata = JSON.parse(this.props.TaskData)
        }
        if(tAdata.constructor !== Object){
          tAdata = JSON.parse(this.props.TaskActivityFields)
        }

        //checks to see if either task activity data is empty. This would only be caused by an error
        if(Object.keys(tAdata).length === 0 && tAdata.constructor === Object){
          this.setState({Error: true});
          return;
        }
        //if task data is empty, it fills it up with the TA's fields
        if(Object.keys(tdata).length === 0 && tdata.constructor === Object || tdata == null){
            tdata.number_of_fields = tAdata.number_of_fields;
            for(let i = 0; i < tAdata.number_of_fields; i++){

              tdata[i] = tAdata[i].default_content;
            }
            /*tAdata.field_titles.forEach(function(title){
              tdata[title] = tAdata[title].default_content;
            });*/

        }
        //if no TaskStatus is given, assume complete
        let tstat = (this.props.TaskStatus != null) ? this.props.TaskStatus : "Incomplete";

        this.setState({
            TaskData: tdata,
            TaskActivityFields: tAdata,
            TaskStatus: tstat
        });
  }

    isValidData(){
      //go through all of TaskData's fields to check if null. If a field requires_justification,
      // also check the justification field
      //returns false if any field is null and true if all fields are filled
      for(let i = 0; i < this.state.TaskActivityFields.number_of_fields; i++){
        if(this.state.TaskActivityFields[i].requires_justification){
          if((this.state.TaskData[i][0] == null || this.state.TaskData[i][0] == '') || (this.state.TaskData[i][1] == null || this.state.TaskData[i][1] == '')){
            return false;
          }
        }
        else{
          if(this.state.TaskData[i][0] == null || this.state.TaskData[i][0] == ''){
            return false;
          }
        }

      }

      return true;
    }

    saveData(e){
      // function makes a POST call and sends in the state variables which hold the user's input
      e.preventDefault(); //standard JavaScript behavior
      //if task is complete, don't allow saving new data
      if(this.state.TaskStatus == "Complete"){
        return ;
      }

      let validData = this.isValidData(); //checks to see if data is valid before submitting

      if(validData){
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/taskInstanceTemplate/create/save',
            body: {
                taskInstanceid: this.props.TaskID,
                userid: this.props.UserID,
                taskInstanceData: this.state.TaskData
            },
            json: true
          };

        request(options, (err, res, body) => {
          if(res.statusCode != 200){
            this.setState({InputError: true});
            return;
          }
          else{
            this.setState({
              SaveSuccess: true
            });
            return;
          }
        });
      }
      else{
        this.setState({InputError: true});
        return;
      }
    }

    submitData(e){
      e.preventDefault();
      //don't allow submit if task is complete
      if(this.state.TaskStatus == "Complete"){
        return ;
      }
      //check if input is valid
      let validData = this.isValidData();

      if(validData){
        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/taskInstanceTemplate/create/submit',
            body: {
                taskInstanceid: this.props.TaskID,
                userid: this.props.UserID,
                taskInstanceData: this.state.TaskData
            },
            json: true
          };

        request(options, (err, res, body) => {
          if(res.statusCode != 200){
            this.setState({InputError: true});
            return;
          }
          else{
            this.setState({
              SubmitSuccess: true,
              TaskStatus: "Complete"
            });
            return;
          }
        });
      }

      else{
        this.setState({InputError: true});
        return;
      }

    }


    // modalToggle(){ //not used
    //   //shows or hides error message popup(modal)
    //   this.setState({InputError:false})
    // }

    toggleRubric(){
      //shows or hides the task activity rubric
      const bool = this.state.ShowRubric ? false : true;

      this.setState({
        ShowRubric: bool
      });
    }

    toggleContent(){
      //shows or hides the component's section-content for accordian view
      const bool = this.state.ShowContent ? false : true;

      this.setState({
        ShowContent: bool
      });
    }

    handleContentChange(index,event) {

      //updates task data with new user input in grading fields
      if(this.state.TaskActivityFields[index] != null && this.state.TaskActivityFields[index].field_type == "numeric"){
          if(isNaN(event.target.value)){
            return;
          }
          if(event.target.value < this.state.TaskActivityFields[index].grade_min || event.target.value > this.state.TaskActivityFields[index].grade_max){
              return;
          }
        }
      if(typeof(event.target.value) === 'string' && event.target.value.length > 45000){ // checks to see if the input is a reasonable length
        return;
      }
      let newTaskData = this.state.TaskData;
      newTaskData[index][0] = event.target.value;
      this.setState({
          TaskData: newTaskData
        });
      }

      handleJustificationChange(index,event) {
        if(event.target.value.length > 45000){ //checks to see if input is reasosnable length, makes sure browser doesn't crash on long input
          return;
        }
        //updates task data with new user input in justification fields
        let newTaskData = this.state.TaskData;
        newTaskData[index][1] = event.target.value;

        this.setState({
          TaskData: newTaskData
        });
        }

    handleStarChange(index,value){
      //updates rating grade in taskdata
      let newTaskData = this.state.TaskData;
      newTaskData[index][0] = value;

      this.setState({
        TaskData: newTaskData
      });

    }

    toggleFieldRubric(index){
      //shows or hides the indivual fields' rubrics
          if(this.state.FieldRubrics[index] === []){
            let newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[index] = true;
            this.setState({
              FieldRubrics: newFieldRubrics
            });
          }
          else{
            let bool = this.state.FieldRubrics[index] ? false: true;
            let newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[index] = bool;
            this.setState({
              FieldRubrics: newFieldRubrics
            });
          }
        }

    render(){

          console.log(this.state.TaskData)
          let content= null;
          let infoMessage = null;
          let TA_rubric = null;
          let TA_instructions = null;
          let formButtons =  null;
          let indexer =  "content";
          let TA_rubricButtonText = this.state.ShowRubric ? "Hide Rubric" : "Show Rubric";
          //if invalid data, shows error message

          if(this.state.Error){
              return(<ErrorComponent />);
          }

          if(this.state.InputError){
            infoMessage = (<span style={{backgroundColor: '#ed5565', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px #ed5565'}}>Submit Error! Please check your work and try again </span>);
            //old Modal style:
            // infoMessage = (<Modal title="Submit Error"  close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
          }

          if(this.state.SaveSuccess){
            infoMessage = (<span onClick={()=> {this.setState({SaveSuccess: false})}} style={{backgroundColor: '#00AB8D', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px rgb(0, 171, 141)'}}>Your work has been saved and will be loaded when you return </span>);
          }
          if(this.state.SubmitSuccess){
            infoMessage = (<span  onClick={()=> {this.setState({SubmitSuccess: false})}} style={{backgroundColor: '#00AB8D', color: 'white',padding: '10px', display: 'block',margin: '20px 10px', textSize:'16px', textAlign: 'center', boxShadow: '0 1px 10px rgb(0, 171, 141)'}}> Successfully submitted for grading! </span>);
          }

          if(this.state.TaskStatus != "Complete"){
            formButtons = (<div>
              <br />
              <button type="submit" action="#" className="divider"><i className="fa fa-check"></i>Submit</button>
              <button type="button" className="divider" onClick={this.saveData.bind(this)}>Save for Later</button>
            </div>);
          }

          if(this.props.Rubric != '' && this.props.Rubric != null){ //if no Rubric
            let TA_rubric_content = null;
            if(this.state.ShowRubric){
                TA_rubric_content = (<div className="regular-text" key={"rubric"}> {this.props.Rubric}</div>);

              }

              TA_rubric = ( <div key={"rub"}>
                  <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)}  key={"button"}> {TA_rubricButtonText}</button>
                  <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionName="example" transitionAppear={false} transitionEnter={true} transitionLeave={true}>
                  {TA_rubric_content}
                </ReactCSSTransitionGroup>

                </div>);
          }

          if(this.props.Instructions != null && this.props.Instructions != '' ){
            TA_instructions = (<div className="regular-text instructions">
                  <b>Insructions</b>: {this.props.Instructions}

            </div>);
          }



          //creating all input fields here
          let fields = this.state.TaskActivityFields.field_titles.map(function(title, idx){
            let rubricView = null;
            let justification = null;
            let instructions = null;
            let fieldTitleText = '';
            let fieldTitle = null;



            if(this.state.TaskActivityFields[idx].show_title){ //shoudl the title be displayed or not
              if(this.state.TaskActivityFields[idx].assessment_type != null){ //add "Grade" to assess fields to make pretty
                fieldTitleText = title +" Grade";
              }
              else{
                fieldTitleText = title;
              }

              fieldTitle = (<div>
                <br />
                <div key={idx + 600}><b>{fieldTitleText}</b></div>
              </div>);
            }


            if(this.state.TaskActivityFields[idx].rubric != ''){ //if Rubric is empty, don't show anything
              let rubric_content = null;
              let buttonTextHelper = this.state.TaskActivityFields[idx].show_title ? title : '';
              let rubricButtonText = this.state.FieldRubrics[idx] ? ("Hide " + buttonTextHelper + " Rubric") : ("Show " + buttonTextHelper + " Rubric");
              if(this.state.FieldRubrics[idx]){
                rubric_content = (<div className="regular-text" key={this.state.TaskActivityFields[idx].title}><b>Rubric: </b> {this.state.TaskActivityFields[idx].rubric}</div>);
              }

              rubricView = ( <div key={1200}>
                  <button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,idx)}> {rubricButtonText}</button>
                  <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={false} transitionEnter={true} transitionLeave={true}>
                    {rubric_content}
                  </ReactCSSTransitionGroup>

                </div>
              );

            }

            if(this.state.TaskActivityFields[idx].requires_justification){
              if(this.state.TaskData[idx][1] == ''){
              justification = ( <div>
                                  <div>{this.state.TaskActivityFields[idx].justification_instructions}</div>
                                  <textarea key={idx +100} className="big-text-field" value={this.state.TaskActivityFields[idx].default_content[1]} onChange={this.handleJustificationChange.bind(this, idx)} placeholder="Type your problem here ...">
                                   </textarea>
                              </div>);
                            }
              else {
                justification = ( <div>
                                    <div>{this.state.TaskActivityFields[idx].justification_instructions}</div>
                                    <textarea key={idx +100} className="big-text-field" value={this.state.TaskData[idx][1]} onChange={this.handleJustificationChange.bind(this, idx)} placeholder="Type your problem here ...">
                                     </textarea>
                                </div>);
              }
            }

            if(this.state.TaskActivityFields[idx].instructions != ''){ //if instructions are empty, don't display anything
              instructions = (
                <div key ={1100}>
                  <br />
                  <div className="regular-text"><b>{fieldTitleText} Instructions:</b> {this.state.TaskActivityFields[idx].instructions}</div>
                  <br />
                </div>
              );
            }

            //////// Depending on field type, render different things

            if(this.state.TaskActivityFields[idx].field_type == "numeric"){
                let fieldInput = null;
                if(this.state.TaskData[idx][0] == null){
                  fieldInput = (<input type="number"  key={idx}  className="number-input" value={this.state.TaskActivityFields[idx].default_content[0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="...">
                  </input>);
                }
                else{
                  fieldInput = (<input type="number"  key={idx} className="number-input" value={this.state.TaskData[idx][0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="...">
                  </input>);
                }

                return (
                  <div key={idx+200}>
                    {instructions}
                    {rubricView}
                    <br/>
                    <div key={idx + 600}><b>{fieldTitleText}</b> {fieldInput}</div>
                    <br key={idx+500}/>
                    {justification}
                    <br />
                    <br />
                  </div>
                  );



            }
            else if(this.state.TaskActivityFields[idx].field_type == "text"){
              let fieldInput = null;
              if(this.state.TaskData[idx][0] == null){
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskActivityFields[idx].default_content[0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="Type your problem here ...">
                </textarea>)
              }
              else{
                fieldInput = (<textarea key={idx} className="big-text-field" value={this.state.TaskData[idx][0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="Type your problem here ...">
                </textarea>)
              }

              return (<div key={idx+200}>

                <div key={idx + 600}><b>{fieldTitleText}</b></div>
                {instructions}

                {rubricView}
                <br/>
                {fieldInput}
                <br key={idx+500}/>
                {justification}
                <br />
                <br />
              </div>
              );
            }

            else if(this.state.TaskActivityFields[idx].field_type == "assessment" || this.state.TaskActivityFields[idx].field_type == "self assessment"){
              // decides how to display information given the type of assessment it is
              if(this.state.TaskActivityFields[idx].assessment_type == "grade"){
                let fieldInput = null;

                if(this.state.TaskData[idx][0] == null){
                  fieldInput = (<input type="text"  key={idx}  className="number-input" value={this.state.TaskActivityFields[idx].default_content[0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="...">
                  </input>);
                }

                else{
                  fieldInput = (<input type="text"  key={idx} className="number-input" value={this.state.TaskData[idx][0]} onChange={this.handleContentChange.bind(this,idx)} placeholder="...">
                  </input>);
                }

                return (
                  <div key={idx+200}>
                    {instructions}
                    {rubricView}
                    <br/>
                    <div key={idx + 600}><b>{fieldTitleText}</b> {fieldInput}</div>
                    <br key={idx+500}/>
                    {justification}
                    <br />
                    <br />
                  </div>
                  );
                }

                else if(this.state.TaskActivityFields[idx].assessment_type == "rating"){
                  let val = (this.state.TaskData[idx][0] == null || this.state.TaskData[idx][0] == '') ? 0 : this.state.TaskData[idx][0];
                  let nameStr = "rate" + idx;
                  return (
                    <div key={idx+200}>

                      {instructions}

                      {rubricView}
                      <br/>
                      <div key={idx + 600}><b>{fieldTitleText}   </b>
                        <Rater total={this.state.TaskActivityFields[idx].rating_max} rating={val} onRate={this.handleStarChange.bind(this,idx)} /><br />

                      </div>
                      <br key={idx+500}/>
                      {justification}
                      <br />
                      <br />
                    </div>
                  );
                }

                else if(this.state.TaskActivityFields[idx].assessment_type == "pass"){

                  return(
                    <div key={idx+200}>
                      {instructions}
                      {rubricView}
                      <br />

                      <div className='true-checkbox'>
                        <RadioGroup selectedValue={this.state.TaskData[idx][0]} onChange={
                        (val) => {
                          let newData = this.state.TaskData;
                          newData[idx][0] = val;
                          this.setState({TaskData: newData});
                        }
                      }>
                      <label >Pass <Radio value={"pass"} /> </label>
                      <label >Fail <Radio value={"fail"}/> </label>

                    </RadioGroup>
                      </div>

                      <br key={idx+500}/>
                      {justification}
                      <br />
                      <br />
                    </div>

                  );
              }
              else if(this.state.TaskActivityFields[idx].assessment_type == "evaluation"){
                let labels = this.state.TaskActivityFields[idx].list_of_labels;
                if(typeof labels == 'string' ){
                  labels = labels.split(',');
                }

                return(
                  <div key={idx+200}>
                    {instructions}
                    {rubricView}
                    <br />
                    <label>Choose from one of the labels below</label>
                    <Dropdown key={idx+1000}
                              options={labels}
                              selectedValue={this.state.TaskData[idx][0]}
                              value={this.state.TaskData[idx][0]}
                              onChange={ (e) => {
                                let newData = this.state.TaskData;
                                newData[idx][0] = e.value;
                                this.setState({
                                  TaskData: newData
                                });
                              }}
                      />

                    <br key={idx+500}/>
                    {justification}
                    <br />
                    <br />
                  </div>

                );
              }

            }
          }, this);

          if(this.state.TaskStatus == "Complete"){
            formButtons = (<div></div>);
          }

          if(this.state.ShowContent){
            content = (<div className="section-content">

              {TA_instructions}

                {TA_rubric}

              <br />
                {fields}
                {formButtons}
           </div>);
          }
          else{
            content = (<div></div>)
          }

          return( //main render return()
            <div className="animate fadeInUp">
              {infoMessage}
              <form  role="form" className="section card-1" action="#" onSubmit={this.submitData.bind(this)}>
                <div className="placeholder"></div>
                <div onClick={this.toggleContent.bind(this)}>
                  <h2 className="title">{this.props.ComponentTitle} </h2>
                </div>
                {content}
              </form>

            </div>
          );
        }

}

export default SuperComponent;
