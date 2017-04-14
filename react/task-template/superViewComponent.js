/* This component will hold the user-made problem. It is shown during all stages after create-problem.
* It only makes one GET request to get the problem stored in the database.
*/
import React from 'react';
import request from 'request';
import Rater from 'react-rater';
import ErrorComponent from './errorComponent';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
/**** PROPS:
    TaskData,
    TaskActivityFields,
    ComponentTitle
    Instructions,
    Rubric

*/

class SuperViewComponent extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            ShowContent: true,
            TaskData:{},
            ShowRubric: false,
            FieldRubrics: [],
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

    toggleRubric(){
    //shows or hides the task activity rubric
        const bool = this.state.ShowRubric ? false : true;

        this.setState({
            ShowRubric: bool
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

    componentWillMount(){
        let tdata = this.props.TaskData;
        let tAdata = this.props.TaskActivityFields;
        if(!tdata || tdata == '{}' || !tAdata || tAdata == '{}' || Object.keys(tdata).length === 0 && tdata.constructor === Object ){
      // this checks to make sure all the necessary data isn't empty. If it is, it will cause errors, so set the Error state to true
      // to prevent rendering
            this.setState({Error: true});
            return ;
        }
        else {
            if(tdata.constructor !== Object){ //if the TaskData is not an object, it mut be a JSON, so parse it before continuing
                tdata = JSON.parse(this.props.TaskData);
            }
            if(tAdata.constructor !== Object){
                tAdata = JSON.parse(this.props.TaskActivityFields);
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
        let TA_rubric = null;
        let TA_instructions = null;
        let TA_rubricButtonText = this.state.ShowRubric ? this.props.Strings.HideTaskRubric : this.props.Strings.ShowTaskRubric;

        if(this.state.Error){ // if there was an error loading the data, show an Error component
            return(<ErrorComponent />);
        }

        if(this.props.Rubric != '' && this.props.Rubric != null){ //if no Rubric
            let TA_rubric_content = null;
            if(this.state.ShowRubric){
                TA_rubric_content = (
            <div>
              <div className="boldfaces">{this.props.Strings.TaskRubric}</div><div className="regular-text rubric" key={'rubric'} dangerouslySetInnerHTML={{ __html: this.props.Rubric}}></div>
            </div>
            );

            }

            TA_rubric = ( <div key={'rub'}>
            <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)}  key={'button'}> {TA_rubricButtonText}</button>
            <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionName="example" transitionAppear={false} transitionEnter={true} transitionLeave={true}>
            {TA_rubric_content}
          </ReactCSSTransitionGroup>

          </div>);
        }

        if(this.props.Instructions != null && this.props.Instructions != '' ){
            TA_instructions = (
        <div >
            <div className="boldfaces">{this.props.Strings.TaskInstructions}</div><div className="regular-text instructions" dangerouslySetInnerHTML={{ __html: this.props.Instructions}}>
              </div>

      </div>);
        }

        let fields = this.state.TaskActivityFields.field_titles.map(function(title, idx){ //go over the fields and display the data appropriately
      // this is a bunch of conditionals that check the fields in the TA fields object.
            let justification = null;
            let fieldTitle = '';
            let rubricView = null;
            let instructions = null;
            let completeFieldView = null;
            let contentView = null;

            if(this.state.TaskActivityFields[idx].show_title){ // fieldTitle is shown next to the field, so only show if instructor sets show_title to true
                if(this.state.TaskActivityFields[idx].assessment_type != null){ //if it's  grade task, simply add 'Grade' to make it prettier
                    fieldTitle = title + ' ' + this.props.Strings.Grade;
                }
                else{
                    fieldTitle = title;
                }
            }

            if(this.state.TaskActivityFields[idx].rubric != ''){ //if Rubric is empty, don't show anything
                let rubric_content = null;
                let buttonTextHelper = this.state.TaskActivityFields[idx].show_title ? field : '';
                let rubricButtonText = this.state.FieldRubrics[idx] ?  this.props.Strings.HideRubric : this.props.Strings.ShowRubric;
                if(this.state.FieldRubrics[idx]){
                    rubric_content = (<div className="regular-text" key={this.state.TaskActivityFields[idx].title}><b>{fieldTitle} {this.props.Strings.Rubric}: </b><div dangerouslySetInnerHTML={{ __html: this.state.TaskActivityFields[idx].rubric}}></div></div>);
                }

                rubricView = ( <div key={1200}>
            <button type="button" className="in-line" onClick={this.toggleFieldRubric.bind(this,idx)}> {rubricButtonText}</button>
            <ReactCSSTransitionGroup  transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionAppearTimeout={500} transitionName="example" transitionAppear={false} transitionEnter={true} transitionLeave={true}>
              {rubric_content}
            </ReactCSSTransitionGroup>

          </div>
        );

            }


            if(this.state.TaskActivityFields[idx].instructions != ''){ //if instructions are empty, don't display anything
                instructions = (
          <div key ={1100}>
            <br />
            <div className="regular-text"><b>{fieldTitle} {this.props.Strings.Instructions}</b> <div dangerouslySetInnerHTML={{ __html: this.state.TaskActivityFields[idx].instructions}}></div></div>
            <br />
          </div>
        );
            }

            if(this.state.TaskActivityFields[idx].requires_justification){
                if(this.state.TaskData[idx][1] == ''){
                    justification = (<div key={idx + 655}></div>);
                }
                else{
                    justification = (<div key={idx + 655} className="faded-big" dangerouslySetInnerHTML={{ __html: this.state.TaskData[idx][1]}}></div>);
                }
            }

            if(this.state.TaskActivityFields[idx].field_type == 'text'){
                contentView = (
          <div className="field-content" key={idx + 1000}>
            <div key={idx} className="faded-big" dangerouslySetInnerHTML={{ __html: this.state.TaskData[idx][0]}}>
            </div>
          </div>
        );
            }
            else if(this.state.TaskActivityFields[idx].field_type == 'assessment' || this.state.TaskActivityFields[idx].field_type == 'self assessment'){

                if(this.state.TaskActivityFields[idx].assessment_type == 'grade'){
                    contentView = (
            <div className="field-content" key={idx + 1000}>
              <div key={idx} className="faded-small"> {this.state.TaskData[idx][0]}
              </div>
            </div>
          );
                }
                else if(this.state.TaskActivityFields[idx].assessment_type == 'rating'){
                    let val = (this.state.TaskData[idx][0] == null || this.state.TaskData[idx][0] == '') ? 0 : this.state.TaskData[idx][0];
                    contentView = (
            <div className="field-content" key={idx + 1000}>
              <div key={idx + 600}><b>{fieldTitle}   </b>
                 <Rater total={this.state.TaskActivityFields[idx].rating_max} rating={val} interactive={false} />
              </div>
            </div>
          );
                }
                else if(this.state.TaskActivityFields[idx].assessment_type == 'pass'){

                    contentView = (
            <div className="field-content" key={idx + 1000}>
              <div key={idx} className="faded-small"> {this.state.TaskData[idx][0]}</div>
            </div>
          );

                }
                else if(this.state.TaskActivityFields[idx].assessment_type == 'evaluation'){
                    contentView = (
            <div className="field-content" key={idx + 1000}>
              <div key={idx} className="faded-big"> {this.state.TaskData[idx][0]}
              </div>
            </div>
          );
                }
                else{
                    return(<div key={idx + 1000}> Hi</div>);
                }
            }
            else if(this.state.TaskActivityFields[idx].field_type == 'numeric'){

                contentView = (
          <div className="field-content" key={idx + 1000}>
            <div key={idx} className="faded-small"> {this.state.TaskData[idx][0]}
            </div>
          </div>
        );
            }
            else{
                contentView = (<div className="field-content" key={idx + 1000}></div>);
            }

            completeFieldView =  (
        <div key={idx+200}>
          {instructions}
          {rubricView}
          <br/>
          {contentView}
          <br key={idx+500}/>
          {justification}
          <br />
        </div>
        );

            return completeFieldView;

        }, this);



        if(this.state.ShowContent){ //if the title is clicked on, this will be false and the content won't be shown
            content = (<div key={this.props.index + 2003} className="section-content">
                      {TA_instructions}
                      {TA_rubric}
                      <div key={this.props.index + 2004} name="problem-text" >{fields}</div>
                      <br key={this.props.index + 2005}/>
                    </div>);
        }
        else{
            content=(<div key={this.props.index + 2003}></div>);
        }

        return (
        <div key={this.props.index + 2001}className="section card-2" >
          <h2 key={this.props.index + 2002}className="title" onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}</h2>
            {content}
        </div>
        );

    }

}
export default SuperViewComponent;
