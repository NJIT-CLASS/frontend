import React from 'react';
import Select from 'react-select';

const moment = require('moment');
import Checkbox from '../shared/checkbox';
import NumberField from '../shared/numberField';
import ToggleSwitch from '../shared/toggleSwitch';
import { TASK_TYPES, TASK_TYPES_TEXT } from '../../server/utils/react_constants';
import { RadioGroup, Radio } from 'react-radio-group';
import Tooltip from '../shared/tooltip';
import Rater from 'react-rater';
import ReactTooltip from 'react-tooltip';
import TaskDisplayName from './taskComponents/taskDisplayName';
import AllowAssessmentComponent from './taskComponents/allowAssessmentComponent';

class TaskDetailsComponent extends React.Component {

    // PROPS:
    //  - all the methods
    //  - index, TaskActivityData, Opened

    constructor(props) {
        super(props);

        this.state = {
            FileUp: false,
            NewTask: true,
            FieldType: 'text',
            Tasks: [
                {
                    AtDurationEnd: '',
                    WhatIfLate: '',
                    Reflection: ['none', null],
                },
            ],
            SimpleGradePointReduction: 0,
            CurrentFieldSelection: null,
            GradingThreshold: [
                '', '',
            ],
            DefaultFieldForeign: [false], // will be true if want to show Def Content from other tasks
            CurrentTaskFieldSelection: null,
            ShowAssigneeConstraintSections: [
                false, false, false, false,
            ], // same as, in same group as, not in, choose from
            ShowAdvanced: false,
            ShowContent: !!this.props.isOpen,
            ShowUserFields: true,
        };

        this.callTaskFunction = this.props.callTaskFunction.bind(this);
        this.toggleAdvanced = this.toggleAdvanced.bind(this);
        this.toggleUserFields = this.toggleUserFields.bind(this);
    }

    isAssigneeConstraintChecked(constraint, taskID) {
        const constraintArray = this.props.TaskActivityData.TA_assignee_constraints[2];

        if (constraintArray === undefined || constraintArray[constraint] === undefined) {
            return false;
        }
        return !!constraintArray[constraint].includes(taskID);
    }

    doesTaskHaveAssessmentFields() {
        let hasAssessment = false;
        this.props.TaskActivityData.TA_fields.field_titles.forEach((field, index) => {
            if (this.props.TaskActivityData.TA_fields[index].field_type == 'assessment' || this.props.TaskActivityData.TA_fields[index].assessment_type == 'self assessment') {
                hasAssessment = true;
            }
        });
        return hasAssessment;
    }
    showAssigneeSection(key) {
        if (this.props.TaskActivityData.TA_assignee_constraints[2][key] === undefined) {
            return false;
        }
        return true;
    }

