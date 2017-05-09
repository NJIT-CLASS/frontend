/* This component will hold the user-made problem.
*  This component is non interactive, so it is only used to display the responses
*  of previous tasks.
*/
import React from 'react';
import PropTypes from 'prop-types';
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
            TaskActivityFields: {},
            Error: false,
        };
    }

    componentWillMount() {
        const tdata = this.props.TaskData;
        let tAdata = this.props.TaskActivityFields;
        console.log('Data in Component', tdata);
        if (!tdata || tdata.length === 0 || !tAdata || tAdata === '{}') {
        // this checks to make sure all the necessary data isn't empty. If it is,
        // it will cause errors, so set the Error state to true to prevent rendering
            this.setState({ Error: true });
            return;
        }

        // Sometimes, the data isn't parsed, so it needs to be parsed
        if (tAdata.constructor !== Object) {
            tAdata = JSON.parse(this.props.TaskActivityFields);
        }


        for (let i = 0; i < tAdata.number_of_fields; i += 1) {
            for (let j = 0; j < tdata.length; j += 1) {
                if (tdata[j][i] == null) {
                  // make sure that the number of fields in the Task matches the
                  //  number of fields in the Task Activity
                    this.setState({ Error: true });
                    return;
                }
            }
        }
        this.setState({
            TaskData: tdata,
            TaskActivityFields: tAdata,
        });
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

        if (this.state.Error) { // if there was an error loading the data, show an Error component
            return (<ErrorComponent />);
        }

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
                    <div className="boldfaces">{this.props.Strings.TaskRubric}</div><div className="regular-text rubric" key={'rubric'} dangerouslySetInnerHTML={{ __html: this.props.Rubric }} />
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
                <div className="boldfaces">{this.props.Strings.TaskInstructions}</div><div className="regular-text instructions" dangerouslySetInnerHTML={{ __html: this.props.Instructions }} />
              </div>);
        }

        console.log(this.state.TaskData);

        const fields = this.state.TaskActivityFields.field_titles.map((field, index) => {
            let fieldTitle = '';
            let fieldTitleText = '';
            if (this.state.TaskActivityFields[index].show_title) { // shoudl the title be displayed or not
                if (this.state.TaskActivityFields[index].assessment_type != null) { // add "Grade" to assess fields to make pretty
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
              <VersionView Versions={this.state.TaskData} Field={this.state.TaskActivityFields[index]} FieldIndex={index} Strings={this.props.Strings} />
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
