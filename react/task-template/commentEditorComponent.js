/*
This is the Container for the task template page. It loads all the other components and puts the apporpriate data in them.
This Container also has the GET calls to fetch the data and passes it down to the other Components. The page uses tabs for
future stuff.

*/
import React from 'react';
import apiCall from '../shared/apiCall';
import Select from 'react-select';

class CommentEditorComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            NewCommentValue: '',
            CommentResult: '',
            CommentEditResult: '',
            NewCommentFlagValue: 0,
            NewCommentFlagColor: 'black'
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
        this.setState({NewCommentRating: event.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const commentParameters = {
            UserID: this.props.UserID,
            AssignmentInstanceID: 1, //placeholder for API; this will ultimately be removed
            TaskInstanceID: this.props.TaskID,
            Type: 1, //placeholder for API, this will be implemented in the future
            Flag: this.state.NewCommentFlagValue,
            CommentText: this.state.NewCommentValue,
            Rating: this.state.NewCommentRating,
            ReplyLevel: this.props.ReplyLevel,
            Parents: this.props.Parents
        };
        const editCommentParameters = {
            CommentsID: this.props.CommentsID,
            //Flag: this.state.NewCommentFlagValue,
            CommentsText: this.state.NewCommentValue,
            //Rating: this.state.NewCommentRating,
        };
        if (this.props.Edit) {
            apiCall.post('/comments/edit', editCommentParameters, (err, res, body) => {
                if(body.CommentsUpdated == 'CommentsUpdated') {
                    console.log('Successfully edited comment.');
                    this.setState({CommentEditResult: 'success'});
                    this.props.Update();
                }
                else {
                    console.log('Error editing comment.');
                }
            });
        }
        else {
            apiCall.post('/comments/add', commentParameters, (err, res, body) => {
                if(res.statusCode == 200) {
                    console.log('Successfully added comment.');
                    this.setState({CommentResult: 'success'});
                    this.setState({NewCommentValue: '', NewCommentRating: '', NewCommentFlagColor: 'black', NewCommentFlagValue: 0});
                    this.props.Update();
                } else if (res.statusCode == 400) {
                    console.log('Error submitting comments.');
                    this.setState({CommentResult: 'error'});
                } else {
                    console.log('An error occurred.');
                    this.setState({CommentResult: 'unknown-error'});
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
            ButtonText: 'Post',
            PlaceHolderText: 'Comment text',
            RatingLabel: 'Rating:'
        };
        let IntroText = strings.ActionText;
        if (this.props.Edit) {
            IntroText = strings.EditText;
        }
        let ratingList = [{value: 0, label: '0'}, {value: 1, label: '1'}, {value: 2, label: '2'}, {value: 3, label: '3'}, {value: 4, label: '4'}, {value: 5, label: '5'}];
        return (
          <div className="comment">
          <form role="form" onSubmit={this.handleSubmit.bind(this)}>
              <div className="title">{IntroText}</div>
              <label style={{padding: 10}}>{strings.RatingLabel}</label>
              <div style={{width: 50, display: 'inline-flex'}} ><Select placeholder='' style={{width: 'inherit'}} options={ratingList} value={this.state.NewCommentRating} onChange={this.handleChangeRating.bind(this)} resetValue={''} clearable={true} searchable={true} required/></div>
              <i className="fa fa-flag" style={{color:this.state.NewCommentFlagColor, padding: 10}} onClick={this.handleFlagClick.bind(this)} onMouseEnter={this.handleMouseEnterFlag.bind(this)} onMouseLeave={this.handleMouseLeaveFlag.bind(this)}></i>
              <div className="regular-text comtext">
                  <input placeholder={strings.PlaceHolderText} type="text" value={this.state.NewCommentValue} onChange={this.handleChangeText.bind(this)} required/>
                  <button type="submit">{strings.ButtonText}</button>
              </div>
          </form>
          </div>
        );
    }
}

export default CommentEditorComponent;