    toggleUserFields(){
        this.setState({
            ShowUserFields: !this.state.ShowUserFields
        });
    }
    toggleAdvanced(){
        this.setState({
            ShowAdvanced: !this.state.ShowAdvanced
        });
    }
    render() {
        const strings = this.props.Strings;
        const fieldTypeValues = [{ value: 'text', label: strings.TextInput }, { value: 'numeric', label: strings.Numeric }, { value: 'assessment', label: strings.Assessment }, { value: 'self assessment', label: strings.SelfAssessment }];
        const assessmentTypeValues = [{ value: 'grade', label: strings.NumericGrade }, { value: 'rating', label: strings.Rating }, { value: 'pass', label: strings.PassFail }, { value: 'evaluation', label: strings.EvaluationByLabels }];
        const onTaskEndValues = [{ value: 'late', label: strings.Late }, { value: 'resolved', label: strings.Resolved }, { value: 'abandon', label: strings.Abandon }, { value: 'complete', label: strings.Complete }];
        const onLateValues = [{ value: 'keep_same_participant', label: strings.KeepSameParticipant }, { value: 'allocate_new_participant_from_contigency_pool', label: strings.AllocateNewParticipant }, { value: 'allocate_to_instructor', label: strings.AllocateToInstructor }, { value: 'allocate_to different_person_in_same_group', label: strings.AllocateToDifferentGroupMember }, {value: 'allocate_new_participant_extra_credit', label: strings.AllocateExtraCredit}];
        const reflectionValues = [{ value: 'edit', label: strings.Edit }, { value: 'comment', label: strings.CommentText }];
        const assessmentValues = [{ value: 'grade', label: strings.Grade }, { value: 'critique', label: strings.Critique }];
        const assigneeWhoValues = [{ value: 'student', label: strings.Student }, { value: 'instructor', label: strings.Instructor }, { value: 'both', label: strings.BothInstructorStudents }];
        const consolidationTypeValues = [{ value: 'max', label: strings.Max }, { value: 'min', label: strings.Min }, { value: 'avg', label: strings.Average }, { value: 'other', label: strings.Other }];
        const versionEvaluationValues = [{ value: 'first', label: strings.First }, { value: 'last', label: strings.Last }, { value: 'whole', label: strings.WholeProcess }];
        const reflectWaitValues = [{value: 'wait', label: 'Wait'},{ value: 'don\'t wait', label: 'Don\'t Wait'}];

        const title = this.props.TaskActivityData.TA_display_name;

        if (!this.props.isOpen) {
            return (
                <div className="section card-1" key={`Mini View of Task ${this.props.index}`}>
                    <h2 className="title" onClick={this.props.changeSelectedTask.bind(this, this.props.index)}>{title}</h2>
                </div>
            );
        }

        const taskCreatedList = this.props.callTaskFunction('getAlreadyCreatedTasks', this.props.index, this.props.workflowIndex);
        const simpleGradeOptionsView = null;

        // assignee constraint views
        const sameAsOptions = null;
        const inSameGroupAsOptions = null;
        const notInOptions = null;
        const chooseFromOptions = null;
        const assigneeRelations = null;

        // TA_display_name
        const displayName = (
            <TaskDisplayName workflowIndex={this.props.workflowIndex} 
                index={this.props.index}
                value={this.props.TaskActivityData.TA_display_name}
                strings={strings} 
                callTaskFunction={this.callTaskFunction}
            />
            
        );

        // TA_file_upload
        const fileUploadOptions = this.state.FileUp
            ? (
                <div
                    style={{
                        display: 'inline-block',
                    }}
                >
                    <div className="inner">
                        <label>
                            {strings.HowManyRequiredFiles}</label>
                        <Tooltip Text={strings.TaskRequiredFilesMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-required-files-tooltip`} />

                        <br />
                        <NumberField min={0} max={10} onChange={this.props.callTaskFunction.bind(this, 'changeFileUpload', 'mandatory', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_file_upload.mandatory} />
                    </div>
                    <div className="inner">
                        <label>
                            {strings.MaximumNumberOfOptionalFiles}
                        </label>
                        <Tooltip Text={strings.TaskOptionalFilesMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-optional-files-tooltip`} />

                        <br />
                        <NumberField min={0} max={10} onChange={this.props.callTaskFunction.bind(this, 'changeFileUpload', 'optional', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_file_upload.optional} />

                    </div>
                </div>
            )
            : null;
        const fileUploads = (
            <div className="inner">
                <label>{strings.AreAnyFileUploadsRequired}</label>
                <Checkbox
                    isClicked={this.state.FileUp} click={() => {
                        this.setState({
                            FileUp: !this.state.FileUp,
                        });
                    }}
                /> {fileUploadOptions}
            </div>
        );

        // TA_overall_instructions
        const taskInstructions = (
            <div className="inner block">
                <label>{strings.TaskInstructions}</label>
                <Tooltip Text={strings.TaskInstructionsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-instructions-message-tooltip`} />

                <textarea className="big-text-field" placeholder={`${strings.TypeInstructionsHere}...`} onChange={this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_overall_instructions', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_overall_instructions} />
            </div>

        );

        // TA_overall_rubric
        const taskRubric = (
            <div className="inner block">
                <label>{strings.TaskRubric}</label>
                <Tooltip Text={strings.TaskRubricMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-rubric-tooltip`} />
                <textarea className="big-text-field" placeholder={`${strings.TypeRubricHere}...`} onChange={this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_overall_rubric', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_overall_rubric} />
            </div>
        );

        // inputFields

        const inputFields = this.props.TaskActivityData.TA_fields.field_titles.map(function (field, index) {
            let assessmentTypeView = null; // options that change on assessment type selection
            let defaultContentView = null;
            const showDefaultFromOthers = taskCreatedList.length > 0;
            let defaultContentButton = null;

            const justificationView = (this.props.TaskActivityData.TA_fields[index].requires_justification)
                ? (
                    <div className="inner block" key={index + 200}>
                        <label>{strings.FieldJustificationInstructions}</label>
                        <Tooltip Text={strings.TaskFieldJustificationInstructionsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-justififcation-instructions-message-tooltip`} />
                        <textarea className="big-text-field" placeholder={`${strings.TypeJustificationInstructions}...`} value={this.props.TaskActivityData.TA_fields[index].justification_instructions} onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'justification_instructions', this.props.index, index, this.props.workflowIndex)} />
                    </div>
                )
                : null; // justification textbox for the field

            let fieldTypeOptions = null; // options that change on Field Type dropbox selection

            if (this.props.TaskActivityData.TA_fields[index].field_type == 'numeric') {
                fieldTypeOptions = (
                    <div>
                        <label>{strings.Min}</label>
                        <NumberField min={0} max={100} value={this.props.TaskActivityData.TA_fields[index].numeric_min} onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_min', this.props.index, index, this.props.workflowIndex)} />
                        <br />
                        <label>{strings.Max}</label>
                        <NumberField value={this.props.TaskActivityData.TA_fields[index].numeric_max} min={0} max={100} onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_max', this.props.index, index, this.props.workflowIndex)} />
                    </div>
                );
            } else if (this.props.TaskActivityData.TA_fields[index].field_type == 'assessment' || this.props.TaskActivityData.TA_fields[index].field_type == 'self assessment') {
                if (this.props.TaskActivityData.TA_fields[index].assessment_type == 'grade') {
                    assessmentTypeView = (
                        <div>
                            <label>{strings.Min}</label>
                            <NumberField min={0} max={100} value={this.props.TaskActivityData.TA_fields[index].numeric_min} onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_min', this.props.index, index, this.props.workflowIndex)} />
                            <label>{strings.Max}</label>
                            <NumberField value={this.props.TaskActivityData.TA_fields[index].numeric_max} min={-100} max={100} onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'numeric_max', this.props.index, index, this.props.workflowIndex)} />
                        </div>
                    );
                } else if (this.props.TaskActivityData.TA_fields[index].assessment_type === 'rating') {
                    assessmentTypeView = (<div>
                        <label>{strings.MaxRatingLabel}</label>
                        <NumberField
                            value={this.props.TaskActivityData.TA_fields[index].rating_max} min={-100} max={100} onChange={this.props.callTaskFunction.bind(this, 'changeNumericFieldData', 'rating_max', this.props.index, index, this.props.workflowIndex)}
                        />
                    </div>);
                } else if (this.props.TaskActivityData.TA_fields[index].assessment_type === 'evaluation') {
                    assessmentTypeView = (<div>
                        <label>{strings.EvaluationByLabelsLabel}</label><br/>
                        <Tooltip Text={strings.TaskFieldEvalByLabelsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-field-eval-by-labels-tooltip`} />

                        <input type="text" value={this.props.TaskActivityData.TA_fields[index].list_of_labels.join(',')} onChange={this.props.callTaskFunction.bind(this, 'setEvaluationByLabels', this.props.index, index, this.props.workflowIndex)}></input>
                    </div>);
                }

                fieldTypeOptions = (
                    <div>
                        <label>{strings.AssessmentType}</label>
                        <Tooltip Text={strings.TaskAssessmentTypeMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-assessment-type-tooltip`} />

                        <br />
                        <Select key={index + 300} options={assessmentTypeValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownFieldData', 'assessment_type', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].assessment_type} searchable={false} clearable={false} />
                        <br /> {assessmentTypeView}
                    </div>
                );
            }
            // Default Content from Other Tasks Logic
            if (showDefaultFromOthers) {

                const fieldSelectionList = this.props.callTaskFunction('getTaskFields', this.state.CurrentTaskFieldSelection, this.props.workflowIndex).map(field => (
                    <label>
                        {field.label}
                        <Radio value={field.value} />
                    </label>
                ));
                const fieldSelection = (
                    <RadioGroup
                        selectedValue={this.state.CurrentFieldSelection} key={`taskFieldDefault${1}`} onChange={(value) => {
                            this.setState({ CurrentFieldSelection: value });
                            this.props.callTaskFunction('setDefaultField', 1, index, this.props.index, this.props.workflowIndex, value);
                        }}
                    >
                        {fieldSelectionList}
                    </RadioGroup>
                );

                const defaultContentWrapper = (
                    <div>
                        <RadioGroup
                            key={`taskFieldDefault${2}`} selectedValue={this.state.CurrentTaskFieldSelection} onChange={(value) => {
                                this.setState({ CurrentTaskFieldSelection: value });
                                //this.props.callTaskFunction('setDefaultField', 0, index, this.props.index, this.props.workflowIndex, value);
                            }}
                        >
                            {taskCreatedList.map(task => (
                                <label>
                                    {task.label}<Radio value={task.value} /></label>
                            ), this)
                            }
                        </RadioGroup>
                    </div>
                );
                if (this.state.DefaultFieldForeign[index]) {
                    defaultContentView = (
                        <div className="inner block">
                            <label>{strings.DefaultContentFromOtherTasks}</label>
                            <Tooltip Text={strings.TaskDefaultFieldContentFromOthersMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-default-content-from-others-tooltip`} />

                            {defaultContentWrapper}
                            {fieldSelection}
                        </div>
                    );
                }
                else{
                    defaultContentView = (
                        <div className="inner block">
                            <label>{strings.DefaultContentForField}</label>
                            <Tooltip Text={strings.TaskDefaultFieldContentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-default-content-tooltip`} />

                            <textarea className="big-text-field" placeholder="Default content for the field..." onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].default_content[0]} />
                        </div>
                    );
                }

                defaultContentButton = (
                    <div
                        style={{
                            display: 'inline',
                        }}
                    >
                        <label>{strings.GetDataFromAnotherTaskInstead}</label>
                        <Tooltip Text={strings.TaskGetFieldContentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-get-field-content-tooltip`} />

                        <Checkbox
                            isClicked={this.state.DefaultFieldForeign[index]} click={() => {
                                const newData = this.state.DefaultFieldForeign;
                                newData[index] = !newData[index];
                                this.setState({ DefaultFieldForeign: newData });
                            }}
                        />

                    </div>
                );
            } else {
                //change default content view by assessment type
                if(this.props.TaskActivityData.TA_fields[index].field_type === 'assessment' || this.props.TaskActivityData.TA_fields[index].field_type === 'self assessment' ){
                    switch(this.props.TaskActivityData.TA_fields[index].assessment_type){

                    case 'grade':
                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <Tooltip Text={strings.TaskDefaultFieldContentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-default-content-tooltip`} />
                                <input type="number" className="number-input" placeholder="" onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].default_content[0]} />
                            </div>
                        );
                        break;
                    case 'rating':
                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <Tooltip Text={strings.TaskDefaultFieldContentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-default-content-tooltip`} />

                                <Rater total={this.props.TaskActivityData.TA_fields[index].rating_max} rating={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    onRate={(val) => {
                                        this.props.callTaskFunction('changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex, val.rating);
                                    }}/>
                            </div>
                        );
                        break;
                    case 'evaluation':
                        let labels = this.props.TaskActivityData.TA_fields[index].list_of_labels;
                        if (typeof labels === 'string') {
                            labels = labels.split(',');
                        }
                        labels = labels.map(label => {
                            return {value: label, label: label};
                        });

                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <Tooltip Text={strings.TaskDefaultFieldContentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-default-content-tooltip`} />
                                <Select
                                    key={idx + 1000}
                                    options={labels}
                                    selectedValue={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    value={this.props.TaskActivityData.TA_fields[index].default_content[0]}
                                    onChange={(val) => {
                                        this.props.callTaskFunction('changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex, val.value);
                                    }}
                                    clearable={false}
                                    searchable={false}
                                />
                            </div>
                        );
                        break;
                    case 'pass':
                        defaultContentView = (<div className="true-checkbox">
                            <RadioGroup
                                selectedValue={this.props.TaskActivityData.TA_fields[index].default_content[0]} 
                                onChange={(val) => {
                                    this.props.callTaskFunction('changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex, val);
                                }}
                            >
                                <label>{strings.Pass} <Radio value={'pass'} /> </label>
                                <label>{strings.Fail} <Radio value={'fail'} /> </label>

                            </RadioGroup>
                        </div>);
                        break;
                    default:
                        defaultContentView = (
                            <div className="inner block">
                                <label>{strings.DefaultContentForField}</label>
                                <Tooltip Text={strings.TaskDefaultFieldContentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-default-content-tooltip`} />
                                <textarea className="big-text-field" placeholder="Default content for the field..." onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].default_content[0]} />
                            </div>
                        );
                        break;
                    }
                } else {
                    defaultContentView = (
                        <div className="inner block">
                            <label>{strings.DefaultContentForField}</label>
                            <Tooltip Text={strings.TaskDefaultFieldContentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-default-content-tooltip`} />

                            <textarea className="big-text-field" placeholder="Default content for the field..." onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].default_content[0]} />
                        </div>
                    );
                }
				  }

            let removeButtonView = null;
            if (index != 0) {
                removeButtonView = (<div className="remove-button" onClick={this.props.callTaskFunction.bind(this, 'removeFieldButton', this.props.index, this.props.workflowIndex, index)}>
                    <i className="fa fa-remove" aria-hidden="true" data-for="remove-icon" data-tip={strings.RemoveButtonTip} />
                    <ReactTooltip id="remove-icon" effect="solid" />
                </div>);
            }

            return (
                <div
                    className="section-divider" key={`Task ${this.props.index} of Workflow
                  ${this.props.workflowIndex} Field ${index}`}
                >
                    <h3 className="subheading">{this.props.TaskActivityData.TA_fields[index].title}
                        {removeButtonView}
                    </h3>

                    <div className="inner">
                        <label>{strings.FieldName}</label>
                        <br />
                        <input type="text" placeholder="Field Name" value={this.props.TaskActivityData.TA_fields[index].title} onChange={this.props.callTaskFunction.bind(this, 'changeFieldName', this.props.index, index, this.props.workflowIndex)} />
                    </div>

                    <div className="inner">
                        <label>
                            {strings.ShowThisName}?
                        </label>
                        <Tooltip Text={strings.TaskShowFieldNameMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-show-field-name-tooltip`} />
                        <br />
                        <Checkbox isClicked={this.props.TaskActivityData.TA_fields[index].show_title} click={this.props.callTaskFunction.bind(this, 'changeFieldCheck', 'show_title', this.props.index, index, this.props.workflowIndex)} />
                    </div>

                    <div className="inner">
                        <label>{strings.FieldType}</label>
                        <Tooltip Text={strings.TaskFieldTypeMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-field-type-tooltip`} />

                        <br />

                        <Select key={index} options={fieldTypeValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownFieldData', 'field_type', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].field_type} clearable={false} searchable={false} />
                        <br /> {fieldTypeOptions}
                    </div>

                    <div className="inner">
                        <label>{strings.RequiresJustification} ?</label>
                        <Tooltip Text={strings.TaskRequiresJustificationMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-requires-justification-tooltip`} />
                        <br />
                        <Checkbox click={this.props.callTaskFunction.bind(this, 'changeFieldCheck', 'requires_justification', this.props.index, index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_fields[index].requires_justification} />
                    </div>

                    <div className="inner block">
                        <label>{strings.FieldInstructions} ({strings.Optional})</label>
                        <Tooltip Text={strings.TaskFieldInstructionsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-field-instructions-tooltip`} />

                        <textarea className="big-text-field" placeholder={`${strings.TypeInstructionsHere}...`} onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'instructions', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].instructions} />
                    </div>

                    <div className="inner block">
                        <label>{strings.FieldRubric}</label>
                        <Tooltip Text={strings.TaskFieldRubricMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-F${index}-tooltip`} />

                        <textarea className="big-text-field" placeholder={`${strings.TypeRubricHere}...`} onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'rubric', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].rubric} />
                    </div>

                    {justificationView}
                    <br /> {defaultContentView}
                    {defaultContentButton}

                    <br />
                    <br />
                </div>
            );
        }, this);

