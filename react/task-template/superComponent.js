/* This component is show when the tasks is to create the problem. It will show
* the assignment description, the rubric, the instructions, and a text area. The
* component will be able to make a PUT request to save the data for later, a GET
* request to get the initial data, and a POST request for final submission.
*/
import React from 'react';
import PropTypes from 'prop-types';
import apiCall from '../shared/apiCall';
import Select from 'react-select';
import Rater from 'react-rater';
import { RadioGroup, Radio } from 'react-radio-group';
import {CSSTransition, TransitionGroup} from 'react-transition-group';

import FileUpload from '../shared/fileUpload';
import MarkupText from '../shared/markupTextView';
import ErrorComponent from './errorComponent';
import VersionView from './individualFieldVersionsComponent';
import FileLinksComponent from './fileLinksComponent';

import { TASK_TYPES } from '../../server/utils/react_constants'; // contains constants and their values

import CommentInfoComponent from './CommentInfoComponent';

class SuperComponent extends React.Component {
    constructor(props) {
        super(props);
        /*
    PROPS:  -TaskData
            -TaskActivityFields (TaskAcitivtyData)
            -ComponentTitle
            -Instructions
            -TaskStatus
            TaskID
            -Rubric
    */

        this.state = {
            TaskActivityFields: {
                field_titles: [],
            },
            TaskData: [],
            TaskResponse: {},
            ShowRubric: false,
            FieldRubrics: [],
            InputError: false,
            TaskStatus: '',
            ShowContent: true,
            Error: false,
            SaveSuccess: false,
            SubmitSuccess: false,
            NumberFilesStored: 0,
            PassFailValue: null,
            DisputeStatus: null,
            FileUploadsSatisfied: false,
            LockSubmit: false,
            NewFilesUploaded: [],
            RevisionStatus: false
        };
    }


    componentWillMount() {
        let tdata = this.props.TaskData;
        const tAdata = this.props.TaskActivityFields;
        // checks to see if either data prop is null

        if (tdata === null || tdata === undefined || tdata === 'null' || tdata === '[{}]') {
            tdata = [new Object()];
        }
        if (!tAdata) {
            this.setState({ Error: true });
            return;
        }

        tdata = tdata.map((data) => {
            if (data.constructor === Object) {
                return data;
            }

            return JSON.parse(data);
        });


        const latestVersion = tdata.pop();

        // checks to see if     task activity data is empty. This would only be caused by an error
        if (Object.keys(tAdata).length === 0 && tAdata.constructor === Object) {
            this.setState({ Error: true });
            return;
        }
        // if task data is empty, it fills it up with the TA's fields
        if ((Object.keys(latestVersion).length === 0 && latestVersion.constructor === Object) || latestVersion == null) {
            latestVersion.number_of_fields = tAdata.number_of_fields;
            for (let i = 0; i < tAdata.number_of_fields; i++) {
                if(tAdata[i].default_refers_to[0] !== null){
                    latestVersion[i] = this.props.getLinkedTaskValues(tAdata[i].default_refers_to[0], tAdata[i].default_refers_to[1]);
                } else {
                    latestVersion[i] = tAdata[i].default_content;

                }
            }
        }

        const disputeStat = (this.props.Type == TASK_TYPES.DISPUTE) ? false : null;

        let filesUploadedCount = this.props.Files !== null ? filesUploadedCount = this.props.Files.length : 0;
        const filesSatisfied = filesUploadedCount >= this.props.FileUpload.mandatory;

        this.setState({
            TaskData: tdata,
            TaskActivityFields: tAdata,
            TaskResponse: latestVersion,
            FileUploadsSatisfied: filesSatisfied,
            NumberFilesStored: filesUploadedCount,
            DisputeStatus: disputeStat,
        });
    }

    fetchNewFileUploads(){
        return;
        apiCall.get(`/taskFileReferences/${this.props.TaskID}`, (err, res, body) => {
            this.setState({
                NewFilesUploaded: body.Files
            });
        });
    }

