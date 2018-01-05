
/* This Component is preparatio for a future commenting system. It is passed down important data like author and Content
* and is light enough to be reused. It simply shows the data. TemplateContainer will probably need ot fetc the relevant comment data
* from the database.
*/
import React from 'react';
import apiCall from '../shared/apiCall';
import CommentEditorComponent from './commentEditorComponent';
import Tooltip from '../shared/tooltip';
var moment = require('moment');

class CommentComponent extends React.Component{
    constructor(props){
        super(props);

        this.state={
          showEditor: false,
          showFlagEditor: false,
          editExistingComment: false,
          CommentChangeMessage: '',
          CommentHideMessage: '',
          HideReasonValue: '',
          CommentFlagValue: this.props.Comment.Flag,
          CommentFlagDisplay: (this.props.Comment.Flag == 1) ? 'on' : 'off',
          ShowAuthor: false
        };
    }
    componentWillMount() {
      if (this.props.Comment.Status == 'saved') {
        this.setState({editExistingComment: true});
      }
      else {
        apiCall.post('/comments/viewed/', {CommentsID: this.props.Comment.CommentsID, UserID: this.props.CurrentUser, Time: moment().format('YYYY-MM-DD HH:mm:ss')}, (err, res, body) => {
            if(res.statusCode == 200) {
                console.log('Successfully logged view.');
            } else if (res.statusCode == 400) {
                console.log('Error logging view.');
            } else {
                console.log('/comments/viewed: An error occurred.');
            }
        });
      }
      this.getAuthor();
    }

    componentDidMount() {
        this.props.scroll();
    }

    displayNewEditor() {
      if (!this.state.showEditor) {
        this.setState({showEditor: true});
      }
      else {
        this.setState({showEditor: false});
      }
    }

    displayNewFlagEditor() {
      if (!this.state.showFlagEditor) {
        this.setState({showFlagEditor: true});
      }
      else {
        this.setState({showFlagEditor: false});
      }
    }

    editExistingComment() {
      if ((this.props.NextParent == this.props.Comment.CommentsID) && (this.props.NextStatus != 'saved') && (this.props.UserType == 'student')) {
        console.log('Cannot edit comment if it has replies.')
        this.setState({CommentChangeMessage: 'edit-replies'});
      }
      else if ((this.props.Comment.UserID == this.props.CurrentUser) || (this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        this.setState({editExistingComment: true});
      }
      this.props.Update(this.props.Comment.CommentTarget, this.props.Comment.TargetID);
    }

    endReply() {
      this.setState({showEditor: false, showFlagEditor: false});
      this.props.Update(this.props.Comment.CommentTarget, this.props.Comment.TargetID);
    }

    endEdit(status, target, targetID) {
      this.props.Update(this.props.Comment.CommentTarget, this.props.Comment.TargetID);
      if (status != 'saved') {
        this.setState({editExistingComment: false});
      }
    }

    showChangeMessage() {
      if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        if ((this.props.NextParent == this.props.Comment.CommentsID) && (this.props.NextStatus != 'saved')) {
          this.setState({CommentChangeMessage: 'delete-replies'});
        }
        else {
          this.setState({CommentChangeMessage: 'delete-singleComment'})
        }
      }
      else {
        console.log('showChangeMessage: Cannot modify comment. Access denied.')
      }
    }