        const fieldButton = (
            <div className="section-button-area">
                <button
                    type="button" className="divider" onClick={() => {
                        this.props.callTaskFunction('addFieldButton', this.props.index, this.props.workflowIndex);
                        const newDefFields = this.state.DefaultFieldForeign;
                        newDefFields.push(false);
                        this.setState({ DefaultFieldForeign: newDefFields });
                    }}
                >
                    <i className="fa fa-check" />
                    {strings.AddAnotherField}
                </button>
            </div>
        );

        const toggleView = (
            <div className="section-button-area">
                <label
                    style={{
                        display: 'inline-block'
                    }}
                >{strings.ShowAdvancedOptions}?</label>
                <br />
                <ToggleSwitch
                    isClicked={this.state.ShowAdvanced} click={() => {
                        this.setState({
                            ShowAdvanced: !this.state.ShowAdvanced,
                        });
                    }}
                />
            </div>
        );

        let advancedOptionsView = (
            <div key={`Advanced Task-level Parameters for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                <h2 className="title" onClick={this.toggleAdvanced}>{strings.AdvancedTaskParamHeader}</h2>
            </div>);
        if (this.state.ShowAdvanced) {
            const dueType = (
                <div className="inner">

                    <label>{strings.DefaultTaskDuration}</label>
                    <NumberField label={strings.Days} value={this.props.TaskActivityData.TA_due_type[1] / 1440} min={0} max={200} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_due_type', this.props.index, this.props.workflowIndex)} />
                               
                    <label>{strings.ShouldTaskEndAtCertainTime}</label>
                    <Tooltip Text={strings.TaskDueTypeMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-due-type-tooltip`} />

                    <br />
                    <RadioGroup selectedValue={this.props.TaskActivityData.TA_due_type[0]} onChange={this.props.callTaskFunction.bind(this, 'changeRadioData', 'TA_due_type', this.props.index, this.props.workflowIndex)}>
                        <label>
                            <Radio value="duration" />
                            {strings.ExpireAfter}
                        </label>
                        <label><Radio value="specific time" />{strings.EndAtThisTime}</label>

                    </RadioGroup>
                </div>
            );

