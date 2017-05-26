import React from 'react';
import Select from 'react-select';

const moment = require('moment');
import Checkbox from '../shared/checkbox';
import NumberField from '../shared/numberField';
import ToggleSwitch from '../shared/toggleSwitch';
import { TASK_TYPES, TASK_TYPES_TEXT } from '../../server/utils/react_constants';
import { RadioGroup, Radio } from 'react-radio-group';
import ReactTooltip from 'react-tooltip';

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
        };
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

    render() {
        const strings = this.props.Strings;

        const fieldTypeValues = [{ value: 'text', label: strings.TextInput }, { value: 'numeric', label: strings.Numeric }, { value: 'assessment', label: strings.Assessment }, { value: 'self assessment', label: strings.SelfAssessment }];
        const assessmentTypeValues = [{ value: 'grade', label: strings.NumericGrade }, { value: 'rating', label: strings.Rating }, { value: 'pass', label: strings.PassFail }, { value: 'evaluation', label: strings.EvaluationByLabels }];
        const onTaskEndValues = [{ value: 'late', label: strings.Late }, { value: 'resolved', label: strings.Resolved }, { value: 'abandon', label: strings.Abandon }, { value: 'complete', label: strings.Complete }];
        const onLateValues = [{ value: 'keep_same_participant', label: strings.KeepSameParticipant }, { value: 'allocate_new_participant_from_contigency_pool', label: strings.AllocateNewParticipant }, { value: 'allocate_to_instructor', label: strings.AllocateToInstructor }, { value: 'allocate_to different_person_in_same_group', label: strings.AllocateToDifferentGroupMember }];
        const reflectionValues = [{ value: 'edit', label: strings.Edit }, { value: 'comment', label: strings.CommentText }];
        const assessmentValues = [{ value: 'grade', label: strings.Grade }, { value: 'critique', label: strings.Critique }];
        const assigneeWhoValues = [{ value: 'student', label: strings.Student }, { value: 'instructor', label: strings.Instructor }, { value: 'both', label: strings.BothInstructorStudents }];
        const consolidationTypeValues = [{ value: 'max', label: strings.Max }, { value: 'min', label: strings.Min }, { value: 'avg', label: strings.Average }, { value: 'other', label: strings.Other }];
        const versionEvaluationValues = [{ value: 'first', label: strings.First }, { value: 'last', label: strings.Last }, { value: 'whole', label: strings.WholeProcess }];

        const tooltipMessages = {
            DisplayName: '',
            FileUploads: '',
            TaskInstructions: '',
            TaskRubric: '',
            DueType: '',
            StartDelay: '',
            OneOrSeparate: '',
            SeeSameActivity: '',
            AtDurationEnd: '',
            WhatIfLate: '',
            SimpleGrade:''
        };

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
          <div className="inner">
            <label>{strings.DisplayName}</label>
            <br />
            <input type="text" placeholder={strings.DisplayName} value={this.props.TaskActivityData.TA_display_name} onChange={this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_display_name', this.props.index, this.props.workflowIndex)} /><br />
          </div>
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
                  <br />
                  <NumberField min={0} max={10} onChange={this.props.callTaskFunction.bind(this, 'changeFileUpload', 'mandatory', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_file_upload.mandatory} />
                </div>
                <div className="inner">
                  <label>
                    {strings.MaximumNumberOfOptionalFiles}</label>
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
            <textarea className="big-text-field" placeholder={`${strings.TypeInstructionsHere}...`} onChange={this.props.callTaskFunction.bind(this, 'changeInputData', 'TA_overall_instructions', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_overall_instructions} />
          </div>

        );

        // TA_overall_rubric
        const taskRubric = (
          <div className="inner block">
            <label>{strings.TaskRubric}</label>
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
                    <input type="text" value={this.props.TaskActivityData.TA_fields[index].list_of_labels.join(',')} onChange={this.props.callTaskFunction.bind(this, 'setEvaluationByLabels', this.props.index, index, this.props.workflowIndex)}></input>
                  </div>);
                }

                fieldTypeOptions = (
                  <div>
                    <label>{strings.AssessmentType}</label>
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
                          this.props.callTaskFunction('setDefaultField', 0, index, this.props.index, this.props.workflowIndex, value);
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
                        {defaultContentWrapper}
                        {fieldSelection}
                      </div>
                    );
                } else {
                    defaultContentView = (
                      <div className="inner block">
                        <label>{strings.DefaultContentForField}</label>
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
                    <label>{strings.GetDataFromAnotherTaskInstead}?
                            <Checkbox
                              isClicked={this.state.DefaultFieldForeign[index]} click={() => {
                                  const newData = this.state.DefaultFieldForeign;
                                  newData[index] = !newData[index];
                                  this.setState({ DefaultFieldForeign: newData });
                              }}
                            />
                    </label>
                  </div>
                );
            } else {
                defaultContentView = (
                  <div className="inner block">
                    <label>{strings.DefaultContentForField}</label>
                    <textarea className="big-text-field" placeholder={`${strings.DefaultContentForField}...`} onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'default_content', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].default_content[0]} />
                  </div>
                );
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
                className="section-divider" key={`Task ${this.props.index} of Workflow `,
                  this.props.workflowIndex,
                ` Field ${index}`}
              >
                <h3 className="subheading">{strings.InputFields} {removeButtonView}
                </h3>

                <div className="inner">
                  <label>{strings.FieldName}</label>
                  <br />
                  <input type="text" placeholder="Field Name" value={this.props.TaskActivityData.TA_fields[index].title} onChange={this.props.callTaskFunction.bind(this, 'changeFieldName', this.props.index, index, this.props.workflowIndex)} />
                </div>

                <div className="inner">
                  <label>
                    {strings.ShowThisName}?
                  </label><br />
                  <Checkbox isClicked={this.props.TaskActivityData.TA_fields[index].show_title} click={this.props.callTaskFunction.bind(this, 'changeFieldCheck', 'show_title', this.props.index, index, this.props.workflowIndex)} />
                </div>

                <div className="inner">
                  <label>{strings.FieldType}</label>
                  <br />

                  <Select key={index} options={fieldTypeValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownFieldData', 'field_type', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].field_type} clearable={false} searchable={false} />
                  <br /> {fieldTypeOptions}
                </div>

                <div className="inner">
                  <label>{strings.RequiresJustification} ?</label><br />
                  <Checkbox click={this.props.callTaskFunction.bind(this, 'changeFieldCheck', 'requires_justification', this.props.index, index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_fields[index].requires_justification} />
                </div>

                <div className="inner block">
                  <label>{strings.FieldInstructions} ({strings.Optional})</label>
                  <textarea className="big-text-field" placeholder={`${strings.TypeInstructionsHere}...`} onChange={this.props.callTaskFunction.bind(this, 'changeInputFieldData', 'instructions', this.props.index, index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_fields[index].instructions} />
                </div>

                <div className="inner block">
                  <label>{strings.FieldRubric}</label>
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

        let advancedOptionsView = null;
        if (this.state.ShowAdvanced) {
            const dueType = (
              <div className="inner">
                <label>{strings.ShouldTaskEndAtCertainTime}</label>
                <br />
                <RadioGroup selectedValue={this.props.TaskActivityData.TA_due_type[0]} onChange={this.props.callTaskFunction.bind(this, 'changeRadioData', 'TA_due_type', this.props.index, this.props.workflowIndex)}>
                  <label>
                    <Radio value="duration" />
                    {strings.ExpireAfter}
                  </label>
                  <label><Radio value="specific time" />{strings.EndAtThisTime}</label>

                </RadioGroup>
                <br />
                <NumberField label={strings.Days} value={this.props.TaskActivityData.TA_due_type[1] / 1440} min={0} max={200} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_due_type', this.props.index, this.props.workflowIndex)} />
              </div>
            );

            const startDelay = (
              <div className="inner">
                <label>{strings.DelayBeforeStartingTask}</label>
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
                <Checkbox isClicked={this.props.TaskActivityData.SeeSameActivity} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'SeeSameActivity', this.props.index, this.props.workflowIndex)} />
              </div>
            );

            const atDurationEnd = (
              <div className="inner">
                <label>{strings.WhatHappensWhenTaskEnds}</label>
                <br />
                <Select value={this.props.TaskActivityData.TA_at_duration_end} options={onTaskEndValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_at_duration_end', this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
              </div>
            );

            const whatIfLate = this.props.TaskActivityData.TA_at_duration_end == 'late'
                ? (
                  <div className="inner">
                    <label>
                      {strings.WhatIfLate}</label>
                    <Select options={onLateValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_what_if_late', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_what_if_late} clearable={false} searchable={false} autoBlur />
                  </div>
                )
                : null;

            const simpleGradeOptions = this.props.TaskActivityData.TA_simple_grade != 'none'
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
                <Checkbox click={this.props.callTaskFunction.bind(this, 'changeSimpleGradeCheck', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_simple_grade != 'none'} />
                <br /> {simpleGradeOptions}
              </div>
            );

            // TA_allow_assessment
            let allowAssesmentOptions = null;
            if (this.props.TaskActivityData.TA_allow_assessment != 'none') {
                const showDispute = (
                  <div>
                    <label>
                      {strings.CanStudentsDisputeAssessment}
                    </label>
                    <Checkbox isClicked={this.props.callTaskFunction('canDispute', this.props.index, this.props.workflowIndex, false)} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Dispute', this.props.index, this.props.workflowIndex)} />
                  </div>
                );
                const consolidateOptions = this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)
                    ? (
                      <div>
                        <label>{strings.GradingThreshold}</label>
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
                        <label>{strings.ToBeConsolidatedAssessment}:
                            </label>
                        <Select options={consolidationTypeValues} value={this.props.callTaskFunction('getConsolidateValue', this.props.index, this.props.workflowIndex, true)} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_function_type_Assess', this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                      </div>
                    )
                    : null;
                const showConsol = this.props.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex) > 1
                    ? (
                      <div>
                        <label>{strings.ShouldAssessmentsBeConsolidated}</label>
                        <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Consolidate', this.props.index, this.props.workflowIndex)} isClicked={this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)} />
                        <br /> {consolidateOptions}
                        <div>
                          <label>{strings.SeeSibblingsInParent}</label>
                          <Checkbox
                            click={this.props.callTaskFunction.bind(this, 'setSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                            isClicked={this.props.callTaskFunction('getSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                          />
                        </div>
                      </div>
                    )
                    : null;
                const assessConstraint = this.props.callTaskFunction('getAssigneeInChild', false, this.props.index, this.props.workflowIndex);
                const numberOfAssessView = (assessConstraint == 'student' || assessConstraint == 'both')
                    ? (
                      <div>
                        <br />
                        <label>{strings.NumberOfAssessors}</label>
                        <br />
                        <NumberField value={this.props.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'setAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} />
                        <br /> {showConsol}
                      </div>
                    )
                    : null;
                allowAssesmentOptions = this.props.TaskActivityData.TA_allow_assessment != 'none'
                    ? (
                      <div>
                        <Select options={assessmentValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_assessment', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_allow_assessment} clearable={false} searchable={false} />
                        <label>{strings.WhoCanAssess}</label>
                        <br />
                        <Select options={assigneeWhoValues} value={this.props.callTaskFunction('getAssigneeInChild', false, this.props.index, this.props.workflowIndex)} onChange={this.props.callTaskFunction.bind(this, 'changeAssigneeInChild', false, this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                        {numberOfAssessView}
                        <br /> {showDispute}
                      </div>
                    )
                    : null;
            }

            const allowAssessment = (
              <div className="inner">
                <label>{strings.AllowAnAssessment}</label>
                <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_assessment', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_allow_assessment != 'none'} /> {allowAssesmentOptions}
              </div>
            );


            // TA_allow_reflection
            let allowReflectionOptions = null;
            if (this.props.TaskActivityData.TA_allow_reflection[0] != 'none') {
                const showDispute = this.doesTaskHaveAssessmentFields() ? (
                  <div>
                    <label>
                      {strings.CanStudentsDisputeReflection}
                    </label>
                    <Checkbox isClicked={this.props.callTaskFunction('canDispute', this.props.index, this.props.workflowIndex, true)} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Reflect_Dispute', this.props.index, this.props.workflowIndex)} />
                  </div>
                ) : null;

                const showConsol = this.props.callTaskFunction('getReflectNumberofParticipants', this.props.index, this.props.workflowIndex) > 1
                    ? (
                      <div>
                        <label>{strings.ShouldReflectionsBeConsolidated}</label>
                        <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Reflect_Consolidate', this.props.index, this.props.workflowIndex)} isClicked={this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, true)} />
                        <br />
                        <div>
                          <label>{strings.SeeSibblingsInParent}</label>
                          <Checkbox
                            click={this.props.callTaskFunction.bind(this, 'setSeeSibblings', this.props.index, this.props.workflowIndex, false)}
                            isClicked={this.props.callTaskFunction('getSeeSibblings', this.props.index, this.props.workflowIndex, false)}
                          />
                        </div>
                      </div>
                    )
                    : null;
                const reflectConstr = this.props.callTaskFunction('getAssigneeInChild', true, this.props.index, this.props.workflowIndex);
                const numberOfReflectorsView = (reflectConstr == 'student' || reflectConstr == 'both')
                    ? (
                      <div>
                        <br />
                        <label>{strings.NumberOfStudents}</label>
                        <br />
                        <NumberField value={this.props.callTaskFunction('getReflectNumberofParticipants', this.props.index, this.props.workflowIndex)} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'setReflectNumberofParticipants', this.props.index, this.props.workflowIndex)} />
                        <br /> {showConsol}
                      </div>
                    )
                    : null;
                allowReflectionOptions = (
                  <div>
                    <Select options={reflectionValues} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_reflection', this.props.index, this.props.workflowIndex)} value={this.props.TaskActivityData.TA_allow_reflection[0]} clearable={false} searchable={false} />
                    <label>{strings.WhoCanReflect}</label><br />
                    <Select options={assigneeWhoValues} value={this.props.callTaskFunction('getAssigneeInChild', true, this.props.index, this.props.workflowIndex)} onChange={this.props.callTaskFunction.bind(this, 'changeAssigneeInChild', true, this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} /> {numberOfReflectorsView}
                    <br /> {showDispute}
                  </div>
                );
            }
            const allowReflection = (
              <div className="inner">
                <label>{strings.AllowReflection}</label>
                <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_reflection', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_allow_reflection[0] != 'none'} />
                {allowReflectionOptions}
              </div>
            );

            // TA_allow_revisions
            const allowRevision = (
              <div className="inner">
                <label>{strings.AllowRevision}</label>
                <Checkbox isClicked={this.props.TaskActivityData.TA_allow_revisions} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_revisions', this.props.index, this.props.workflowIndex)} />
              </div>
            );

            const versionEvaluation = this.props.TaskActivityData.TA_allow_revisions === true ? (
              <div className="inner">
                <label>{strings.VersionEvaluation}</label>
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
                        <Checkbox
                          click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'none', this.props.workflowIndex)} isClicked={Object.keys(this.props.TaskActivityData.TA_assignee_constraints[2]).length === 0} style={{
                              marginRight: '8px',
                          }}
                        />
                        <label>{strings.NewToProblem}</label>
                        <Checkbox
                          click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'not_in_workflow_instance', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].not_in_workflow_instance}
                        />
                        <label>{strings.SameAs}</label>
                        <Checkbox
                          click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'same_as', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].same_as} style={{
                              marginRight: '8px',
                          }}
                        />
                        <label>{strings.InSameGroupAs}</label>
                        <Checkbox
                          click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'group_with_member', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].group_with_member} style={{
                              marginRight: '8px',
                          }}
                        />
                        <label>{strings.NotIn}</label>
                        <Checkbox
                          click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'not', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].not} style={{
                              marginRight: '8px',
                          }}
                        />
                        <label>{strings.ChooseFrom}
                        </label>
                        <Checkbox
                          click={this.props.callTaskFunction.bind(this, 'checkAssigneeConstraints', this.props.index, 'choose_from', this.props.workflowIndex)} isClicked={!!this.props.TaskActivityData.TA_assignee_constraints[2].choose_from}
                        />
                        <br /> {sameAsOptions}
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
              <NumberField value={this.props.TaskActivityData.TA_number_participant} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_number_participant', this.props.index, this.props.workflowIndex)} />
            </div>
            ) : null;
            assigneeConstraints = (
              <div className="inner">
                <label>{strings.AssigneeConstraints}</label>
                <br />
                <label>{strings.WhoCanDoTask}</label>
                <br />
                <Select options={assigneeWhoValues} value={this.props.TaskActivityData.TA_assignee_constraints[0]} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_assignee_constraints', this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                {showNumberofStudents}
                <label>{strings.WillThisBeGroupTask}</label>
                <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_assignee_constraints', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_assignee_constraints[1] == 'group'} />
                {assigneeRelations}
              </div>
            );

            const seeSiblings = (this.props.TaskActivityData.TA_number_participant > 1) ? (
              <div className="inner">
                <label>{strings.SeeSibblingsLabel}
                  <Checkbox isClicked={this.props.TaskActivityData.SeeSibblings} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'SeeSibblings', this.props.index, this.props.workflowIndex)} />
                </label>
              </div>
            ) : null;


            // TA_leads_to_new_problem
            const leadsToNewProblem = (
              <div className="inner">
                <label>{strings.DoesThisLeadToNewProblem}?</label>
                <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_leads_to_new_problem', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_leads_to_new_problem} />
              </div>
            );

            // TA_leads_to_new_solution
            const leadsToNewSolution = (
              <div className="inner">
                <label>{strings.DoesThisLeadToNewSolution}?</label>
                <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_leads_to_new_solution', this.props.index, this.props.workflowIndex)} isClicked={this.props.TaskActivityData.TA_leads_to_new_solution} />
              </div>
            );

            advancedOptionsView = (
              <div className="section-divider">
                <div className="advanced">
                  {dueType}
                  {startDelay}
                  {oneOrSeparate}
                  {seeSameActivity}
                  {atDurationEnd}
                  {whatIfLate}
                  {simpleGrade}
                  {allowAssessment}
                  {allowReflection}
                  {allowRevision}
                  {versionEvaluation}
                  {seeSiblings}
                  {leadsToNewProblem}
                  {leadsToNewSolution}
                </div>
                {assigneeConstraints}
              </div>
            );
        }

        return (
          <div key={`Main View of Task ${this.props.index} in ${this.props.workflowIndex}`} className="section card-2">
            <h2 className="title" onClick={this.props.changeSelectedTask.bind(this, this.props.index)}>{title}</h2>
            <div className="section-content">
              <div className="section-divider">
                {displayName}
                {fileUploads}
                {taskInstructions}
                {taskRubric}
                {inputFields}
                <div className="inner block" >
                {fieldButton}
                {toggleView}
                </div>
              </div>

              {advancedOptionsView}

            </div>
          </div>

        );
    }
}

export default TaskDetailsComponent;
