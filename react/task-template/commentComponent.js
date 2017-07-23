
/* This Component is preparatio for a future commenting system. It is passed down important data like author and Content
* and is light enough to be reused. It simply shows the data. TemplateContainer will probably need ot fetc the relevant comment data
* from the database.
*/
import React from 'react';
import apiCall from '../shared/apiCall';
import CommentEditorComponent from './commentEditorComponent';
var moment = require('moment');

class CommentComponent extends React.Component{
    constructor(props){
        super(props);

        this.state={
          showEditor: false,
          editExistingComment: false,
          CommentChangeMessage: ''
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
    }
    displayNewEditor() {
      if (!this.state.showEditor) {
        this.setState({showEditor: true});
      }
      else {
        this.setState({showEditor: false});
      }
    }

    editExistingComment() {
      if ((this.props.NextParent == this.props.Comment.CommentsID) && (this.props.NextStatus != 'saved') && (this.props.UserType == 'student')) {
        console.log('Cannot edit comment if it has replies.')
        this.setState({CommentChangeMessage: 'replies'});
      }
      else if (this.props.Comment.UserID == this.props.CurrentUser) {
        this.setState({editExistingComment: true});
      }
      this.props.Update();
    }

    endReply() {
      this.setState({showEditor: false});
      this.props.Update();
    }

    endEdit(response) {
      this.props.Update();
      if (response != 'saved') {
        this.setState({editExistingComment: false});
      }
    }

    showChangeMessage() {
      if ((this.props.NextParent == this.props.Comment.CommentsID) && (this.props.NextStatus != 'saved')) {
        if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
          this.setState({CommentChangeMessage: 'enhanced-delete-replies'});
        }
        else {
          console.log('Cannot delete comment if it has replies.')
          this.setState({CommentChangeMessage: 'replies'});
        }
      }
      else if ((this.props.Comment.UserID == this.props.CurrentUser) || (this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        this.setState({CommentChangeMessage: 'sure-check'});
      }
    }

    closeChangeMessage() {
      this.setState({CommentChangeMessage: ''});
    }

    deleteExistingComment() {
      if (((this.props.Comment.UserID == this.props.CurrentUser) && ((this.props.NextParent != this.props.Comment.CommentsID)) || (this.props.NextStatus == 'saved') || (this.props.UserType == 'teacher') || (this.props.Admin == true) || (this.props.Comment.Status == 'saved'))) {
        apiCall.post('/comments/delete/', {CommentsID: this.props.Comment.CommentsID}, (err, res, body) => {
            if(body.Message == 'Success') {
                console.log('Successfully deleted comment.');
                this.props.Update();
            }
            else {
                console.log('Error deleting comment.');
            }
        });
      }
    }

    deleteExistingCommentOnly() {
      if ((this.props.UserType == 'teacher') || (this.props.Admin == true)) {
        apiCall.post('/comments/hide', {CommentsID: this.props.Comment.CommentsID}, (err, res, body) => {
          if(!body.Error) {
            console.log('Successfully deleted comment and kept replies.')
            this.setState({CommentChangeMessage: ''})
            this.props.Update();
          }
          else {
            console.log('Error deleting comment and keeping replies.');
          }
        });
      }
    }

    render(){
        let strings = {
            RatingLabel: 'Rating:',
            ReplyLabel: 'Reply',
            CancelLabel: 'Cancel Reply',
            EditLabel: 'Edit Comment',
            DeleteLabel: 'Delete Comment',
            DiscardEditsLabel: 'Discard Edits',
            DiscardSavedLabel: 'Discard Saved Comment',
            RepliesMessage: 'Sorry, you cannot edit or delete a comment if it has a reply.',
            EnhancedDeleteRepliesMessage: 'What would you like to delete?',
            DeleteConfirmMessage: 'Are you sure you want to delete this comment?',
            DeleteConfirmMessageReplies: 'Are you sure you want to delete this comment and all of its replies?',
            YesText: 'Yes',
            NoText: 'No',
            CancelText: 'Cancel',
            EnhancedDeleteText0: 'Comment & Replies',
            EnhancedDeleteText1: 'Comment Only',
            CommentHiddenText: 'This comment has been deleted.',
            HiddenCommentDeleteText: 'Delete Comment & Replies',
            HiddenOptionsLabel: 'More Deletion Options'
        };
        let flagColor = 'black';
        if (this.props.Comment.Flag == 1) {
            flagColor = 'red';
        }
        let changeMessage;
        let repliesMessage = <span>{strings.RepliesMessage}</span>;
        let enhancedDeleteRepliesMessage = <div style={{display: 'inline'}}>
                                              <span>{strings.EnhancedDeleteRepliesMessage}</span><br />
                                              <button onClick={this.deleteExistingComment.bind(this)}>{strings.EnhancedDeleteText0}</button>
                                              {(this.props.Comment.Hide != 1) && (<button onClick={this.deleteExistingCommentOnly.bind(this)}>{strings.EnhancedDeleteText1}</button>)}
                                              <button onClick={this.closeChangeMessage.bind(this)}>{strings.CancelText}</button>
                                            </div>;
        let deleteSureCheckMessage = <div style={{display: 'inline'}}>
                                      <span>{strings.DeleteConfirmMessage}</span><br />
                                      <button onClick={this.deleteExistingComment.bind(this)}>{strings.YesText}</button>
                                      <button onClick={this.closeChangeMessage.bind(this)}>{strings.NoText}</button>
                                    </div>;

        if (this.state.CommentChangeMessage == 'replies') {
            changeMessage = repliesMessage;
        }
        if (this.state.CommentChangeMessage == 'enhanced-delete-replies') {
            changeMessage = enhancedDeleteRepliesMessage;
        }
        if (this.state.CommentChangeMessage == 'sure-check') {
            changeMessage = deleteSureCheckMessage;
        }

        return (
            <div style={{margin: '0 auto'}}>

            {(!this.state.editExistingComment && (this.props.Comment.Hide != 1)) &&
            (<div style={{marginLeft: this.props.Comment.ReplyLevel*30}} className="comment animate-fast fadeInUp">

              {
                (this.state.CommentChangeMessage != '') && (<div className="error form-error">
                <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>{changeMessage}
                </div>)
              }

              <div className="title"></div>
              {(this.props.Comment.Rating != null) && (<div style={{display: 'inline'}}><label style={{padding: 10}}>{strings.RatingLabel}</label>{this.props.Comment.Rating} / 5</div>)}
              <i className="fa fa-flag" style={{color:flagColor, padding: 10}}></i>
              <div className="timestamp" style={{display: 'inline'}}>{moment(this.props.Comment.Time).format('dddd, MMMM Do YYYY, h:mm:ss a')}</div>
              <div className="regular-text comtext">{this.props.Comment.CommentsText}</div>
              <div className="title"><a onClick={this.displayNewEditor.bind(this)}>{strings.ReplyLabel}</a></div>
              {(this.props.Comment.UserID == this.props.CurrentUser) && (<div className="title"><a onClick={this.editExistingComment.bind(this)}>{strings.EditLabel}</a></div>)}
              {((this.props.Comment.UserID == this.props.CurrentUser) || (this.props.UserType == 'teacher') || (this.props.Admin == true)) && (<div className="title"><a onClick={this.showChangeMessage.bind(this)}>{strings.DeleteLabel}</a></div>)}
            </div>)
          }

            {(this.props.Comment.Hide == 1) &&
              (<div style={{marginLeft: this.props.Comment.ReplyLevel*30, backgroundColor: '#dbdbdb'}} className="comment animate-fast fadeInUp">

                {
                  (this.state.CommentChangeMessage != '') && (<div className="error form-error">
                  <i className="fa fa-exclamation-circle" style={{paddingRight: 7}}></i>{changeMessage}
                  </div>)
                }

                <div className="regular-text comtext">{strings.CommentHiddenText}</div>
                {((this.props.UserType == 'teacher') || (this.props.Admin == true)) && (<div className="title"><a onClick={this.showChangeMessage.bind(this)}>{strings.HiddenOptionsLabel}</a></div>)}
              </div>)
          }

            {this.state.editExistingComment &&
              (<div style={{marginLeft: this.props.Comment.ReplyLevel*30}} className="comment">
                  <CommentEditorComponent
                    UserID={this.props.Comment.UserID}
                    CurrentUser={this.props.CurrentUser}
                    TaskID={this.props.Comment.TaskInstanceID}
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
                    Edit={true}
                  />
                  {(this.props.Comment.Status != 'saved') && (<div className="title"><a onClick={this.endEdit.bind(this)}>{strings.DiscardEditsLabel}</a></div>)}
                  {(this.props.Comment.Status == 'saved') && (<div className="title"><a onClick={this.deleteExistingComment.bind(this)}>{strings.DiscardSavedLabel}</a></div>)}

                </div>)
          }

            {this.state.showEditor &&
              (<div style={{marginLeft: (this.props.Comment.ReplyLevel + 1)*30}} className="comment">
                  <CommentEditorComponent
                    UserID={this.props.CurrentUser}
                    TaskID={this.props.Comment.TaskInstanceID}
                    Update={this.endReply.bind(this)}
                    ReplyLevel={this.props.Comment.ReplyLevel + 1}
                    Parents={this.props.Comment.CommentsID}
                  />
                  <div className="title"><a onClick={this.displayNewEditor.bind(this)}>{strings.CancelLabel}</a></div>
                </div>)
            }
          </div>
        );
    }
}
export default CommentComponent;
