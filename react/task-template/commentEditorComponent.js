/*
This is the Container for the task template page. It loads all the other components and puts the apporpriate data in them.
This Container also has the GET calls to fetch the data and passes it down to the other Components. The page uses tabs for
future stuff.

*/
import React from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';
var moment = require('moment');

class CommentEditorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NewCommentValue: '',
            NewCommentFlagValue: 0,
            NewCommentFlagColor: 'black',
        };
    }
    getEditData() {
      this.setState({
        NewCommentValue: this.props.CommentsText,
        NewCommentRating: this.props.Rating,
        NewCommentFlagValue: this.props.Flag
      })
      if (this.props.Flag == 1) {
        this.setState({NewFlagColor: 'red'});
      }
    }

    componentWillMount() {
      if (this.props.Edit) {
        this.getEditData();
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

    handleSubmit(event) {
        event.preventDefault();
        const commentParameters = {
            UserID: this.props.UserID,
            AssignmentInstanceID: 1, //placeholder for API
            TaskInstanceID: this.props.TaskID,
            Flag: this.state.NewCommentFlagValue,
            CommentsText: this.state.NewCommentValue,
            Rating: this.state.NewCommentRating,
            ReplyLevel: this.props.ReplyLevel,
            Parents: this.props.Parents,
            Time: moment().format('YYYY-MM-DD HH:mm:ss'),
            Status: 'submitted',
            CommentsID: this.props.CommentsID,

        };

        if (this.props.Edit) {
          if ((commentParameters.CommentsText == '') && (commentParameters.Rating == null)) {
            console.log('Edit comment: Text and rating cannot both be blank.');
            this.setState({CommentBlank: true});
          }

          else if ((this.props.UserID == this.props.CurrentUser) && ((this.props.CommentsID != this.props.NextParent) || (this.props.NextStatus == 'saved') || (this.props.UserType == 'teacher') || (this.props.Admin == true))) {
            apiCall.post('/comments/edit/', commentParameters, (err, res, body) => {
                if(!body.Error) {
                    console.log('Successfully edited comment.');
                    this.setState({CommentBlank: false});
                    this.props.Update(commentParameters.Status);
                }
                else {
                    console.log('Error editing comment.');
                }
            });
          }

          else{
            console.log('Editing access denied / The comment cannot be edited because there is already a reply.')
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
                    this.setState({NewCommentValue: '', NewCommentRating: null, NewCommentFlagColor: 'black', NewCommentFlagValue: 0, CommentBlank: false});
                    this.props.Update();
                } else if (res.statusCode == 400) {
                    console.log('Error submitting comments.');
                } else {
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
          AssignmentInstanceID: 1, //placeholder for API
          TaskInstanceID: this.props.TaskID,
          Flag: this.state.NewCommentFlagValue,
          CommentsText: this.state.NewCommentValue,
          Rating: this.state.NewCommentRating,
          ReplyLevel: this.props.ReplyLevel,
          Parents: this.props.Parents,
          Time: moment().format('YYYY-MM-DD HH:mm:ss'),
          Status: 'saved',
          CommentsID: this.props.CommentsID
      };

        if ((commentParameters.CommentsText == '') && (commentParameters.Rating == null)) {
          console.log('Save comment: Text and rating cannot both be blank.');
          this.setState({CommentBlank: true});
        }

        if (commentParameters.CommentsID == null) {
          apiCall.post('/comments/add/', commentParameters, (err, res, body) => {
              if(res.statusCode == 200) {
                  console.log('Successfully saved comment.');
                  this.setState({NewCommentValue: '', NewCommentRating: null, NewCommentFlagColor: 'black', NewCommentFlagValue: 0, CommentBlank: false, SaveSuccess: true});
                  this.props.Update();
              } else if (res.statusCode == 400) {
                  console.log('Error saving comments.');
                  this.setState({SaveSuccess: false});
              } else {
                  console.log('/comments/add: An error occurred.');
                  this.setState({SaveSuccess: false});
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

    render() {
        let strings = {
            ActionText: 'Add a new comment',
            EditText: 'Edit comment',
            EditSavedText: 'Edit saved comment',
            ButtonText0: 'Post',
            ButtonText1: 'Save for Later',
            PlaceHolderText: 'Comment text',
            ExplainFlagText: 'Explain why you flagged this comment',
            RatingLabel: 'Rating:',
            BlankMessage: 'The comment cannot be blank.',
            SuccessMessage: 'The comment was saved successfully.'
        };
        let IntroText = strings.ActionText;
        if (this.props.Status == 'saved') {
            IntroText = strings.EditSavedText;
        }
        else if (this.props.Edit) {
            IntroText = strings.EditText;
        }
        let ratingList = [{value: 0, label: '0'}, {value: 1, label: '1'}, {value: 2, label: '2'}, {value: 3, label: '3'}, {value: 4, label: '4'}, {value: 5, label: '5'}];

        let inputPlaceholderText;
        if (this.state.NewCommentFlagValue == 1) {
            inputPlaceholderText = strings.ExplainFlagText;
        }
        else {
            inputPlaceholderText = strings.PlaceHolderText;
        }

        return (
          <div className="comment">
          {
            (this.state.CommentBlank) && (<div className="error form-error">
            <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i><span>{strings.BlankMessage}</span>
            </div>)
          }
          {
            (this.state.SaveSuccess && this.props.Edit) && (<div className="success form-success">
            <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i><span>{strings.SuccessMessage}</span>
            </div>)
          }

          <form role="form">
              <div className="title-no-hover">{IntroText}</div>
              <label style={{padding: 10}}>{strings.RatingLabel}</label>
              <div style={{width: 50, display: 'inline-flex'}} ><Select placeholder='' style={{width: 'inherit'}} options={ratingList} value={this.state.NewCommentRating} onChange={this.handleChangeRating.bind(this)} resetValue={null} clearable={true} searchable={true}/></div>
              <i className="fa fa-flag" style={{color:this.state.NewCommentFlagColor, padding: 10}} onClick={this.handleFlagClick.bind(this)} onMouseEnter={this.handleMouseEnterFlag.bind(this)} onMouseLeave={this.handleMouseLeaveFlag.bind(this)}></i>
              <div className="regular-text comtext">
                  <input placeholder={inputPlaceholderText} type="text" value={this.state.NewCommentValue} onChange={this.handleChangeText.bind(this)}/>
                  <button onClick={this.handleSubmit.bind(this)}>{strings.ButtonText0}</button>
                  {(this.props.Status != 'submitted') && (<button onClick={this.handleSave.bind(this)}>{strings.ButtonText1}</button>)}
              </div>
          </form>
          </div>
        );
    }
}

export default CommentEditorComponent;
