/* This Component is contains the workflow input fields. It gets its data and functions from the AssignmentEditorContainer.
*/
import React from 'react';
import Select, {Creatable} from 'react-select';
import ToggleSwitch from '../shared/toggleSwitch';
import NumberField from '../shared/numberField';
import Checkbox from '../shared/checkbox';
import Tooltip from '../shared/tooltip';

class ProblemDetailsComponent extends React.Component{
    constructor(props){
        super(props);
        //this.props.:
        //numWorkflows
        // this.props.workflowIndex
        this.state = {
            ShowContent: true,
            CustomProblemTypes: [],
        };
    }

    mapTasksToOptions(){
        console.log('GradeDistribution', this.props.WorkflowDetails.WA_grade_distribution);
        
        return Object.keys(this.props.WorkflowDetails.WA_grade_distribution).map(function(task, index){
            if(task === 'simple'){
                return {id: task, name: this.props.Strings.SimpleGradeWorkflowDistribution, weight: this.props.WorkflowDetails.WA_grade_distribution[task] };
            }
            return {id: task, name: this.props.WorkflowDetails.Workflow[task].TA_display_name, weight: this.props.WorkflowDetails.WA_grade_distribution[task] };
        },this);
    }

    render(){
        let strings = this.props.Strings;
        let problemTypeValues=[{value: 'essay', label: strings.Essay},
            {value: 'multiple_choice', label: strings.MultipleChoice},
            {value: 'short_answer' ,label: strings.ShortAnswer },
            {value: 'program', label: strings.ComputerProgram},
            ...this.props.WorkflowDetails.CustomProblemTypes];
        let gradingTasks = this.mapTasksToOptions();

        let gradeDistListView = null;
        let gradeDistSectionView = null;
        let multipleWorkflowsView = null;

        if(gradingTasks.length > 1){
            gradeDistListView = gradingTasks.map(function(task, index){
                let labelView = (
                    <div>
                        <label style={{marginRight: '8px'}} key={'probDet-' + index}> {task.name} </label>
                    </div>
                );
                if(task.id === 'simple'){
                    labelView = (
                        <div>
                            <label style={{marginRight: '8px'}} key={'probDet-' + index}> {task.name} </label>
                            <Tooltip Text={strings.AggregatedGradeForOnTimeMessage} ID={`WA_aggregate-grade-${this.props.workflowIndex}-tooltip`}/>
                        </div>

                    );
                }
                return(
                    <li className="thin-number-field" key={'probDet' + index}>
                        {labelView}
                        <NumberField  key = {'probDet-NumF '+index} allowDecimals={false}
                            min={0} max={100}
                            onChange={this.props.changeWorkflowGradeDist.bind(this, this.props.workflowIndex, task.id, index)}
                            value={task.weight} />
                    </li>
                );
            }, this);
        }
        if(gradingTasks.length > 1){
            gradeDistSectionView = (
                <div className='inner block'>
                    <label>{strings.GradeWeightsHeader}</label>
                    <Tooltip Text={strings.ProblemGradeWeightsTitleMessage} ID={`WA_grade-weights-header-${this.props.workflowIndex}-tooltip`}/>
                    {gradeDistListView}
                </div>
            );
        }

        if(this.props.NumberofWorkflows > 1){
            multipleWorkflowsView = (<div>
                <div className='inner'>
                    <label>{strings.ProblemName}</label>
                    <Tooltip Text={strings.ProblemNameMessage} ID={`WA_name-${this.props.workflowIndex}-tooltip`}/>
                    <br />
                    <input type="text" placeholder={strings.Name} value={this.props.WorkflowDetails.WA_name} onChange={this.props.changeWorkflowInputData.bind(this, 'WA_name', this.props.workflowIndex)}/>
                </div>
                {/* Hiding Problem Type for now
                <div className='inner'>
                    <label>{strings.ProblemType}</label>
                    <Tooltip Text={strings.ProblemTypeMessage} ID={`WA_type-${this.props.workflowIndex}-tooltip`}/>
                    <Creatable options={problemTypeValues}
                        value={this.props.WorkflowDetails.WA_type}
                        onChange={this.props.changeWorkflowDropdownData.bind(this,'WA_type',this.props.workflowIndex)}
                        clearable={false}
                        onNewOptionClick={this.props.addCustomProblemType.bind(this, this.props.workflowIndex)}
                    />
                </div>
                */}
                <br />
                <div className='inner block'>
                    <label>{strings.Description}</label>
                    <Tooltip Text={strings.ProblemDocumentationMessage} ID={`WA_documentation-${this.props.workflowIndex}-tooltip`}/>

                    <br />
                    <textarea className="big-text-field" placeholder={strings.Description}
                        value={this.props.WorkflowDetails.WA_documentation}
                        onChange={this.props.changeWorkflowInputData.bind(this,'WA_documentation',this.props.workflowIndex)} ></textarea>
                </div>

            </div>
            );
        }


        return (
            <div className="section">
                <h2 className="title" onClick={() => {this.setState({ShowContent: this.state.ShowContent ? false : true});}}>{strings.WorkflowHeader}</h2>
                <div className={this.state.ShowContent ? 'section-content' : 'task-hiding'}>
                    <div className='section-divider'>

                        {multipleWorkflowsView}

                        <div className='inner'>
                            <label>{strings.HowManyPeoplePerGroup}</label>
                            <Tooltip Text={strings.ProblemDefaultGroupSizeMessage} ID={`WA_default_group_size-${this.props.workflowIndex}-tooltip`}/>
                            <br />
                            <NumberField min={1}
                                max={25}
                                value={this.props.WorkflowDetails.WA_default_group_size}
                                onChange={this.props.changeWorkflowData.bind(this,'WA_default_group_size',this.props.workflowIndex)}/>
                        </div>
                        <div className='inner'>
                            <label>{strings.HowManyProblems}</label>
                            <Tooltip Text={strings.ProblemNumberOfSetsMessage} ID={`WA_number_of_sets-${this.props.workflowIndex}-tooltip`}/>
                            <br />
                            <NumberField min={1}
                                max={20}
                                value={this.props.WorkflowDetails.WA_number_of_sets}
                                onChange={this.props.changeWorkflowData.bind(this,'WA_number_of_sets',this.props.workflowIndex)}/>
                        </div>
                        <br />
                        {gradeDistSectionView}


                    </div>
                </div>
            </div>
        );
    }
}

export default ProblemDetailsComponent;