    showConfirmMessage() {
        if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
            this.setState({CommentChangeMessage:'unhide'});
        }
    }

    closeChangeMessage() {
      this.setState({CommentChangeMessage: ''});
    }

    deleteExistingComment() {
      if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        apiCall.post('/comments/delete/', {CommentsID: this.props.Comment.CommentsID}, (err, res, body) => {
            if(body.Message == 'Success') {
                console.log('Successfully deleted comment.');
                this.props.Update(this.props.Comment.CommentTarget, this.props.Comment.TargetID);
            }
            else {
                console.log('Error deleting comment.');
            }
        });
      }
    }

    showHideMessage(target) {
      if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        if(target == 'comment') {
          this.setState({CommentHideMessage: 'comment'});
        }
        if(target == 'rating') {
          this.setState({CommentHideMessage: 'rating'});
        }
      }
    }

    closeHideMessage() {
      this.setState({CommentHideMessage: ''});
    }

    handleChangeHideReason(event) {
      this.setState({HideReasonValue: event.target.value});
    }

    hideExistingComment(event) {
      console.log(this.state.HideReasonValue)
      event.preventDefault();
      if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        apiCall.post('/comments/hide', {CommentsID: this.props.Comment.CommentsID, HideReason: this.state.HideReasonValue, HideType: this.state.CommentHideMessage}, (err, res, body) => {
          if(!body.Error) {
            console.log('Successfully hid comment.')
            this.setState({CommentChangeMessage: '', CommentHideMessage: '', HideReasonValue: ''})
            this.props.Update(this.props.Comment.CommentTarget, this.props.Comment.TargetID);
          }
          else {
            console.log('Error hiding comment.');
          }
        });
      }
    }

    unhideExistingComment() {
      if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        console.log('unhide started')
        apiCall.post('/comments/unhide', {CommentsID: this.props.Comment.CommentsID}, (err, res, body) => {
          if(!body.Error) {
            console.log('Successfully unhid comment.')
            this.setState({CommentChangeMessage: ''})
            this.props.Update(this.props.Comment.CommentTarget, this.props.Comment.TargetID);
          }
          else {
            console.log('Error unhiding comment.');
          }
        });
      }
    }

    handleFlagClick() {
        if (this.state.CommentFlagValue == 0) {
            this.setState({CommentFlagDisplay: 'on', CommentFlagValue: 1});
            apiCall.post('/comments/setFlag/', {CommentsID: this.props.Comment.CommentsID, UserID: this.props.CurrentUser, Time: moment().format('YYYY-MM-DD HH:mm:ss')}, (err, res, body) => {
                if(!body.Error) {
                    console.log('Successfully set flag.');
                    this.setState({CommentChangeMessage: 'flag-set'});
                } else {
                    console.log('/comments/setFlag: An error occurred.');
                }
            });
        }
        else {
            this.setState({CommentFlagDisplay: 'off', CommentFlagValue: 0});
            apiCall.post('/comments/removeFlag/', {CommentsID: this.props.Comment.CommentsID, UserID: this.props.CurrentUser, Time: moment().format('YYYY-MM-DD HH:mm:ss')}, (err, res, body) => {
                if(!body.Error) {
                    console.log('Successfully removed flag.');
                    this.setState({CommentChangeMessage: 'flag-removed'});
                } else {
                    console.log('/comments/removeFlag: An error occurred.');
                }
            });
        }
    }

    handleMouseEnterFlag() {
        if (this.state.CommentFlagDisplay == 'off') {
            this.setState({CommentFlagDisplay: 'on'});
        }
    }

    handleMouseLeaveFlag() {
        if (this.state.CommentFlagDisplay == 'on' && this.state.CommentFlagValue == 0) {
            this.setState({CommentFlagDisplay: 'off'});
        }
    }

    getAuthor() {
        apiCall.get(`/generalUser/${this.props.Comment.UserID}`, (err, res, body) => {
            if (!body.Error) {
              this.setState({Author: body.User.FirstName.concat(' ').concat(body.User.LastName)});
            }
            else {
              console.log('No comment user data received.');
            }
        });
    }

    displayAuthor() {
        this.setState({ShowAuthor: true});
    }

    hideAuthor() {
        this.setState({ShowAuthor: false});
    }

    render(){
        let strings = {
            CommentLabel: ' Comment',
            FlagLabel: ' Flag',
            RatingLabel: 'Rating:',
            ReplyLabel: 'Reply',
            CancelLabel: 'Cancel Reply',
            CancelFlagLabel: 'Cancel Flag',
            EditLabel: 'Edit',
            DeleteLabel: 'Delete',
            HideLabel: 'Hide',
            UnhideLabel: 'Unhide',
            DiscardEditsLabel: 'Discard Edits',
            DiscardSavedLabel: 'Discard',
            RepliesMessage: 'Sorry, you cannot delete a comment or flag if it has a reply.',
            EditRepliesMessage: 'Sorry, you cannot edit a comment or flag if it has a reply.',
            DeleteConfirmMessage: 'Are you sure you want to delete this comment or flag?',
            DeleteConfirmMessageReplies: 'Are you sure you want to delete this comment or flag and all of its replies?',
            YesText: 'Yes',
            NoText: 'No',
            CancelText: 'Cancel',
            CommentHiddenText: 'Hidden Comment',
            HiddenText: 'Hidden',
            HideReasonPlaceholderText: 'Explain why you are hiding this comment or flag.',
            HideRatingReasonPlaceholderText: 'Explain why you are hiding this rating.',
            FlagResultSet: 'Flag activated',
            FlagResultRemoved: 'Flag deactivated',
            EditedLabel: 'Edited',
            ShowAuthorLabel: 'Show Author',
            HideAuthorLabel: 'Hide Author',
            AuthorLabel: 'Author: ',
            FlagThisLabel: 'Flag This',
            UnhideConfirmMessage: 'Are you sure you want to unhide this comment or rating?'
        };

        let backgroundColor;
        if (this.props.Emphasize) {
            backgroundColor = '#ffffc4';
        }

        let typeName = strings.CommentLabel;
        if (this.props.Comment.Type == 'flag') {
            typeName = strings.FlagLabel;
        }

        console.log(this.props.TaskID, 'this one');

        return (
            <div style={{margin: '0 auto'}}>
            {(!this.state.editExistingComment && (this.props.Comment.HideType != 'comment')) &&
            (<div style={{marginLeft: this.props.Comment.ReplyLevel*30, backgroundColor: backgroundColor}} className="comment">

              {
                (this.state.CommentChangeMessage != '') && (<div className="error form-error">
                <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>
                  {(this.state.CommentChangeMessage == 'flag-set') && (<span>{strings.FlagResultSet}</span>)}
                  {(this.state.CommentChangeMessage == 'flag-removed') && (<span>{strings.FlagResultRemoved}</span>)}
                  {(this.state.CommentChangeMessage == 'edit-replies') && (<span>{strings.EditRepliesMessage}</span>)}
                  {(this.state.CommentChangeMessage == 'delete-replies') && (<span>{strings.DeleteConfirmMessageReplies}</span>)}
                  {(this.state.CommentChangeMessage == 'unhide') && (<span>{strings.UnhideConfirmMessage}</span>)}
                  {(this.state.CommentChangeMessage == 'delete-singleComment') && (<span>{strings.DeleteConfirmMessage}</span>)}<br />
                  {((this.state.CommentChangeMessage == 'delete-replies') || (this.state.CommentChangeMessage == 'delete-singleComment')) && (
                    <div>
                      <button onClick={this.deleteExistingComment.bind(this)}>{strings.YesText}</button>
                      <button onClick={this.closeChangeMessage.bind(this)}>{strings.NoText}</button>
                    </div>
                  )}
                  {(this.state.CommentChangeMessage == 'unhide') && (
                    <div>
                      <button onClick={this.unhideExistingComment.bind(this)}>{strings.YesText}</button>
                      <button onClick={this.closeChangeMessage.bind(this)}>{strings.NoText}</button>
                    </div>
                  )}
                  </div>)
              }

              {this.props.Comment.Type == 'flag' ?
              ((this.props.UserType == 'teacher') || (this.props.Admin == true)) ? ((this.state.CommentFlagDisplay =='on') ? (<i className="fa fa-flag" style={{color:'red'}} onClick={this.handleFlagClick.bind(this)} onMouseEnter={this.handleMouseEnterFlag.bind(this)} onMouseLeave={this.handleMouseLeaveFlag.bind(this)}></i>) : (<i className="fa fa-flag-o" style={{color:'gray'}} onClick={this.handleFlagClick.bind(this)} onMouseEnter={this.handleMouseEnterFlag.bind(this)} onMouseLeave={this.handleMouseLeaveFlag.bind(this)}></i>)):
              ((this.state.CommentFlagDisplay =='on') ? (<i className="fa fa-flag" style={{color:'red'}}></i>) : (<i className="fa fa-flag-o" style={{color:'gray'}}></i>))
              : (this.props.Comment.ReplyLevel == 0 ? <i className="fa fa-comment-o" aria-hidden="true"></i> : <i className="fa fa-reply" aria-hidden="true"></i>
)
              }

              {/* <div className="title"></div> */}
              {((this.props.Comment.Rating != null) && (this.props.Comment.HideType != 'rating')) && (
                <div style={{display: 'inline'}}>
                  <label style={{padding: 10, paddingLeft: 5}}>{strings.RatingLabel}</label><span style={{paddingRight: 10}}>{this.props.Comment.Rating} / 5</span>
                  {((this.props.UserType == 'teacher') || (this.props.Admin == true)) && (<div className="title"><a onClick={this.showHideMessage.bind(this, 'rating')}>{strings.HideLabel.concat(typeName)}</a></div>)}
                </div>
              )}

              {(this.props.Comment.HideType == 'rating') && (
                <div style={{display: 'inline'}}>
                  <label style={{padding: 10, paddingLeft: 5}}>{strings.RatingLabel}</label><span style={{paddingRight: 10}}>{strings.HiddenText}<Tooltip Text={this.props.Comment.HideReason}/></span>
                  {((this.props.UserType == 'teacher') || (this.props.Admin == true)) && (<div className="title"><a onClick={this.unhideExistingComment.bind(this)}>{strings.UnhideLabel.concat(typeName)}</a></div>)}
                </div>
              )}

              <div className="timestamp" style={{display: 'inline'}}>{(this.props.Comment.Edited == 1) && (<span>{strings.EditedLabel}</span>)} {moment(this.props.Comment.Time).format('dddd, MMMM Do YYYY, h:mm:ss a')}</div>
              <div className="regular-text comtext">{this.props.Comment.CommentsText}</div>
              <div className="title"><a onClick={this.displayNewEditor.bind(this)}>{strings.ReplyLabel}</a></div>
              <div className="title"><a onClick={this.displayNewFlagEditor.bind(this)}>{strings.FlagThisLabel}</a></div>
              {((((this.props.Comment.UserID == this.props.CurrentUser) && ((this.props.NextParent != this.props.Comment.CommentsID) || (this.props.NextStatus == 'saved'))) || (this.props.UserType == 'teacher') || (this.props.Admin == true)) && !this.state.showEditor) && (<div className="title"><a onClick={this.editExistingComment.bind(this)}>{strings.EditLabel.concat(typeName)}</a></div>)}
              {(!this.state.showEditor && (this.props.UserType == 'teacher') || (this.props.Admin == true)) && (
                <div style={{display: 'inline'}}>
                  <div className="title"><a onClick={this.showHideMessage.bind(this, 'comment')}>{strings.HideLabel.concat(typeName)}</a></div>
                  <div className="title"><a onClick={this.showChangeMessage.bind(this)}>{strings.DeleteLabel.concat(typeName)}</a></div>
                  {!this.state.ShowAuthor && <div className="title"><a onClick={this.displayAuthor.bind(this)}>{strings.ShowAuthorLabel}</a></div>}
                  {this.state.ShowAuthor && <div className="title"><a onClick={this.hideAuthor.bind(this)}>{strings.HideAuthorLabel}</a></div>}
                  {this.state.ShowAuthor && <Tooltip Text={strings.AuthorLabel.concat(this.state.Author)}/>}
                </div>
              )}
              {((this.state.CommentHideMessage == 'comment') || (this.state.CommentHideMessage == 'rating')) && (
                <form role="form" onSubmit={this.hideExistingComment.bind(this)}>
                  <input placeholder={(this.state.CommentHideMessage == 'rating') ? strings.HideRatingReasonPlaceholderText : strings.HideReasonPlaceholderText} type="text" value={this.state.HideReasonValue} onChange={this.handleChangeHideReason.bind(this)} required/>
                  <button type="submit">{strings.HideLabel.concat(typeName)}</button>
                  <button onClick={this.closeHideMessage.bind(this)}>{strings.CancelText}</button>
                </form>
              )}
            </div>)
          }

            {(this.props.Comment.HideType == 'comment') &&
              (<div style={{marginLeft: this.props.Comment.ReplyLevel*30, backgroundColor: '#dbdbdb'}} className="comment">

                {
                  (this.state.CommentChangeMessage != '') && (<div className="error form-error">
                  <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>
                    <span>{(this.state.CommentChangeMessage == 'delete-replies') && strings.DeleteConfirmMessageReplies}</span>
                    <span>{(this.state.CommentChangeMessage == 'delete-singleComment') && strings.DeleteConfirmMessage}</span><br />
                    <button onClick={this.deleteExistingComment.bind(this)}>{strings.YesText}</button>
                    <button onClick={this.closeChangeMessage.bind(this)}>{strings.NoText}</button>
                  </div>
                )}

                <div className="regular-text comtext">{strings.CommentHiddenText + ': ' + this.props.Comment.HideReason}</div>
                {((this.props.UserType == 'teacher') || (this.props.Admin == true)) && (
                  <div style={{display: 'inline'}}>
                    <div className="title"><a onClick={this.unhideExistingComment.bind(this)}>{strings.UnhideLabel.concat(typeName)}</a></div>
                    <div className="title"><a onClick={this.showChangeMessage.bind(this)}>{strings.DeleteLabel.concat(typeName)}</a></div>
                  </div>
                )}

                <div className="title"><a onClick={this.showChangeMessage.bind(this)}>{strings.DeleteLabel.concat(typeName)}</a></div>

              </div>)
          }
            {this.state.editExistingComment &&
              (<div style={{marginLeft: this.props.Comment.ReplyLevel*30}} className="comment">
                  <CommentEditorComponent
                    UserID={this.props.Comment.UserID}
                    CurrentUser={this.props.CurrentUser}
                    TargetID={this.props.Comment.TargetID}
                    TaskID={this.props.TaskID}
                    Update={this.endEdit.bind(this)}
                    ReplyLevel={this.props.Comment.ReplyLevel}
                    Parents={this.props.Comment.Parents}
                    NextParent={this.props.NextParent}
                    NextStatus={this.props.NextStatus}
                    CommentsText={this.props.Comment.CommentsText}
                    Rating={this.props.Comment.Rating}
                    Flag={this.props.Comment.Flag}
                    CommentsID={this.props.Comment.CommentsID}
                    UserType={this.props.UserType}
                    Admin={this.props.Admin}
                    Status={this.props.Comment.Status}
                    CommentTarget={this.props.Comment.CommentTarget}
                    CommentTargetList={this.props.CommentTargetList}
                    AssignmentInstanceID={this.props.Comment.AssignmentInstanceID}
                    Type={this.props.Comment.Type}
                    Edit={true}
                  />
                  {(this.props.Comment.Status != 'saved') && (<div className="title"><a onClick={this.endEdit.bind(this)}>{strings.DiscardEditsLabel}</a></div>)}
                  {(this.props.Comment.Status == 'saved') && (<div className="title"><a onClick={this.deleteExistingComment.bind(this)}>{strings.DiscardSavedLabel.concat(typeName)}</a></div>)}

                </div>)
          }

            {this.state.showEditor &&
              (<div style={{marginLeft: (this.props.Comment.ReplyLevel + 1)*30}} className="comment">
                  <CommentEditorComponent
                    UserID={this.props.CurrentUser}
                    TargetID={this.props.Comment.TargetID}
                    TaskID={this.props.TaskID}
                    Update={this.endReply.bind(this)}
                    ReplyLevel={this.props.Comment.ReplyLevel + 1}
                    Parents={this.props.Comment.CommentsID}
                    CommentTarget={this.props.Comment.CommentTarget}
                    AssignmentInstanceID={this.props.Comment.AssignmentInstanceID}
                    CommentTargetList={this.props.CommentTargetList}
                  />
                  <div className="title"><a onClick={this.displayNewEditor.bind(this)}>{strings.CancelLabel}</a></div>
                </div>)
            }

            {this.state.showFlagEditor &&
              (<div style={{marginLeft: (this.props.Comment.ReplyLevel + 1)*30}} className="comment">
                  <CommentEditorComponent
                    UserID={this.props.CurrentUser}
                    TargetID={this.props.Comment.TargetID}
                    TaskID={this.props.TaskID}
                    Update={this.endReply.bind(this)}
                    ReplyLevel={this.props.Comment.ReplyLevel + 1}
                    Parents={this.props.Comment.CommentsID}
                    CommentTarget={this.props.Comment.CommentTarget}
                    AssignmentInstanceID={this.props.Comment.AssignmentInstanceID}
                    SetFlag={true}
                      CommentTargetList={this.props.CommentTargetList}
                  />
                  <div className="title"><a onClick={this.displayNewFlagEditor.bind(this)}>{strings.CancelFlagLabel}</a></div>
              </div>)
          }

          </div>
        );
    }
}
export default CommentComponent;
