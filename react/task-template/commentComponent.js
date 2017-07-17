
/* This Component is preparatio for a future commenting system. It is passed down important data like author and Content
* and is light enough to be reused. It simply shows the data. TemplateContainer will probably need ot fetc the relevant comment data
* from the database.
*/
import React from 'react';
import CommentEditorComponent from './commentEditorComponent';

class CommentComponent extends React.Component{
    constructor(props){
        super(props);

        this.state={
          showEditor: false,
          editExistingComment: false
        };
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
      if (this.props.Comment.UserID == this.props.CurrentUser) {
        this.setState({editExistingComment: true});
      }
      this.props.Update();
    }

    endReply() {
      this.setState({showEditor: false});
      this.props.Update();
    }

    endEdit() {
      this.setState({editExistingComment: false});
      this.props.Update();
    }

    render(){
        let strings = {
            RatingLabel: 'Rating:',
            ReplyLabel: 'Reply',
            CancelLabel: 'Cancel Reply',
            EditLabel: 'Edit Comment',
            DiscardEditsLabel: 'Discard Edits'
        };
        let flagColor = 'black';
        if (this.props.Comment.Flag == 1) {
            flagColor = 'red';
        }
        return (
            <div style={{margin: '0 auto'}}>
            {!(this.state.editExistingComment) &&
            (<div style={{marginLeft: this.props.Comment.ReplyLevel*30}} className="comment animate-fast fadeInUp">
              <div className="title"><div className="timestamp">{this.props.Comment.Timestamp}</div> </div>
              <label style={{padding: 10}}>{strings.RatingLabel}</label>{this.props.Comment.Rating} / 5
              <i className="fa fa-flag" style={{color:flagColor, padding: 10}}></i>
              <div className="regular-text comtext">{this.props.Comment.CommentsText}</div>
              <div className="title"><a onClick={this.displayNewEditor.bind(this)}>{strings.ReplyLabel}</a></div>
              {(this.props.Comment.UserID == this.props.CurrentUser) && (<div className="title"><a onClick={this.editExistingComment.bind(this)}>{strings.EditLabel}</a></div>)}
            </div>)
          }

            {this.state.editExistingComment &&
              (<div style={{marginLeft: this.props.Comment.ReplyLevel*30}} className="comment animate-fast fadeIn fadeOut">
                  <CommentEditorComponent
                    UserID={this.props.Comment.UserID}
                    TaskID={this.props.Comment.TaskInstanceID}
                    Update={this.endEdit.bind(this)}
                    ReplyLevel={this.props.Comment.ReplyLevel}
                    Parents={this.props.Comment.Parents}
                    CommentsText={this.props.Comment.CommentsText}
                    Rating={this.props.Comment.Rating}
                    Flag={this.props.Comment.Flag}
                    CommentsID={this.props.Comment.CommentsID}
                    Edit={true}
                  />
                  <div className="title"><a onClick={this.endEdit.bind(this)}>{strings.DiscardEditsLabel}</a></div>
                </div>)
          }

            {this.state.showEditor &&
              (<div style={{marginLeft: (this.props.Comment.ReplyLevel + 1)*30}} className="comment animate-fast fadeInUp fadeOutDown">
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
