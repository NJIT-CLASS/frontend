
/* This Component is preparatio for a future commenting system. It is passed down important data like author and Content
* and is light enough to be reused. It simply shows the data. TemplateContainer will probably need ot fetc the relevant comment data
* from the database.
*/
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
    return (  <div className="comment animate-fast fadeInUp">
        <div className="title">{this.props.Comment.Author}    <div className="timestamp">{this.props.Comment.Timestamp}</div> </div>

        <div className="regular-text comtext">{this.props.Comment.Content}</div>
      </div>);
  }



}
export default CommentComponent;