    isValidData() {
        // go through all of TaskData's fields to check if null. If a field requires_justification,
        // also check the justification field
        // returns false if any field is null and true if all fields are filled
        for (let i = 0; i < this.state.TaskActivityFields.number_of_fields; i++) {
            //make sure reqiures_justification is satisfied
            if (this.state.TaskActivityFields[i].requires_justification) {
                if ((this.state.TaskResponse[i][1] == null || this.state.TaskResponse[i][1] == '') || (this.state.TaskResponse[i][1] == null || this.state.TaskResponse[i][1] == '')) {
                    return false;
                }
            }

            //checks for blank response
            if (this.state.TaskResponse[i][0] == null || this.state.TaskResponse[i][0] == '') {
                return false;
            }

            //validate numeric input, check for valid int and boundaries
            if (this.state.TaskActivityFields[i] != null && (this.state.TaskActivityFields[i].field_type == 'numeric' || this.state.TaskActivityFields[i].field_type == 'assessment' || this.state.TaskActivityFields[i].field_type == 'self assessment')) {
                if (isNaN(this.state.TaskResponse[i][0])) {
                    console.log('isNan error');
                    return false;
                }
                if (this.state.TaskResponse[i][0] < parseInt(this.state.TaskActivityFields[i].numeric_min) || this.state.TaskResponse[i][0] > parseInt(this.state.TaskActivityFields[i].numeric_max)) {
                    console.log('min max error');
                    return false;
                }
            }
            else if (typeof (this.state.TaskResponse[i][0]) === 'string' && this.state.TaskResponse[i][0].length > 45000) { // checks to see if the input is a reasonable length
                console.log('strin length error');
                return false;
            }

        }

        if (this.props.FileUpload.mandatory > 0) {
            if (!this.state.FileUploadsSatisfied) {
                return false;
            }
        }

        return true;
    }

    saveData(e) { //NEEDS TO BE UPDATED TO SUPPORT VERSIONING
        // function makes a POST call and sends in the state variables which hold the user's input
        e.preventDefault(); // standard JavaScript behavior
        // if task is complete, don't allow saving new data
        if (this.props.TaskStatus.includes('complete')) {
            return;
        }


        const options = {
            taskInstanceid: this.props.TaskID,
            userid: this.props.UserID,
            taskInstanceData: this.state.TaskResponse,
        };

        apiCall.post('/taskInstanceTemplate/create/save', options, (err, res, body) => {
            console.log(res, body);
            if (res.statusCode != 200) {
                showMessage(this.props.Strings.InputErrorMessage);
            } else {

                showMessage(this.props.Strings.SaveSuccessMessage);
            }
        });
    }

    handleFileUploads({ conditionsMet, numberOfUploads }) {
        console.log(conditionsMet, numberOfUploads);

        this.setState({
            FileUploadsSatisfied: conditionsMet,
        });
        this.fetchNewFileUploads();
    }

    submitData(e) {
        e.preventDefault();
        // don't allow submit if task is complete
        if (this.props.TaskStatus.includes('complete')) {
            return;
        }

        //check if submit is in progress
        if(this.state.LockSubmit){
            return;
        }

        // check if input is valid
        const validData = this.isValidData();
        if (validData) {
            const options = {
                taskInstanceid: this.props.TaskID,
                userid: this.props.UserID,
                taskInstanceData: this.state.TaskResponse,
            };
            this.setState({
                LockSubmit: true
            });
            apiCall.post('/taskInstanceTemplate/create/submit', options, (err, res, body) => {
                console.log(body);
                if (res.statusCode != 200) {
                    this.setState({ InputError: true,
                        LockSubmit: false });
                } else {
                    this.setState({
                        TaskStatus: 'Complete',
                        SubmitSuccess: true
                    });

                    showMessage(this.props.Strings.SubmitSuccessMessage);
                    window.location.href= '/';
                    
                }
            });
        } else {
            this.setState({
                LockSubmit: false
            });

            if (!this.state.FileUploadsSatisfied) {
                showMessage(this.props.Strings.InsufficientFileErrorMessage);
            }else {
                showMessage(this.props.Strings.InputErrorMessage);
            }
        }
    }


    // modalToggle(){ //not used
    //   //shows or hides error message popup(modal)
    //   this.setState({InputError:false})
    // }

    toggleRubric() {
        // shows or hides the task activity rubric
        const bool = !this.state.ShowRubric;

        this.setState({
            ShowRubric: bool,
        });
    }

    toggleContent() {
        // shows or hides the component's section-content for accordian view
        const bool = !this.state.ShowContent;

        this.setState({
            ShowContent: bool,
        });
    }

    handleContentChange(index, event) {
        // updates task data with new user input in grading fields

        const newTaskResponse = this.state.TaskResponse;
        newTaskResponse[index][0] = event.target.value;
        this.setState({
            TaskResponse: newTaskResponse,
        });
    }