            const startDelay = (
                <div className="inner">
                    <label>{strings.DelayBeforeStartingTask}</label>
                    <Tooltip Text={strings.TaskDelayBeforeStartingMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-delay-before-starting-tooltip`} />

                    <br />
                    <RadioGroup selectedValue={this.props.TaskActivityData.StartDelay} onChange={this.props.callTaskFunction.bind(this, 'changeRadioData', 'StartDelay', this.props.index, this.props.workflowIndex)}>
                        <label>
                            <Radio value={false} />{strings.StartWhenPriorTaskIsComplete}</label><br />
                        <label>
                            <Radio value />{strings.StartAfterPriorTaskEndsBy}</label>
                    </RadioGroup>
                    <NumberField label={strings.Days} value={this.props.TaskActivityData.TA_start_delay} min={0} max={60} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_start_delay', this.props.index, this.props.workflowIndex)} />
                </div>

            );

            const oneOrSeparate = this.props.index == 0 ? (
                <div className="inner">
                    <label>{strings.DoesEveryoneGetSameProblem}</label>
                    <Tooltip Text={strings.TaskOneOrSeparateMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-one-or-separate-tooltip`} />

                    <br />
                    <RadioGroup selectedValue={this.props.TaskActivityData.TA_one_or_separate} onChange={this.props.callTaskFunction.bind(this, 'changeRadioData', 'TA_one_or_separate', this.props.index, this.props.workflowIndex)}>
                        <label><Radio value={false} />
                            {strings.No}</label>
                        <label><Radio value />
                            {strings.Yes}</label>
                    </RadioGroup>
                </div>
            ) : null;

