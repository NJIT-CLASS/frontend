import React, {Component } from 'react';
import Checkbox from '../../shared/checkbox';
import NumberField from '../../shared/numberField';
import Tooltip from '../../shared/tooltip';
import { RadioGroup, Radio } from 'react-radio-group';
import Select from 'react-select';
import { TASK_TYPES } from '../../../server/utils/react_constants';

class AllowFollowOnAssessmentComponent extends Component{
    constructor(props){
        super(props);

        this.callTaskFunction = this.props.callTaskFunction.bind(this);
    }
    render(){
        const alreadyCreatedTasks = this.props.callTaskFunction('getAlreadyCreatedTasks', this.props.index, this.props.workflowIndex);
        
        let strings = this.props.Strings;

        const assessmentValues = [{ value: 'grade', label: strings.Grade }, { value: 'critique', label: strings.Critique }];
        const consolidationTypeValues = [{ value: 'max', label: strings.Max }, { value: 'min', label: strings.Min }, { value: 'avg', label: strings.Average }, { value: 'other', label: strings.Other }];
        const assigneeWhoValues = [{ value: 'student', label: strings.Student }, { value: 'instructor', label: strings.Instructor }, { value: 'both', label: strings.BothInstructorStudents }];

        let allowAssesmentOptions = null;
        let assessShowDispute = null;
        let assessConsolidateOptions = null;
        let assessShowConsol = null;
        let assessConstraint = null;
        let numberOfAssessView = null;
        let seeSibblingsView = null;
        
        const assessmentTask = this.props.callTaskFunction('getAssessmentTask', this.props.index, this.props.workflowIndex);
        if(this.props.TaskActivityData.TA_allow_assessment !== 'none'){
            return <div>
                <div className="inner">
                    <label>{strings.AllowAFollowOnAssessment}</label>
                    <Tooltip Text={strings.TaskAllowAssessmentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-allow-assessment-tooltip`} />
                    <span>{strings.FollowOnAssessmentPlaceholder}</span>
                    {allowAssesmentOptions}
                </div>
            </div>;
        }
        if (this.props.TaskActivityData.TA_allow_follow_on_assessment == true && this.props.TaskActivityData.TA_allow_assessment === 'none') {
            assessConstraint = this.props.callTaskFunction('getAssigneeInChild', false, this.props.index, this.props.workflowIndex);
            if(assessConstraint == 'student' || assessConstraint == 'both'){

                if(this.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex) > 1){
                        
                    if(this.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)){
                        assessConsolidateOptions = 
                            (
                                <div>
                                    <label>{strings.GradingThreshold}</label>
                                    <Tooltip Text={strings.TaskConsolidateThresholdMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-grading-threshold-tooltip`} />
                                    <br />
                                    <RadioGroup
                                        selectedValue={this.callTaskFunction('getTriggerConsolidationRadioOption', this.props.index, this.props.workflowIndex, false)} onChange={(val) => {
                                            this.callTaskFunction('changeRadioData', 'TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex, val);
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
                                    <NumberField value={this.callTaskFunction('getTriggerConsolidationThreshold', this.props.index, this.props.workflowIndex, false)} min={0} max={100} onChange={this.props.callTaskFunction.bind(this, 'changeNumericData', 'TA_trigger_consolidation_threshold_assess', this.props.index, this.props.workflowIndex)} size={6} />
                                    <br />
                                    <label>{strings.ToBeConsolidatedAssessment}</label>
                                    <Tooltip Text={strings.TaskConsolidateFunctionMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-consolidation-function-tooltip`} />
                                    <Select options={consolidationTypeValues} value={this.callTaskFunction('getConsolidateValue', this.props.index, this.props.workflowIndex, true)} onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_function_type_Assess', this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                                </div>
                            );
                    }

                    assessShowConsol = (
                        <div>
                            <label>{strings.ShouldAssessmentsBeConsolidated}</label>
                            <Tooltip Text={strings.TaskCanConsolidateMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-can-consolidate-tooltip`} />
        
                            <Checkbox click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Consolidate', this.props.index, this.props.workflowIndex)} isClicked={this.props.callTaskFunction('canConsolidate', this.props.index, this.props.workflowIndex, false)} />
                                
                        </div>
                    );

                    seeSibblingsView = (
                        <div>
                            <label>{strings.SeeSibblingsInParent}</label>
                            <Tooltip Text={strings.TaskSeeSibblingsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-see-sibblings-tooltip`} />
                            <Checkbox
                                click={this.props.callTaskFunction.bind(this, 'setSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                                isClicked={this.props.callTaskFunction('getSeeSibblings', this.props.index, this.props.workflowIndex, true)}
                            />
                        </div>
                    );
                }

                numberOfAssessView = (
                    <div>
                        <br />
                        <label>{strings.NumberOfAssessors}</label>
                        <Tooltip Text={strings.TaskAssessmentNumberOfParticipantsMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-number-of-participants-tooltip`} />
                        <br />
                        <NumberField value={this.props.callTaskFunction('getAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} min={1} max={20} onChange={this.props.callTaskFunction.bind(this, 'setAssessNumberofParticipants', this.props.index, this.props.workflowIndex)} />
                        <br />
                        <div className="inner">
                                
                        </div>
                    </div>
                );
            }

            assessShowDispute = (
                <div>
                    <label>
                        {strings.CanStudentsDisputeAssessment}
                    </label>
    
                    <Tooltip Text={strings.TaskCanDisputeMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-assessment-dispute-tooltip`} />
    
                    <Checkbox isClicked={this.callTaskFunction('canDispute', this.props.index, this.props.workflowIndex, false)} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'Assess_Dispute', this.props.index, this.props.workflowIndex)} />
                </div>
            );


            let assessTaskType = '';
            switch(assessmentTask.TA_type){
                case TASK_TYPES.GRADE_PROBLEM:
                    assessTaskType = 'grade';
                    break;
                case TASK_TYPES.CRITIQUE:
                    assessTaskType = 'critique';
                    break;
            }


            allowAssesmentOptions = 
                (
                    <div>
                        {strings.AssessWhichTask}
                        <Select options={alreadyCreatedTasks} 
                            value={assessmentTask.RefersToWhichTask} 
                            clearable={false} 
                            searchable={false}
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_follow_on_assessment', this.props.index, this.props.workflowIndex)} 
                        />
                        <br/>                    
                        <Select options={assessmentValues} 
                            onChange={this.props.callTaskFunction.bind(this, 'changeDropdownData', 'TA_allow_assessment', this.props.index, this.props.workflowIndex)}
                            value={assessTaskType} 
                            clearable={false} 
                            searchable={false}
                        />
                        <label>{strings.WhoCanAssess}</label>
                        <Tooltip Text={strings.TaskWhoCanAssessMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-who-can-assess-tooltip`} />
                        <br />
                        <Select options={assigneeWhoValues} value={this.props.callTaskFunction('getAssigneeInChild', false, this.props.index, this.props.workflowIndex)} onChange={this.props.callTaskFunction.bind(this, 'changeAssigneeInChild', false, this.props.index, this.props.workflowIndex)} clearable={false} searchable={false} />
                    </div>
                    
                );
            
        }

        const allowAssessment = (
            <div>
                <div className="inner">
                    <label>{strings.AllowAFollowOnAssessment}</label>
                    <Tooltip Text={strings.TaskAllowAssessmentMessage} ID={`w${this.props.workflowIndex}-T${this.props.index}-allow-assessment-tooltip`} />

                    <Checkbox isClicked={this.props.TaskActivityData.TA_allow_follow_on_assessment} click={this.props.callTaskFunction.bind(this, 'changeDataCheck', 'TA_allow_follow_on_assessment', this.props.index, this.props.workflowIndex)} />
                    {allowAssesmentOptions}
                </div>
                <div className="inner">
                    {numberOfAssessView}
                    {assessShowConsol}
                    {assessConsolidateOptions}
                </div>
                <div className="inner">
                    {seeSibblingsView}
                    {assessShowDispute}
                </div>
                

            </div>

        );

        return allowAssessment;
    }
}

export default AllowFollowOnAssessmentComponent;