    handleRadioChange(index, val){
        let newData = this.state.TaskResponse;
        newData[index][0] = val;
        this.setState({ TaskResponse: newData });
    }
    handleSelectChange(index, val){
        let newData = this.state.TaskResponse;
        newData[index][0] = val.value;
        this.setState({
            TaskResponse: newData,
        });
    }

    handleJustificationChange(index, event) {
        if (event.target.value.length > 45000) { // checks to see if input is reasosnable length, makes sure browser doesn't crash on long input
            return;
        }
        // updates task data with new user input in justification fields
        let newTaskResponse = this.state.TaskResponse;
        newTaskResponse[index][1] = event.target.value;

        this.setState({
            TaskResponse: newTaskResponse,
        });
    }

    handleStarChange(index, value) {
        // updates rating grade in taskdata
        let newResponse = this.state.TaskResponse;
        newResponse[index][0] = value.rating;

        this.setState({
            TaskResponse: newResponse,
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

    willDispute() {
        
        this.setState({
            DisputeStatus: true,
        });
    }

    willNotDispute() {
        showMessage(this.props.Strings.DidNotDisputeMessage);
        this.setState({
            DisputeStatus: false,
        });
        const options = {
            userid: this.props.UserID,
        };

        apiCall.get(`/skipDispute/${this.props.TaskID}`, options, (err, res, body) => {
            console.log(err, res, body);
            this.setState({
                SubmitSuccess: true
            });
            window.location.href= '/';

        });

    }

    rejectRevision(){
        showMessage(this.props.Strings.RejectRevisionMessage);
        this.setState({
            RevisionStatus: false
        });

        if(this.state.LockSubmit){
            return;
        }

        // check if input is valid
        const validData = this.isValidData();
        if (validData) {
            const options = {
                ti_id: this.props.TaskID,
                userid: this.props.UserID,
                data: this.state.TaskResponse,
            };
            this.setState({
                LockSubmit: true
            });
            apiCall.post('/revise', options, (err, res, body) => {
                this.setState({
                    SubmitSuccess: true
                });
                window.location.href= '/';

            });
            
        } else {
            this.setState({
                LockSubmit: false
            });

            showMessage(this.props.Strings.InputErrorMessage);
        }
        
        
    }

    approveRevision(){
        showMessage(this.props.Strings.ApproveRevisionMessage);
        this.setState({
            RevisionStatus: true
        });

        const validData = this.isValidData();
        if (validData) {
            const options = {
                ti_id: this.props.TaskID,
                userid: this.props.UserID,
                data: this.state.TaskResponse,
            };
            this.setState({
                LockSubmit: true
            });
            apiCall.post('/approved', options, (err, res, body) => {
                this.setState({
                    SubmitSuccess: true
                });
                window.location.href= '/';
                
                
            });
            
        } else {
            this.setState({
                LockSubmit: false
            });

            showMessage(this.props.Strings.InputErrorMessage);
        }
        
    }

    render() {
        let content = null;
        let infoMessage = null;
        let TA_rubric = null;
        let disputeButton = null;
        let TA_instructions = null;
        let formButtons = null;
        let fileUploadView = null;
        let fileLinksView = null;
        let revisionRejectView = null;
        let revisionApproveView = null;

        const indexer = 'content';
        const TA_rubricButtonText = this.state.ShowRubric ? this.props.Strings.HideTaskRubric : this.props.Strings.ShowTaskRubric;
        // if invalid data, shows error message

        if (this.state.Error) {
            return (<ErrorComponent />);
        }

        if (this.state.InputError) {
            infoMessage = (
                <span className="message-view" onClick={() => { this.setState({ InputError: false }); }}>{this.props.Strings.InputErrorMessage}</span>
            );
            // old Modal style:
            // infoMessage = (<Modal title="Submit Error"  close={this.modalToggle.bind(this)}>Please check your work and try again</Modal>);
        }

        if (this.state.SaveSuccess) {
            infoMessage = (<span className="message-view" onClick={() => { this.setState({ SaveSuccess: false }); }}>{this.props.Strings.SaveSuccessMessage}</span>);
        }
        if (this.state.SubmitSuccess) {
            infoMessage = (<span className="message-view" onClick={() => { this.setState({ SubmitSuccess: false }); }}>{this.props.Strings.SubmitSuccessMessage}</span>);
        }


        if (!this.props.TaskStatus.includes('complete')) {
            let submitButtonText = this.state.SubmitSuccess ? this.props.Strings.SubmitButtonSuccess : this.props.Strings.Submit;
            formButtons = (<div>
                <br />
                <button type="button" className="divider" onClick={this.submitData.bind(this)}><i className="fa fa-check" />{submitButtonText}</button>
                {/* <button type="button" className="divider" onClick={this.saveData.bind(this)}>{this.props.Strings.SaveForLater}</button>*/}
            </div>);
        }




        if (this.props.Rubric != '' && this.props.Rubric != null) { // if no Rubric
            let TA_rubric_content = <div></div>;
            if (this.state.ShowRubric) {
                TA_rubric_content = (
                    <div>
                        <div className="boldfaces">{this.props.Strings.TaskRubric}</div>
                        <MarkupText classNames="regular-text" key={'rubric'} content={this.props.Rubric} />

                    </div>
                );
            }

            TA_rubric = (<div key={'rub'}>
                <button type="button" className="float-button in-line" onClick={this.toggleRubric.bind(this)} key={'button'}> {TA_rubricButtonText}</button>
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
        if (this.props.FileUpload !== null && (this.props.FileUpload.mandatory !== 0 || this.props.FileUpload.optional !== 0)) {
            fileUploadView = (
                <div>

                    <FileUpload
                        View='button'
                        InitialNumberUploaded={this.state.NumberFilesStored}
                        PostVars={{
                            userId: this.props.UserID,
                            taskInstanceId: this.props.TaskID
                        }}
                        MinUploads={this.props.FileUpload.mandatory}
                        endpoint={'/api/upload/files'}
                        MaxUploads={this.props.FileUpload.mandatory + this.props.FileUpload.optional}
                        onChange={this.handleFileUploads.bind(this)}
                    />
                </div>
            );
        }

        if(this.state.NewFilesUploaded.length !== 0){
            fileLinksView = (<FileLinksComponent Files={this.state.NewFilesUploaded} />);

        }else{
            fileLinksView = (<FileLinksComponent Files={this.props.Files} />);
        }

        if (this.props.Instructions != null && this.props.Instructions != '') {
            TA_instructions = (
                <div >
                    <div className="boldfaces">{this.props.Strings.TaskInstructions}</div>
                    <MarkupText classNames="regular-text" key={'rubric'} content={this.props.Instructions} />
                </div>);
        }

        if (this.state.DisputeStatus === false) {
            let disputeButtonText = this.state.SubmitSuccess? this.props.Strings.DisputeButtonSuccess : this.props.Strings.WillDispute;
            let doNotDisputeButtonText = this.state.SubmitSuccess? this.props.Strings.DidNotDisputeButtonSuccess : this.props.Strings.WillNotDispute;
            return (
                <div className="">
                    {infoMessage}
                    <div className="section card-1">
                        <div className="placeholder" />
                        <div >
                            <h2 className="title">{this.props.ComponentTitle} </h2>
                        </div>
                        <div className="section-content">
                            {TA_instructions}
                            {fileLinksView}
                            <button className="dispute-buttons" onClick={this.willNotDispute.bind(this)}>{doNotDisputeButtonText}</button>
                            <button className="dispute-buttons" onClick={this.willDispute.bind(this)}>{disputeButtonText}</button>
                        </div>
                    </div>
                </div>);
        }

        if(this.props.IsRevision){
            let rejectButtonText = this.state.SubmitSuccess ? this.props.Strings.RejectButtonSuccess: this.props.Strings.RejectRevision;
            let approveButtonText = this.state.SubmitSuccess ? this.props.Strings.ApproveButtonSuccess : this.props.Strings.ApproveRevision;
            if([TASK_TYPES.COMMENT].includes(this.props.Type)){
                revisionRejectView =  <button className="revision-buttons" 
                    onClick={this.rejectRevision.bind(this)}>
                    {rejectButtonText}
                </button>;
                revisionApproveView = <button className="revision-buttons" 
                    onClick={this.approveRevision.bind(this)}>
                    {approveButtonText}
                </button>;
                formButtons = (
                    <div>
                        <br />
                        {revisionRejectView}
                        {revisionApproveView}
                    </div>);
            }
            
        } 
        if([TASK_TYPES.EDIT].includes(this.props.Type)){
            let approveButtonText = this.state.SubmitSuccess ? this.props.Strings.ApproveButtonSuccess : this.props.Strings.ApproveRevision;
            
            revisionApproveView = <button className="revision-buttons" 
                onClick={this.approveRevision.bind(this)}>
                {approveButtonText}
            </button>;
            formButtons = (
                <div>
                    <br />
                    {revisionApproveView}
                </div>);
        }


        if (this.props.TaskStatus.includes('complete')) {
            formButtons = (<div></div>);
        }


        // creating all input fields here
        const fields = this.state.TaskActivityFields.field_titles.map(function (title, idx) {
            let rubricView = null;
            let justification = null;
            let instructions = null;
            let fieldTitleText = '';
            let fieldTitle = null;
            let completeFieldView = null;
            const latestVersion = this.state.TaskResponse;

            if (latestVersion[idx] == null) {
                latestVersion[idx] = [this.state.TaskActivityFields[idx].default_content[0], this.state.TaskActivityFields[idx].default_content[1]];
            }
            if (this.state.TaskActivityFields[idx].show_title) { // shoudl the title be displayed or not
                if (this.state.TaskActivityFields[idx].assessment_type != null) { // add "Grade" to assess fields to make pretty
                    fieldTitleText = `${title} ${this.props.Strings.Grade}`;
                } else {
                    fieldTitleText = title;
                }

                fieldTitle = (<div>
                    <div key={idx + 600}>{fieldTitleText}</div>
                </div>);
            }

            if (this.state.TaskActivityFields[idx].rubric != '') { // if Rubric is empty, don't show anything
                let rubric_content = <div></div>;
                const buttonTextHelper = this.state.TaskActivityFields[idx].show_title ? title : '';
                const rubricButtonText = this.state.FieldRubrics[idx] ? this.props.Strings.HideRubric : this.props.Strings.ShowRubric;

                if (this.state.FieldRubrics[idx]) {
                    rubric_content = (
                        <div key={this.state.TaskActivityFields[idx].title}>
                            <div className="template-field-rubric-label"> {fieldTitleText} {this.props.Strings.Rubric} </div>
                            <div className="regular-text rubric">
                                {this.state.TaskActivityFields[idx].rubric}
                            </div>
                        </div>);
                }

                rubricView = (<div key={1200}>
                    <button
                        type="button"
                        className=" float-button in-line"
                        onClick={this.toggleFieldRubric.bind(this, idx)}
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

            if (this.state.TaskActivityFields[idx].instructions !== '') { // if instructions are empty, don't display anything
                instructions = (
                    <div key={1100}>
                        <div className="template-field-instructions-label">{fieldTitleText} {this.props.Strings.Instructions}</div>
                        <div className="regular-text instructions">
                            {this.state.TaskActivityFields[idx].instructions}
                        </div>
                    </div>
                );
            }

            if (this.state.TaskActivityFields[idx].requires_justification) {
                justification = (<div>
                    <div>{this.state.TaskActivityFields[idx].justification_instructions}</div>
                    <textarea
                        key={idx + 100}
                        className="big-text-field"
                        value={latestVersion[idx][1]}
                        onChange={this.handleJustificationChange.bind(this, idx)}
                        placeholder={this.props.Strings.JustificationPlaceholder}
                        disabled={this.state.TaskStatus === 'Complete'}
                    />
                </div>);
            }

            let fieldInput = null;
            switch (this.state.TaskActivityFields[idx].field_type) {
            case 'assessment':
            case 'self assessment':
                switch (this.state.TaskActivityFields[idx].assessment_type) {
                case 'grade':
                    fieldInput = (<div>
                        <input type="number" min={this.state.TaskActivityFields[idx].numeric_min} max={this.state.TaskActivityFields[idx].numeric_max} key={idx} className="number-input" value={latestVersion[idx][0]}
                            onChange={this.handleContentChange.bind(this, idx)} placeholder="..."
                            disabled={this.state.TaskStatus === 'Complete'}
                        />
                        <div>{this.props.Strings.Min}: {this.state.TaskActivityFields[idx].numeric_min}</div>
                        <div>{this.props.Strings.Max}: {this.state.TaskActivityFields[idx].numeric_max}</div>
                        <br/>
                    </div>);
                    break;
                case 'rating':
                    fieldInput = (<Rater total={this.state.TaskActivityFields[idx].rating_max} 
                        rating={latestVersion[idx][0]} 
                        onRate={this.handleStarChange.bind(this, idx)}
                        interactive={this.state.TaskStatus === 'Complete'}
                    />);
                    break;
                case 'pass':
                    fieldInput = (<div className="true-checkbox">
                        <RadioGroup
                            selectedValue={latestVersion[idx][0]} onChange={this.handleRadioChange.bind(this, idx)}
                        >
                            <label>{this.props.Strings.Pass} <Radio value={'pass'} /> </label>
                            <label>{this.props.Strings.Fail} <Radio value={'fail'} /> </label>

                        </RadioGroup>
                    </div>);
                    break;
                case 'evaluation':
                    let labels = this.state.TaskActivityFields[idx].list_of_labels;
                    if (typeof labels === 'string') {
                        labels = labels.split(',');
                    }
                    labels = labels.map(label => {
                        return {value: label, label: label};
                    });
                    fieldInput = (<div>
                        <label>{this.props.Strings.LabelDirections}</label>
                        <Select
                            key={idx + 1000}
                            options={labels}
                            selectedValue={latestVersion[idx][0]}
                            value={latestVersion[idx][0]}
                            onChange={this.handleSelectChange.bind(this, idx)}
                            clearable={false}
                            searchable={false}
                            disabled={this.state.TaskStatus === 'Complete'}
                            
                        />
                    </div>
                    );
                    break;
                default:
                    fieldInput = (<div />);
                    break;
                }
                break;
            case 'text':
                fieldInput = (<textarea key={idx} className="big-text-field" value={latestVersion[idx][0]} onChange={this.handleContentChange.bind(this, idx)} placeholder={this.props.Strings.InputPlaceholder} 
                    disabled={this.state.TaskStatus === 'Complete'}
                />);

                break;
            case 'numeric':

                fieldInput = (<input type="number" min={this.state.TaskActivityFields[idx].numeric_min} max={this.state.TaskActivityFields[idx].numeric_max} key={idx} className="number-input" value={latestVersion[idx][0]} 
                    onChange={this.handleContentChange.bind(this, idx)} placeholder="..."
                    disabled={this.state.TaskStatus === 'Complete'}
                />);


                break;
            default:
                fieldInput = (<div />);
                break;

            }
            const fieldContentBlock = (
                <div className="field-content" key={idx + 600}><b>{fieldTitleText}</b> {fieldInput}</div>
            );
            const latestVersionFieldView = (<div>
                {fieldInput}
                {justification}
            </div>);
            completeFieldView = (
                <div key={idx + 200}>
                    <div className="template-field-title">{fieldTitle}</div>
                    {instructions}
                    {rubricView}
                    <VersionView Versions={this.state.TaskData.slice(0, this.state.TaskData.length - 1)} Field={this.state.TaskActivityFields[idx]} FieldIndex={idx} Strings={this.props.Strings} />

                    {latestVersionFieldView}
                </div>
            );

            return completeFieldView;
        }, this);

        if (this.props.TaskStatus === 'Complete') {
            formButtons = (<div />);
        }

        if (this.state.ShowContent) {
            content = (<div className="section-content">
                {TA_instructions}
                {TA_rubric}
                {fileLinksView}
                {fileUploadView}
                {fields}
                {formButtons}
            </div>);
        } else {
            content = (<div />);
        }

        return ( // main render return()
          <div>
            {infoMessage}
            <div className="section card-2">
              <div onClick={this.toggleContent.bind(this)}>
                <h2 className="title">{this.props.ComponentTitle}</h2>
              </div>
              <CommentInfoComponent
                TargetID = {this.props.TaskID}
                Target = {'TaskInstance'}
                ComponentTitle = {this.props.ComponentTitle}
                showComments = {this.props.showComments}
              />
              {content}
            </div>
            </div>
        );
    }

}
SuperComponent.propTypes = {
    TaskActivityFields: PropTypes.object.isRequired,
    TaskData: PropTypes.array.isRequired,
    Strings: PropTypes.object.isRequired,
    ComponentTitle: PropTypes.string.isRequired,
    Instructions: PropTypes.string,
    Rubric: PropTypes.string,
    TaskStatus: PropTypes.array,
    Files: PropTypes.object,
    FileUpload: PropTypes.object.isRequired,
    Type: PropTypes.string.isRequired,

};

export default SuperComponent;
