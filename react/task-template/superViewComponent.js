/* This component will hold the user-made problem.
*  This component is non interactive, so it is only used to display the responses
*  of previous tasks.
*/
import React from 'react';
import PropTypes from 'prop-types';
import MarkupText from '../shared/markupTextView';
import ErrorComponent from './errorComponent';
import VersionView from './individualFieldVersionsComponent';
import CommentInfoComponent from './commentInfoComponent';
import apiCall from '../shared/apiCall';
import FileLinksComponent from './fileLinksComponent';
import {CSSTransition, TransitionGroup} from 'react-transition-group';
import { TASK_TYPES } from '../../server/utils/react_constants'; // contains constants and their values
import {  isEmpty } from 'lodash';

class SuperViewComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ShowContent: false,
            ShowRubric: false,
            FieldRubrics: [],
            Ready: false,
            Error: false,
            IsBypassedDispute: false
            
        };
    }

    toggleContent() {
        const bool = !this.state.ShowContent;

        this.setState({
            ShowContent: bool,
        });
    }

    toggleRubric() {
    // shows or hides the task activity rubric
        const bool = !this.state.ShowRubric;

        this.setState({
            ShowRubric: bool,
        });
    }

    toggleFieldRubric(index) {
    // shows or hides the indivual fields' rubrics
        if (this.state.FieldRubrics[index] === []) {
            const newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[index] = true;
            this.setState({
                FieldRubrics: newFieldRubrics,
            });
        } else {
            const bool = !this.state.FieldRubrics[index];
            const newFieldRubrics = this.state.FieldRubrics;
            newFieldRubrics[index] = bool;
            this.setState({
                FieldRubrics: newFieldRubrics,
            });
        }
    }

    render() {
        let content = null;
        let TA_rubric = null;
        let TA_instructions = null;
        const TA_rubricButtonText = this.state.ShowRubric ? this.props.Strings.HideTaskRubric : this.props.Strings.ShowTaskRubric;


        if(this.state.IsBypassedDispute === true){
            return (<div key={this.props.index + 2001} className="section card-2" >
                <h2 key={this.props.index + 2002} className={'title collapsable-header' + (this.props.TaskOwner == this.props.VisitorID ? ' visitors-task' : '')} >{this.props.Strings.BypassedDisputeMessage}</h2>
            </div>);
        }
        if (!this.state.ShowContent) { // if the title is clicked on, this will be false and the content won't be shown
            return (<div key={this.props.index + 2001}className="section card-2" >
                <h2 key={this.props.index + 2002}className={'title collapsable-header' + (this.props.TaskOwner == this.props.VisitorID ? ' visitors-task' : '')} onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}</h2>
            </div>);
        }


        if (this.props.Rubric !== '' && this.props.Rubric !== null) { // if no Rubric, don't show it
            let TA_rubric_content = <div></div>;
            if (this.state.ShowRubric) {
                // dangerouslySetInnerHTML is used here in case a markup-based text format is
                // used in the future (WYSIWYG editor support)
                TA_rubric_content = (
                    <div>
                        <div className="boldfaces">{this.props.Strings.TaskRubric}</div>
                        <MarkupText classNames="regular-text" content={this.props.Rubric} />
                    </div>
                );
            }

            TA_rubric = (<div key={'rub'}>
              <button type="button" className="in-line float-button" onClick={this.toggleRubric.bind(this)} key={'button'}> {TA_rubricButtonText}</button>
              <TransitionGroup>
              <CSSTransition
                timeout={{enter: 500, exit: 300}}
                classNames="example"
                appear
                enter
                exit>
              {TA_rubric_content}
              </CSSTransition>
            </TransitionGroup>
            </div>);
        }

        if (this.props.Instructions != null && this.props.Instructions !== '') {
            TA_instructions = (
                <div >
                    <div className="boldfaces">{this.props.Strings.TaskInstructions}</div>
                    <MarkupText classNames="regular-text" content={this.props.Instructions} />
                </div>);
        }


        const fields = this.props.TaskActivityFields.field_titles.map((field, index) => {
            let fieldTitle = '';
            let fieldTitleText = '';
            let fieldInstructions = null;
            let fieldRubric = null;
            let justificationInstructions = null;

            if (this.props.TaskActivityFields[index].show_title) { // shoudl the title be displayed or not
                fieldTitleText = field;


                fieldTitle = (<div>
                    <br />
                    <div key={index + 600}>{fieldTitleText}</div>
                </div>);
            }

            if (this.props.TaskActivityFields[index].rubric != '') { // if Rubric is empty, don't show anything
                let rubric_content = <div></div>;
                const buttonTextHelper = this.props.TaskActivityFields[index].show_title ? field : '';
                const rubricButtonText = this.state.FieldRubrics[index] ? this.props.Strings.HideRubric : this.props.Strings.ShowRubric;

                if (this.state.FieldRubrics[index]) {
                    rubric_content = (
                        <div key={this.props.TaskActivityFields[index].title}>
                            <div className="template-field-rubric-label"> {fieldTitleText} {this.props.Strings.Rubric} </div>
                            <div className="regular-text rubric">
                                {this.props.TaskActivityFields[index].rubric}
                            </div>
                        </div>);
                }

                fieldRubric = (<div key={1200}>
                  <button
                    type="button"
                    className="float-button in-line"
                    onClick={this.toggleFieldRubric.bind(this, index)}
                  >
                    {rubricButtonText}
                  </button>
                  <TransitionGroup>
                  <CSSTransition
                    timeout={{enter: 500, exit: 300}}
                    classNames="example"
                    appear
                    enter
                    exit>
                  {rubric_content}
                  </CSSTransition>
                </TransitionGroup>
                </div>
                );
            }

            if (this.props.TaskActivityFields[index].instructions !== '') { // if instructions are empty, don't display anything
                fieldInstructions = (
                    <div key={1100}>
                        <div className="template-field-instructions-label">{fieldTitleText} {this.props.Strings.Instructions}</div>
                        <div className="regular-text instructions">
                            {this.props.TaskActivityFields[index].instructions}
                        </div>
                    </div>
                );
            }

            if(this.props.TaskActivityFields[index].justification_instructions !== ''){
                justificationInstructions = (<div>
                    <div className=".template-field-justification-instructions-label-label">{fieldTitleText} {this.props.Strings.JustificationInstructions}</div>

                    <MarkupText className="regular-text" content={this.props.TaskActivityFields[index].justification_instructions}/>
                </div>);
            }


            return (<div>
                <div className="template-field-title">{fieldTitle}</div>
                {fieldInstructions}
                {fieldRubric}

                <br />
                <VersionView Versions={this.props.TaskData} Field={this.props.TaskActivityFields[index]} FieldIndex={index} Strings={this.props.Strings} />
            </div>);
        }, this);

        content = (
            <div key={this.props.index + 2003} className="section-content">
                {TA_instructions}
                {TA_rubric}
                <FileLinksComponent Files={this.props.Files} />
                {fields}
                <br key={this.props.index + 2005} />
            </div>);

        return (
          <div key={this.props.index + 2001} className="section card-2" style={{marginLeft: this.props.margin}}>
            {!this.props.oneBox &&
            (<div>
              <h2 key={this.props.index + 2002}className="title" onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}</h2>
              <CommentInfoComponent
                TargetID = {this.props.TaskID}
                Target = {'TaskInstance'}
                ComponentTitle = {this.props.ComponentTitle}
                showComments = {this.props.showComments}
              />
             </div>)}
            {content}
          </div>
        );
    }
}

SuperViewComponent.propTypes = {
    TaskActivityFields: PropTypes.object.isRequired,
    TaskData: PropTypes.object.isRequired,
    Strings: PropTypes.object.isRequired,
    ComponentTitle: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    Instructions: PropTypes.string.isRequired,
    Rubric: PropTypes.string.isRequired,
};
export default SuperViewComponent;