            const seeSameActivity = (
                <div className="inner">
                    <label>{strings.SeeSameActivity}</label>
                    <Tooltip Text={strings.TaskSeeSameActivityMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-see-same-activity-tooltip`} />

                    <Checkbox isClicked={this.props.TaskActivityData.SeeSameActivity} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'SeeSameActivity', this.props.index, this.props.workflowIndex)} />
                </div>
            );

            const atDurationEnd = (
                <div className="inner">
                    <label>{strings.WhatHappensWhenTaskEnds}</label>
                    <Tooltip Text={strings.TaskAtDurationEndMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-at-duration-end-tooltip`} />

                    <br />
                    <Select value={this.props.TaskActivityData.TA_at_duration_end} options={onTaskEndValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_at_duration_end', this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                </div>
            );

            const whatIfLate = this.props.TaskActivityData.TA_at_duration_end === 'late'
                ? (
                    <div className="inner">
                        <label>
                            {strings.WhatIfLate}</label>
                        <Tooltip Text={strings.TaskWhatIfLateMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-what-if-late-tooltip`} />

                        <Select options={onLateValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_what_if_late', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_what_if_late} clearable={false} searchable={false} autoBlur />
                    </div>
                )
                : null;

            const simpleGradeOptions = this.props.TaskActivityData.TA_simple_grade !== 'none'
                ? (
                    <div>
                        <label>{strings.ReduceByWhatPercent}</label><br />
                        <NumberField value={this.props.TaskActivityData.SimpleGradePointReduction} min={0} max={100} onChange={this.props.callTaskFunction.bind(this, 'changeTASimpleGradePoints', this.props.index, this.props.workflowIndex)} />
                        <br />
                        <label>{strings.NoPointsIfLate}</label>
                        <Checkbox click={this.props.callTaskFunction.bind(this, 'changeTASimpleGradeCheck', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_simple_grade == 'off_per_day(100)'} />
                    </div>
                )
                : null;
            const simpleGrade = (
                <div className="inner">
                    <label>{strings.AwardPointsForDoing}</label>
                    <Tooltip Text={strings.TaskSimpleGradeMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-simple-grade-tooltip`} />

                    <Checkbox click={this.props.callTaskFunction.bind(this, 'changeSimpleGradeCheck', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_simple_grade != 'none'} />
                    <br /> {simpleGradeOptions}
                </div>
            );

            // TA_allow_assessment
            let allowAssesmentOptions = null;
            let assessShowDispute = null;
            let assessConsolidateOptions = null;
            let assessShowConsol = null;
            let assessConstraint = null;
            let numberOfAssessView = null;
            if (this.props.TaskActivityData.TA_allow_assessment !== 'none') {
                assessShowDispute = (
                    <div>
                        <label>
                            {strings.CanStudentsDisputeAssessment}
                        </label>

                        <Tooltip Text={strings.TaskCanDisputeMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-dispute-tooltip`} />

                        <Checkbox isClicked={this.props.callTaskFunction('canDispute', this.props.index, this.props.workflowIndex, false)} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Dispute', this.props.index, this.props.workflowIndex)} />
                    </div>
                );
                assessConsolidateOptions = this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)
                    ? (
                        <div>
                            <label>{strings.GradingThreshold}</label>
                            <Tooltip Text={strings.TaskConsolidateThresholdMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-grading-threshold-tooltip`} />

                            <br />
                            <RadioGroup
                                selectedValue={this.props.callTaskFunction('getTriggerConsolidationRadioOption', this.props.index, this.props.workflowIndex, false)} onChange={(val) => {
                                    this.props.callTaskFunction('changeRadioData', 'TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex, val);
                                    const newGrades = this.state.GradingThreshold;
                                    newGrades[1] = val;
                                    this.setState({ GradingThreshold: newGrades });
                                }}
                            >
                                <label>
                                    {strings.Points}
                                    <Radio value="points" />
                                </label>
                                <label>
                                    {strings.Percent}
                                    <Radio value="percent" />
                                </label>

                            </RadioGroup>
                            <br />
                            <NumberField value={this.props.callTaskFunction('getTriggerConsolidationThreshold', this.props.index, this.props.workflowIndex, false)} min={0} max={100} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex)} size={6} />
                            <br />
                            <label>{strings.ToBeConsolidatedAssessment}</label>
                            <Tooltip Text={strings.TaskConsolidateFunctionMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-consolidation-function-tooltip`} />

                            <Select options={consolidationTypeValues} value={this.props.callTaskFunction('getConsolidateValue', this.props.index, this.props.workflowIndex, true)} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_function_type_Assess', this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                        </div>
                    )
                    : null;
                assessShowConsol = this.props.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex) > 1
                    ? (
                        <div>
                            <label>{strings.ShouldAssessmentsBeConsolidated}</label>
                            <Tooltip Text={strings.TaskCanConsolidateMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-can-consolidate-tooltip`} />

                            <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Consolidate', this.props.index, this.props.workflowIndex)} isClicked={this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)} />
                            <br /> 
                            {assessConsolidateOptions}
                            <div>
                                <label>{strings.SeeSibblingsInParent}</label>
                                <Tooltip Text={strings.TaskSeeSibblingsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-see-sibblings-tooltip`} />
                                <Checkbox
                                    click={this.props.callTaskFunction.bind(this, 'setSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                                    isClicked={this.props.callTaskFunction('getSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                                />
                            </div>
                        </div>
                    )
                    : null;
                assessConstraint = this.props.callTaskFunction('getAssigneeInChild', false, this.props.index, this.props.workflowIndex);
                numberOfAssessView = (assessConstraint == 'student' || assessConstraint == 'both')
                    ? (
                        <div>
                            <br />
                            <label>{strings.NumberOfAssessors}</label>
                            <Tooltip Text={strings.TaskAssessmentNumberOfParticipantsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-number-of-participants-tooltip`} />
                            <br />
                            <NumberField value={this.props.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'setAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} />
                            <br />
                            <div className="inner">
                                {assessShowConsol}
                            </div>
                        </div>
                    )
                    : null;
                allowAssesmentOptions = this.props.TaskActivityData.TA_allow_assessment != 'none'
                    ? (
                        <div>
                            
                            <div className="inner">
                                <Select options={assessmentValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_assessment', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_allow_assessment} clearable={false} searchable={false} />
                                <label>{strings.WhoCanAssess}</label>
                                <Tooltip Text={strings.TaskWhoCanAssessMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-who-can-assess-tooltip`} />

                                <br />
                                <Select options={assigneeWhoValues} value={this.props.callTaskFunction('getAssigneeInChild', false, this.props.index, this.props.workflowIndex)} onChange={this.props.callTaskFunction.bind(this, 'changeAssigneeInChild', false, this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                            </div>                            
                            <div>
                                {numberOfAssessView}
                            </div>
                            <br /> 
                            <div className="inner">
                                {assessShowDispute}
                            </div>                            
                        </div>
                    )
                    : null;
            }

            const allowAssessment = (
                <AllowAssessmentComponent TaskActivityData={this.props.TaskActivityData}
                    Strings={strings}
                    index={this.props.index}
                    workflowIndex={this.props.workflowIndex}
                    callTaskFunction={this.callTaskFunction}/>
                    
                
            );


            // TA_allow_reflection
            let allowReflectionOptions = null;
            let numberOfReflectorsView = null;
            let allowRevisionOption = null;
            if (this.props.TaskActivityData.TA_allow_reflection[0] != 'none') {
                const showDispute = this.doesTaskHaveAssessmentFields() ? (
                    <div>
                        <label>
                            {strings.CanStudentsDisputeReflection}
                        </label>
                        <Tooltip Text={strings.TaskCanDisputeMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-reflect-dispute-tooltip`} />

                        <Checkbox isClicked={this.props.callTaskFunction('canDispute', this.props.index, this.props.workflowIndex, true)} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Reflect_Dispute', this.props.index, this.props.workflowIndex)} />
                    </div>
                ) : null;

                const showConsol = this.props.callTaskFunction('getReflectNumberofParticipants', this.props.index, this.props.workflowIndex) > 1
                    ? (
                        <div>
                            <label>{strings.ShouldReflectionsBeConsolidated}</label>
                            <Tooltip Text={strings.TaskCanConsolidateMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-reflect-can-consolidate-tooltip`} />

                            <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Reflect_Consolidate', this.props.index, this.props.workflowIndex)} isClicked={this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, true)} />
                            <br />
                            <div>
                                <label>{strings.SeeSibblingsInParent}</label>
                                <Tooltip Text={strings.TaskSeeSibblingsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-reflect-see-sibblings-tooltip`} />

                                <Checkbox
                                    click={this.props.callTaskFunction.bind(this, 'setSeeSibblings', this.props.index, this.props.workflowIndex, false)}
                                    isClicked={this.props.callTaskFunction('getSeeSibblings', this.props.index, this.props.workflowIndex, false)}
                                />
                            </div>
                        </div>
                    )
                    : null;
                const reflectConstr = this.props.callTaskFunction('getAssigneeInChild', true, this.props.index, this.props.workflowIndex);
                allowRevisionOption = this.props.TaskActivityData.TA_allow_reflection[0] === 'comment' ? (
                    <div>
                        <label>{strings.AllowRevision}</label>
                        <Tooltip Text={strings.TaskAllowRevisionMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-allow-revision-tooltip`} />
                        <Checkbox isClicked={this.props.callTaskFunction('getTaskRevisioninChild', this.props.index, this.props.workflowIndex)} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_revisions-child', this.props.index, this.props.workflowIndex)} />
                    </div> 
                ) : null;
                
                numberOfReflectorsView = (reflectConstr == 'student' || reflectConstr == 'both')
                    ? (
                        <div>
                            <br />
                            <label>{strings.NumberOfStudents}</label>
                            <Tooltip Text={strings.TaskReflectNumberOfParticipantsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-reflect-number-of-participants-tooltip`} />

                            <br />
                            <NumberField value={this.props.callTaskFunction('getReflectNumberofParticipants', this.props.index, this.props.workflowIndex)} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'setReflectNumberofParticipants', this.props.index, this.props.workflowIndex)} />
                            <br /> {showConsol}
                        </div>
                    )
                    : null;
                allowReflectionOptions = (
                    
                    <div className="inner">
                        <Select options={reflectionValues} 
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_reflection', this.props.index, this.props.workflowIndex)}
                            value={this.props.TaskActivityData.TA_allow_reflection[0]} 
                            clearable={false} 
                            searchable={false} />
                        <br />
                        <label>{strings.ShouldReflectBlock}</label><br />
                        <Tooltip Text={strings.TaskShouldReflectBlockMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-should-reflect-wait-tooltip`} />
                        <Select options={reflectWaitValues} 
                            value={this.props.TaskActivityData.TA_allow_reflection[1]}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_reflection_wait', this.props.index, this.props.workflowIndex)}
                            clearable={false} 
                            searchable={false} />
                        <br />
                        <label>{strings.WhoCanReflect}</label>                    
                        <Tooltip Text={strings.TaskWhoCanReflectMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-who-can-reflect-tooltip`} />
                        <Select options={assigneeWhoValues} value={this.props.callTaskFunction('getAssigneeInChild', true, this.props.index, this.props.workflowIndex)} onChange={this.props.callTaskFunction.bind(this, 'changeAssigneeInChild', true, this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                   
                        <br /> {showDispute}
                    </div>
                    
                    
                );
            }

          
            // TA_allow_revisions
            const allowRevision = [/*TASK_TYPES.EDIT,*/ TASK_TYPES.COMMENT].includes(this.props.TaskActivityData.TA_type) ?   (
                <div className="inner">
                    <label>{strings.AllowRevision}</label>
                    <Tooltip Text={strings.TaskAllowRevisionMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-allow-revision-tooltip`} />
                    <Checkbox isClicked={this.props.TaskActivityData.TA_allow_revisions} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_revisions', this.props.index, this.props.workflowIndex)} />
                </div>
            ) : null;
            
            const allowReflection = (
                <div>
                    <div className="inner">
                        <label>{strings.AllowReflection}</label>
                        <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_reflection', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_allow_reflection[0] != 'none'} />
                        <Tooltip Text={strings.TaskAllowReflectionMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-allow-reflection-tooltip`} />
                    </div>
                    {allowReflectionOptions}
                    <div className="inner">
                        {numberOfReflectorsView}
                        {allowRevisionOption}
                    </div>
                </div>
            );

            

            const versionEvaluation = this.props.TaskActivityData.TA_allow_revisions === true ? (
                <div className="inner">
                    <label>{strings.VersionEvaluation}</label>
                    <Tooltip Text={strings.TaskVersionEvaluationMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-version-evaluation-tooltip`} />
                    <Select value={this.props.TaskActivityData.VersionEvaluation} clearable={false} options={versionEvaluationValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'VersionEvaluation', this.props.index, this.props.workflowIndex)} />
                </div>
            ) : null;

            // TA_assignee_constraints
            let assigneeConstraints = null;
            let assigneeRelations = null;
            const firstAssigneeConstr = this.props.TaskActivityData.TA_assignee_constraints[0];
            if (this.props.index != 0) { // if it's the first task or an instructor task, don't show assignee contraint relation part
                if (firstAssigneeConstr != 'instructor') {
                    const sameAsOptions = this.showAssigneeSection('same_as')
                        ? (
                            <div
                                className="checkbox-group inner" style={{
                                    marginLeft: '8px',
                                }}
                            >
                                <label className="faded-message-text">{strings.SameAs}</label>
                          
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div>
                                            <label>{task.label}</label>
                                            <Checkbox isClicked={this.isAssigneeConstraintChecked('same_as', task.value)} click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'same_as', task.value, this.props.workflowIndex)} />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    const inSameGroupAsOptions = this.showAssigneeSection('group_with_member')
                        ? (
                            <div
                                className="checkbox-group inner" style={{
                                    marginLeft: '8px',
                                }}
                            >
                                <label className="faded-message-text">{strings.InSameGroupAs}</label>
                          
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div>
                                            <label>{task.label}</label>
                                            <Checkbox isClicked={this.isAssigneeConstraintChecked('group_with_member', task.value)} click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'group_with_member', task.value, this.props.workflowIndex)} />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    const notInOptions = this.showAssigneeSection('not')
                        ? (
                            <div
                                className="checkbox-group inner" style={{
                                    marginLeft: '8px',
                                    alignContent: 'right',
                                }}
                            >
                                <label className="faded-message-text">{strings.NotIn}</label>
                          
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div className="assignee-contraint-section">
                                            <label>{task.label}</label>
                                            <Checkbox isClicked={this.isAssigneeConstraintChecked('not', task.value)} click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'not', task.value, this.props.workflowIndex)} />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    const chooseFromOptions = this.showAssigneeSection('choose_from')
                        ? (
                            <div
                                className="checkbox-group inner" style={{
                                    marginLeft: '8px',
                                }}
                            >
                                <label className="faded-message-text">{strings.ChooseFrom}</label>
                                {taskCreatedList.map(function (task) {
                                    return (
                                        <div>
                                            <label>{task.label}</label>
                                            <Checkbox isClicked={this.isAssigneeConstraintChecked('choose_from', task.value)} click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraintTasks', this.props.index, 'choose_from', task.value, this.props.workflowIndex)} />
                                        </div>
                                    );
                                }, this)
                                }
                            </div>
                        )
                        : null;
                    assigneeRelations = (
                        <div className="inner">
                            <label>{strings.ShouldAssigneeHaveRelationship}</label>
                            <br />
                            <label>{strings.None}</label>
                            <Tooltip Text={strings.TaskConstraintNoneMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-constraint-none-tooltip`} />

                            <Checkbox
                                click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'none', this.props.workflowIndex)} isClicked={Object.keys(this.props.TaskActivityData.TA_assignee_constraints[2]).length === 0} style={{
                                    marginRight: '8px',
                                }}
                            />
                            <label>{strings.NewToProblem}</label>
                            <Tooltip Text={strings.TaskConstraintNewToProblemMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-constraint-new-to-problem-tooltip`} />

                            <Checkbox
                                click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'not_in_workflow_instance', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].not_in_workflow_instance}
                            />
                            <label>{strings.SameAs}</label>
                            <Tooltip Text={strings.TaskConstraintSameAsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-constraint-same-as-tooltip`} />

                            <Checkbox
                                click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'same_as', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].same_as} style={{
                                    marginRight: '8px',
                                }}
                            />
                            <label>{strings.InSameGroupAs}</label>
                            <Tooltip Text={strings.TaskConstraintInSameGroupAsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-constraint-in-same-group-as-tooltip`} />

                            <Checkbox
                                click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'group_with_member', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].group_with_member} style={{
                                    marginRight: '8px',
                                }}
                            />
                            <label>{strings.NotIn}</label>
                            <Tooltip Text={strings.TaskConstraintNotInMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-constraint-not-in-tooltip`} />

