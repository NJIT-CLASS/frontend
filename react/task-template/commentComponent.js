import React from 'react';

class CommentComponent extends React.Component{
  constructor(props){
    super(props);

    this.state={
        Comment: {
          Title:'',
          Author:'User1',
          UserID:'',
          Timestamp: 'May 6, 2013 9:43am',
          ThumbsUp:0,
          ThumbsDown:0,
          Content:'I really liked your problem. It was very intriguing.'
      }
    };
  }

  render(){
    return (  <div className="comment animate-fast fadeIn">
        <div className="title">{this.state.Comment.Author}    <div className="timestamp">{this.state.Comment.Timestamp}</div> </div>

        <div className="regular-text comtext">{this.state.Comment.Content}</div>
      </div>);
  }



}
export default CommentComponent;
