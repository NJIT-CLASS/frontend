import React, { Component } from 'react'; //import the React library and the Component class from the react package
import Reactable from 'reactable';
import apiCall from '../shared/apiCall';
var moment = require('moment');

class MyCommentsComponent extends Component { //create a class for the component
                                         //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
                        // or C's int main() or Python's def main()

        this.state = {
            Data: [],
            Loaded: false
        }; //initial state, only manually assigned here, elsewhere it's this.setState()
    }

    componentWillMount() {
      this.getCommentData();
    }

    getCommentData() {
      let commentData = [];
      apiCall.get(`/comments/userID/${this.props.UserID}`, (err, res, body) => {
          if (!body.Error) {
            commentData = body.Comments;
            for (let comment of commentData) {
              apiCall.get(`/comments/courseData/${comment.AssignmentInstanceID}`, (err, res, body) => {
                  if (!body.Error) {
                    comment.CourseName = body.CourseName;
                    comment.SectionName = body.SectionName;
                    comment.SemesterName = body.SemesterName;
                    this.setState({Data: commentData, Loaded: true})
                  }
                  else {
                    console.log('No course data received.');
                  }
              });
            }
          }
          else {
            console.log('No comment UserID data received.');
          }
      });
    }

    render(){
        let strings = {      // define all your strings in an object like this one (the name of the keys can be anything)
                            // we use this for translation
            CommentLabel: 'Comment',
            TimestampLabel: 'Timestamp',
            CourseLabel: 'Course',
            SectionLabel: 'Section',
            SemesterLabel: 'Semester',
            RatingLabel: 'Rating',
            StatusLabel: 'Status'
        };

        let Table = Reactable.Table,
            Tr = Reactable.Tr,
            Td = Reactable.Td;

        let TableData = null;
        if (this.state.Loaded) {
          TableData = this.state.Data.map((row) => {
                return(
                <Tr key={row.CommentsID}>
                  <Td column={strings.CourseLabel}>{row.CourseName}</Td>
                  <Td column={strings.SectionLabel}>{row.SectionName}</Td>
                  <Td column={strings.SemesterLabel}>{row.SemesterName}</Td>
                  <Td column={strings.CommentLabel}>{(row.CommentsText.length > 5) ? row.CommentsText.substring(0,5).concat('...'): row.CommentsText}</Td>
                  <Td column={strings.RatingLabel}>{row.Rating}</Td>
                  <Td column={strings.StatusLabel}>{row.Status.charAt(0).toUpperCase() + row.Status.slice(1)}</Td>
                  <Td column={strings.TimestampLabel}>{moment(row.Time).format('dddd, MMMM Do YYYY, h:mm:ss a')}</Td>
                </Tr>)
              });
          }

        if (!this.state.Loaded) {
          return (<div></div>)
        }
        else {
          return (

            <div className="card">
                <Table className="table" id="table" sortable={true}>
                {TableData}
                </Table>

            </div>
          );
        }
    }
}

export default MyCommentsComponent;
