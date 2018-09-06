import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
var moment = require('moment');
export default class NotificationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    dismissNotification() {
        apiCall.post(`/notifications/dismiss/${this.props.Notification.NotificationsID}`, (err, res, body) => {
            if (!body.Error) {
                console.log('Notification dismissed');
                this.props.Update();
            }
            else {
                console.log('Error dismissing notification');
            }
        });
    }

    render() {
    let strings = {
        CommentText: 'You have a new comment on ',
        InText: ' in ',
        VolunteerPoolText: 'There has been a change in the volunteer status for ',
        SectionText: ' - Section ',
        NewStatusText: '. The new status is ',
        RequestCancelledText: 'Request Cancelled',
        ForText: ' for '
    };
      let status = 0;
      if (this.props.Notification.Info == 0) {
        status = strings.RequestCancelledText;
      }
      else {
        status = this.props.Notification.Info;
      }
      console.log('Notification status: ', status);
        return (
          <div className="notification">
              <div style={{float: 'right', marginTop: '-15px'}}>
                {(this.props.Notification.NotificationTarget == 'Flag') && <i className="fa fa-flag" style={{color:'red'}}></i>}
                {/*{(this.state.TargetID != undefined) && (this.state.LinkID != undefined) && (this.state.CommentTarget != undefined) && (<a href={`/task/${this.state.LinkID}?tab=comments&target=${this.state.CommentTarget}&targetID=${this.state.TargetID}&commentsID=${this.props.Notification.CommentsID}`} target="_blank"><i style={{padding: 10, color: '#7ABDF9'}} className="fa fa-arrow-circle-right"></i></a>)}*/}
                {((this.props.Notification.NotificationTarget == 'Flag') || (this.props.Notification.NotificationTarget == 'Comment')) && (<a href={`/task/${this.props.Notification.LinkID}?tab=comments&target=${this.props.Notification.CommentTarget}&targetID=${this.props.Notification.CommentTargetID}&commentsID=${this.props.Notification.TargetID}`} target="_blank"><i style={{padding: 10, color: '#1D578C'}} className="fa fa-arrow-circle-right"></i></a>)}
                {(((this.props.Notification.NotificationTarget == 'SectionUser') || (this.props.Notification.NotificationTarget == 'VolunteerPool')) && (this.props.Notification.Role == 'Instructor')) && (<a href={`/course-section-management/?org=${this.props.Notification.OrganizationID}?course=${this.props.Notification.CourseID}&semester=${this.props.Notification.SemesterID}&section=${this.props.Notification.SectionID}&user=${this.props.Notification.ActorID}`} target="_blank"><i style={{padding: 10, color: '#1D578C'}} className="fa fa-arrow-circle-right"></i></a>)}
                {(((this.props.Notification.NotificationTarget == 'SectionUser') || (this.props.Notification.NotificationTarget == 'VolunteerPool')) && (this.props.Notification.Role == 'Student')) && (<a href={`/account/?section=${this.props.Notification.SectionID}`} target="_blank"><i style={{padding: 10, color: '#1D578C'}} className="fa fa-arrow-circle-right"></i></a>)}
                <i style={{padding: 10}} className="fa fa-times" onClick={this.dismissNotification.bind(this)}></i>
                </div>
                {((this.props.Notification.NotificationTarget == 'Flag') || (this.props.Notification.NotificationTarget == 'Comment')) &&
                <span>{strings.CommentText}{this.props.Notification.TaskName}{strings.InText}{this.props.Notification.AssignmentName}</span>}
                {(this.props.Notification.NotificationTarget == 'VolunteerPool' && status != 0) &&
                <span>{strings.VolunteerPoolText}{this.props.Notification.Actor}{strings.ForText}{this.props.Notification.AssignmentName}{strings.InText}{this.props.Notification.CourseName}{strings.SectionText}{this.props.Notification.SectionName}{strings.NewStatusText}{status}{'.'}</span>}
                {(this.props.Notification.NotificationTarget == 'SectionUser' && status != 0) &&
                <span>{strings.VolunteerPoolText}{this.props.Notification.Actor}{strings.ForText}{this.props.Notification.CourseName}{strings.SectionText}{this.props.Notification.SectionName}{strings.NewStatusText}{status}{'.'}</span>}
            <div className="timestamp">{moment(this.props.Notification.Time).format('dddd, MM/DD/YYYY, h:mm:ss a')}</div>
          </div>
        );
    }
}
