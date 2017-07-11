
/* This Component is preparatio for a future commenting system. It is passed down important data like author and Content
* and is light enough to be reused. It simply shows the data. TemplateContainer will probably need ot fetc the relevant comment data
* from the database.
*/
import React from 'react';

class CommentComponent extends React.Component{
    constructor(props){
        super(props);

        this.state={};
    }

    render(){
        let strings = {
            RatingLabel: 'Rating:'
        };
        let flagColor = 'black';
        if (this.props.Comment.Flag == 1) {
            flagColor = 'red';
        }
        return (
          <div className="comment animate-fast fadeInUp">
            <div className="title">{this.props.Comment.Author} <div className="timestamp">{this.props.Comment.Timestamp}</div> </div>
            <label style={{padding: 10}}>{strings.RatingLabel}</label>{this.props.Comment.Rating} / 5
            <i className="fa fa-flag" style={{color:flagColor, padding: 10}}></i>
            <div className="regular-text comtext">{this.props.Comment.CommentsText}</div>
      </div>);
    }



}
export default CommentComponent;
