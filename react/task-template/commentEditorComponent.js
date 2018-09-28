/*
This is the Container for the task template page. It loads all the other components and puts the apporpriate data in them.
This Container also has the GET calls to fetch the data and passes it down to the other Components. The page uses tabs for
future stuff.

*/
import React from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';
import { ROLES, canRoleAccess } from '../../server/utils/react_constants';

var moment = require('moment');

class CommentEditorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NewCommentValue: '',
            NewCommentFlagValue: 0,
            NewCommentFlagColor: 'black',
            NewCommentType: this.props.SetFlag ? 'flag' : 'comment',
        };
    }
    getEditData() {
        this.setState({
            NewCommentValue: this.props.CommentsText,
            NewCommentRating: this.props.Rating,
            NewCommentFlagValue: this.props.Flag
        });
        if (this.props.Flag == 1) {
            this.setState({NewFlagColor: 'red'});
        }
    }

    componentDidMount() {
        if (this.props.Edit) {
            this.editCommentTarget(this.props.CommentTarget, this.props.TargetID);
            this.getEditData();
        }
        else {
            this.setState({NewCommentTarget: this.props.CommentTargetOnList});
            //console.log(this.props.CommentTargetList[this.props.CommentTargetOnList].label);
        }

        if (this.props.Type != undefined) {
            this.setState({NewCommentType: this.props.Type});
        }
        if (this.props.SetFlag) {
            this.setState({NewCommentFlagValue: 1});
        }
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.CommentTargetOnList != this.state.NewCommentTarget) && !this.props.Edit) {
            this.setState({NewCommentTarget: this.props.CommentTargetOnList});
        }
    }

    handleChangeText(event) {
        this.setState({NewCommentValue: event.target.value});
    }

    handleChangeRating(event) {
        if (event == null){
            this.setState({NewCommentRating: null});
        }
        else {
            this.setState({NewCommentRating: event.value});
        }
    }

    handleChangeType(event) {
        if (event == null){
            this.setState({NewCommentType: null});
        }
        else {
            this.setState({NewCommentType: event.value});
            if (event.value == 'flag') {
                this.setState({NewCommentFlagValue: 1});
            }
            else {
                this.setState({NewCommentFlagValue: 0});
            }
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        const commentParameters = {
            UserID: this.props.UserID,
            AssignmentInstanceID: this.props.AssignmentInstanceID,
            TargetID: (this.props.ReplyLevel > 0) ? this.props.TargetID : this.props.CommentTargetList[this.state.NewCommentTarget].ID,
            Flag: this.state.NewCommentFlagValue,
            CommentsText: this.state.NewCommentValue,
            Rating: this.state.NewCommentRating,
            ReplyLevel: this.props.ReplyLevel,
            Parents: this.props.Parents,
            Time: moment().format('YYYY-MM-DD HH:mm:ss'),
            Status: 'submitted',
            CommentsID: this.props.CommentsID,
            CommentTarget: (this.props.ReplyLevel > 0) ? this.props.CommentTarget : this.props.CommentTargetList[this.state.NewCommentTarget].Target,
            Type: this.state.NewCommentType,
            OriginTaskInstanceID: this.props.TaskID,
        };

        if (this.props.Edit) {
            if ((commentParameters.CommentsText == '') && (commentParameters.Rating == null)) {
                console.log('Edit comment: Text and rating cannot both be blank.');
                this.setState({CommentBlank: true});
            }

            else if (((this.props.UserID == this.props.CurrentUser) && ((this.props.CommentsID != this.props.NextParent)) || (this.props.NextStatus == 'saved') || canRoleAccess(this.props.UserType, ROLES.TEACHER))) {
                apiCall.post('/comments/edit/', commentParameters, (err, res, body) => {
                    if(!body.Error) {
                        console.log('Successfully edited comment.');
                        this.setState({CommentBlank: false});
                        this.props.Update(commentParameters.Status, commentParameters.Target, commentParameters.TargetID);
                    }
                    else {
                        console.log('Error editing comment.');
                    }
                });
            }

            else{
                console.log('Editing access denied / The comment cannot be edited because there is already a reply.');
            }
        }

        else {

            if ((commentParameters.CommentsText == '') && (commentParameters.Rating == null)) {
                console.log('Add comment: Text and rating cannot both be blank.');
                this.setState({CommentBlank: true});
            }

            else {
                apiCall.post('/comments/add', commentParameters, (err, res, body) => {
                    if(res.statusCode == 200) {
                        console.log('Successfully added comment.');
                        this.setState({NewCommentValue: '', NewCommentRating: null, NewCommentFlagColor: 'black', NewCommentFlagValue: 0, CommentBlank: false, SubmitSuccess: true, Error: false});
                        this.props.Update(commentParameters.CommentTarget, commentParameters.TargetID);
                    } else if (res.statusCode == 400) {
                        this.setState({SubmitSuccess: false, Error: true});
                        console.log('Error submitting comments.');
                    } else {
                        this.setState({SubmitSuccess: false, Error: true});
                        console.log('/comments/add: An error occurred.');
                    }
                });
            }
        }
    }

    handleSave(event) {
        event.preventDefault();
        const commentParameters = {
            UserID: this.props.UserID,
            AssignmentInstanceID: this.props.AssignmentInstanceID,
            TargetID: (this.props.ReplyLevel > 0) ? this.props.TargetID : (this.props.Edit ? null : this.props.CommentTargetList[this.state.NewCommentTarget].ID),
            Flag: this.state.NewCommentFlagValue,
            CommentsText: this.state.NewCommentValue,
            Rating: this.state.NewCommentRating,
            ReplyLevel: this.props.ReplyLevel,
            Parents: this.props.Parents,
            Time: moment().format('YYYY-MM-DD HH:mm:ss'),
            Status: 'saved',
            CommentsID: this.props.CommentsID,
            Type: this.state.NewCommentType,
            CommentTarget: (this.props.ReplyLevel > 0) ? this.props.CommentTarget : (this.props.Edit ? null : this.props.CommentTargetList[this.state.NewCommentTarget].Target),
            OriginTaskInstanceID: this.props.TaskID,
        };

        if ((commentParameters.CommentsText == '') && (commentParameters.Rating == null)) {
            console.log('Save comment: Text and rating cannot both be blank.');
            this.setState({CommentBlank: true});
        }

        else if (commentParameters.CommentsID == null) {
            apiCall.post('/comments/add/', commentParameters, (err, res, body) => {
                if(res.statusCode == 200) {
                    console.log('Successfully saved comment.');
                    this.setState({NewCommentValue: '', NewCommentRating: null, NewCommentFlagColor: 'black', NewCommentFlagValue: 0, CommentBlank: false, SaveSuccess: true, Error: false});
                    this.props.Update(commentParameters.CommentTarget, commentParameters.TargetID);
                } else if (res.statusCode == 400) {
                    console.log('Error saving comments.');
                    this.setState({SaveSuccess: false, Error: true});
                } else {
                    console.log('/comments/add: An error occurred.');
                    this.setState({SaveSuccess: false, Error: true});
                }
            });
        }

        else {
            apiCall.post('/comments/edit/', commentParameters, (err, res, body) => {
                if(!body.Error) {
                    console.log('Successfully edited saved comment.');
                    this.setState({CommentBlank: false, SaveSuccess: true});
                    this.props.Update(commentParameters.Status);
                }
                else {
                    console.log('Error editing comment.');
                    this.setState({SaveSuccess: false});
                }
            });
        }
    }

    handleFlagClick() {
        if (this.state.NewCommentFlagValue == 0) {
            this.setState({NewCommentFlagColor: 'red', NewCommentFlagValue: 1});
        }
        else {
            this.setState({NewCommentFlagColor: 'black', NewCommentFlagValue: 0});
        }
    }

    handleMouseEnterFlag() {
        if (this.state.NewCommentFlagColor == 'black') {
            this.setState({NewCommentFlagColor: 'red'});
        }
    }

    handleMouseLeaveFlag() {
        if (this.state.NewCommentFlagColor == 'red' && this.state.NewCommentFlagValue == 0) {
            this.setState({NewCommentFlagColor: 'black'});
        }
    }

    handleChangeTarget(event) {
        this.setState({NewCommentTarget: event.value});
    }

    editCommentTarget(target, id) {
        let m;
        for (let i of this.props.CommentTargetList) {
            if ((i.Target == target) && (i.ID == id)) {
                m = i.value;
                console.log('ect', m);
            }
            this.setState({NewCommentTarget: m});
        }
    }

    render() {
        let strings = {
            ActionText: 'Add a new ',
            EditText: 'Edit ',
            EditSavedText: 'Edit saved ',
            ButtonText0: 'Post',
            ButtonText1: 'Save for Later',
            PlaceHolderText: 'Enter a comment and/or rate this above',
            ExplainFlagText: 'Explain why you flagged this comment',
            RatingLabel: 'Rating:',
            BlankMessage: 'The comment or flag cannot be blank.',
            SuccessMessage: 'The comment or flag was saved successfully.',
            SubmitSuccessMessage: 'The comment or flag was submitted successfully.',
            ErrorMessage: 'An error occurred.',
            Comment: 'comment',
            Flag: 'flag',
            OnText: 'on '
        };
        let IntroText = strings.ActionText;
        if (this.props.Status == 'saved') {
            IntroText = strings.EditSavedText;
        }
        else if (this.props.Edit) {
            IntroText = strings.EditText;
        }
        let ratingList = [{value: 0, label: '0'}, {value: 1, label: '1'}, {value: 2, label: '2'}, {value: 3, label: '3'}, {value: 4, label: '4'}, {value: 5, label: '5'}];

        let inputPlaceholderText = strings.PlaceHolderText;
        if (this.state.NewCommentFlagValue == 1) {
            inputPlaceholderText = strings.ExplainFlagText;
        }

        return (
            <div className="comment">
                {
                    (this.state.CommentBlank) && (<div className="error form-error">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i><span>{strings.BlankMessage}</span>
                    </div>)
                }
                {
                    (this.state.SaveSuccess) && (<div className="success form-success">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i><span>{strings.SuccessMessage}</span>
                    </div>)
                }
                {
                    (this.state.SubmitSuccess) && (<div className="success form-success">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i><span>{strings.SubmitSuccessMessage}</span>
                    </div>)
                }
                {
                    (this.state.Error) && (<div className="error form-error">
                        <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i><span>{strings.ErrorMessage}</span>
                    </div>)
                }

                <form role="form">
                    <div className="title-no-hover">{IntroText}</div>
                    <div style={{width: 110, height: 10, display: 'inline-flex'}}><Select placeholder='' style={{width: 100}} options={[{value: 'comment', label: strings.Comment}, {value: 'flag', label: strings.Flag}]} value={this.state.NewCommentType} onChange={this.handleChangeType.bind(this)} clearable={false}/></div>
                    {((this.props.ReplyLevel == 0) && (this.props.Edit == false)) && (<span style={{padding: 10}}>{strings.OnText.concat(this.props.CommentTargetList[this.props.CommentTargetOnList].label)}</span>)}
                    {/*{(this.props.ReplyLevel == 0) &&
                  (<div style={{width: 320, display: 'inline-flex'}}>
                      <Select options={this.props.CommentTargetList} value={this.state.NewCommentTarget} onChange={this.handleChangeTarget.bind(this)} clearable={false} searchable={true} required/>
                  </div>)}*/}
                    {(this.state.NewCommentType == 'comment') && <label style={{padding: 10}}>{strings.RatingLabel}</label>}
                    {(this.state.NewCommentType == 'comment') && <div style={{width: 50, height: 10, display: 'inline-flex'}} ><Select placeholder='' style={{width: 'inherit'}} options={ratingList} value={this.state.NewCommentRating} onChange={this.handleChangeRating.bind(this)} resetValue={null} clearable={true} searchable={true}/></div>}
                    <div className="regular-text comtext">
                        <input placeholder={inputPlaceholderText} type="text" maxLength="255" value={this.state.NewCommentValue} onChange={this.handleChangeText.bind(this)}/>
                        <button onClick={this.handleSubmit.bind(this)}>{strings.ButtonText0}</button>
                        {(this.props.Status != 'submitted') && (<button onClick={this.handleSave.bind(this)}>{strings.ButtonText1}</button>)}
                    </div>
                </form>
            </div>
        );
    }
}

export default CommentEditorComponent;
