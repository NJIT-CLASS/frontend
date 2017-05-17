/* This component will hold the user-made problem.
*  This component is non interactive, so it is only used to display the responses
*  of previous tasks.
*/
import React from 'react';
import PropTypes from 'prop-types';
import MarkupText from '../shared/markupTextView';
import ErrorComponent from './errorComponent';
import VersionView from './individualFieldVersionsComponent';

class SuperViewComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ShowContent: true,
            TaskData: {},
            ShowRubric: false,
            FieldRubrics: [],
            Ready: false,
            Error: false,
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


        if (!this.state.ShowContent) { // if the title is clicked on, this will be false and the content won't be shown
            return (<div key={this.props.index + 2001}className="section card-2" >
              <h2 key={this.props.index + 2002}className="title" onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}</h2>
            </div>);
        }

        if (this.props.Rubric !== '' && this.props.Rubric !== null) { // if no Rubric, don't show it
            let TA_rubric_content = null;
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
              <button type="button" className="in-line" onClick={this.toggleRubric.bind(this)} key={'button'}> {TA_rubricButtonText}</button>
              <ReactCSSTransitionGroup transitionEnterTimeout={500} transitionLeaveTimeout={300} transitionName="example" transitionAppear={false} transitionEnter transitionLeave>
                {TA_rubric_content}
              </ReactCSSTransitionGroup>
            </div>);
        }

        if (this.props.Instructions != null && this.props.Instructions !== '') {
            TA_instructions = (
              <div >
                <div className="boldfaces">{this.props.Strings.TaskInstructions}</div>
                  <MarkupText classNames="regular-text" content={this.props.Instructions} />
                </div>);
        }


        console.log(this.props.TaskActivityFields, this.props.TaskData);
        const fields = this.props.TaskActivityFields.field_titles.map((field, index) => {
            let fieldTitle = '';
            let fieldTitleText = '';
            if (this.props.TaskActivityFields[index].show_title) { // shoudl the title be displayed or not
                if (this.props.TaskActivityFields[index].assessment_type != null) { // add "Grade" to assess fields to make pretty
                    fieldTitleText = `${field} ${this.props.Strings.Grade}`;
                } else {
                    fieldTitleText = field;
                }

                fieldTitle = (<div>
                  <br />
                  <div key={index + 600}>{fieldTitleText}</div>
                </div>);
            }
            return (<div>
              <b>{fieldTitle}</b>
              <br />
              <VersionView Versions={this.props.TaskData} Field={this.props.TaskActivityFields[index]} FieldIndex={index} Strings={this.props.Strings} />
            </div>);
        }, this);

        content = (
          <div key={this.props.index + 2003} className="section-content">
            {TA_instructions}
            {TA_rubric}
            {fields}
            <br key={this.props.index + 2005} />
          </div>);

        return (
          <div key={this.props.index + 2001}className="section card-2" >
            <h2 key={this.props.index + 2002}className="title" onClick={this.toggleContent.bind(this)}>{this.props.ComponentTitle}</h2>
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