                            <Checkbox
                                click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'not', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].not} style={{
                                    marginRight: '8px',
                                }}
                            />
                            <label>{strings.ChooseFrom}</label>
                            <Tooltip Text={strings.TaskConstraintChooseFromMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-constraint-choose-from-tooltip`} />

                            <Checkbox
                                click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'choose_from', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].choose_from}
                            />
                            <br />
                            {sameAsOptions}
                            {inSameGroupAsOptions}
                            {notInOptions}
                            {chooseFromOptions}
                        </div>
                    );
                }
            }
            const showNumberofStudents = (firstAssigneeConstr == 'student' || firstAssigneeConstr == 'both') ?
                (<div>
                    <label>{strings.HowManyParticipants}</label>
                    <Tooltip Text={strings.TaskNumOfParticipantsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-num-of-participants-tooltip`} />

                    <NumberField value={this.props.TaskActivityData.TA_number_participant} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_number_participant', this.props.index, this.props.workflowIndex)} />
                </div>
                ) : null;
            assigneeConstraints = (
                <div className="inner">
                    <label>{strings.AssigneeConstraints}</label>
                    <Tooltip Text={strings.TaskAssigneeConstraintMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-assignee-constraint-tooltip`} />

                    <br />
                    <label>{strings.WhoCanDoTask}</label>
                    <Tooltip Text={strings.TaskWhoCanDoMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-who-can-do-tooltip`} />

                    <br />
                    <Select options={assigneeWhoValues} value={this.props.TaskActivityData.TA_assignee_constraints[0]} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_assignee_constraints', this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                    {showNumberofStudents}
                    <label>{strings.WillThisBeGroupTask}</label>
                    <Tooltip Text={strings.TaskGroupTaskMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-group-task-tooltip`} />

                    <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_assignee_constraints', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_assignee_constraints[1] == 'group'} />
                    {assigneeRelations}
                </div>
            );

            const seeSibblings = (this.props.TaskActivityData.TA_number_participant > 1) ? (
                <div className="inner">
                    <label>{strings.SeeSibblingsLabel}
                        <Tooltip Text={strings.TaskSeeSibblingsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-see-sibblings-tooltip`} />
                        <Checkbox isClicked={this.props.TaskActivityData.SeeSibblings} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'SeeSibblings', this.props.index, this.props.workflowIndex)} />
                    </label>
                </div>
            ) : null;


            // TA_leads_to_new_problem
            const leadsToNewProblem = (
                <div className="inner">
                    <label>{strings.DoesThisLeadToNewProblem}?</label>
                    <Tooltip Text={strings.TaskLeadsToNewProblemMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-leads-to-new-problem-tooltip`} />

                    <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_leads_to_new_problem', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_leads_to_new_problem} />
                </div>
            );

            // TA_leads_to_new_solution
            const leadsToNewSolution = (
                <div className="inner">
                    <label>{strings.DoesThisLeadToNewSolution}?</label>
                    <Tooltip Text={strings.TaskLeadToNewSolutionMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-leads-to-new-solution-tooltip`} />

                    <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_leads_to_new_solution', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_leads_to_new_solution} />
                </div>
            );

            
            advancedOptionsView = (
                <div key={`Advanced Task-level Parameters for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                    <h2 className="title" onClick={this.toggleAdvanced}>{strings.AdvancedTaskParamHeader}</h2>
                    <div className="section-content">
                        <div className="advanced">
                            <div className="section-divider">
                                <div className="subheading">{strings.TaskDurationHeader}</div>
                                {dueType}
                                {startDelay}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.TaskDueHeader}</div>
                                {atDurationEnd}
                                {whatIfLate}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.AssessmentHeader}</div>
                                {allowAssessment}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.ReflectionHeader}</div>
                                {allowReflection}
                                {allowRevision}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.FollowOnHeader}</div>
                                {leadsToNewProblem}
                                {leadsToNewSolution}
                            </div>
                            <div className="section-divider">
                                <div className="subheading">{strings.AssigneeConstraintHeader}</div>
                                {oneOrSeparate}
                                {seeSameActivity}
                                {simpleGrade}
                                {versionEvaluation}
                                {seeSibblings}
                                {assigneeConstraints}
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
            );
            
            
        }
        const taskLevelParameters = (
            <div key={`Task-level Params for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                <h2 className="title">{strings.TaskHeader}</h2>
                <div className="section-content">
                    {displayName}
                    {fileUploads}
                    {taskInstructions}
                    {taskRubric}
                </div>
            </div>
        );

        let  userInputFields = (
            <div key={`User Input Fields for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                <h2 className="title" onClick={this.toggleUserFields}>{strings.UserFieldHeader}</h2>
            </div>);

        if(this.state.ShowUserFields){
            userInputFields = (
                <div key={`User Input Fields for ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
                    <h2 className="title" onClick={this.toggleUserFields}>{strings.UserFieldHeader}
                        <Tooltip Text={strings.TaskInputFieldsHeaderMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-task-input-fields-header-tooltip`} /> 
                    </h2>
                    <div className="section-content">
                        {inputFields}
                        <div className="inner block" >
                            {fieldButton}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div key={`Main View of Task ${this.props.index} in ${this.props.workflowIndex}`}>
                {taskLevelParameters}
                <br />
                {userInputFields}
                <br/>
                {advancedOptionsView}
            </div>

        );
    }
}

export default TaskDetailsComponent;
