import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
var moment = require('moment');
export default class OldNotificationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        /*if ((this.props.Notification.NotificationTarget == 'Flag') || (this.props.Notification.NotificationTarget == 'Comment')) {
            this.getAccessLink();
        }*/
    }

    getAccessLink() {
        apiCall.get(`/comments/accessLink/${this.props.Notification.OriginTaskInstanceID}`, (err, res, body) => {
            if (!body.Error) {
                console.log('Link retreieved', body.ID);
                this.setState({LinkID: body.ID});
            }
            else {
                console.log('Error retrieving link');
            }
        });

          apiCall.get(`/comments/CommentsID/${this.props.Notification.CommentsID}`, (err, res, body) => {
              if (!body.Error) {
                  console.log('ID data retreieved for notification', body);
                  this.setState({CommentTarget: body.Comments[0].CommentTarget, TargetID: body.Comments[0].TargetID});
              }
              else {
                  console.log('Error retrieving link');
              }
          });
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
        ForText: ' for ',
        LinkInvalidText: 'Link No Longer Valid'
    };
      let status = 0;
      if (this.props.Notification.Info == 0) {
        status = strings.RequestCancelledText;
      }
      else {
        status = this.props.Notification.Info;
      }
        return (
          <div className="notification" style={{color:'gray'}}>
              <div style={{float: 'right', marginTop: '-15px'}}>
                {(this.props.Notification.NotificationTarget == 'Flag') && <i className="fa fa-flag" style={{color:'red'}}></i>}
                {/*{(this.state.TargetID != undefined) && (this.state.LinkID != undefined) && (this.state.CommentTarget != undefined) && (<a href={`/task/${this.state.LinkID}?tab=comments&target=${this.state.CommentTarget}&targetID=${this.state.TargetID}&commentsID=${this.props.Notification.CommentsID}`} target="_blank"><i style={{padding: 10, color: '#7ABDF9'}} className="fa fa-arrow-circle-right"></i></a>)}*/}

                {(((this.props.Notification.NotificationTarget == 'Flag') || (this.props.Notification.NotificationTarget == 'Comment')) && (this.props.Notification.DismissType == 'User')) && (<a href={`/task/${this.props.Notification.LinkID}?tab=comments&target=${this.props.Notification.CommentTarget}&targetID=${this.props.Notification.CommentTargetID}&commentsID=${this.props.Notification.TargetID}`} target="_blank"><i style={{padding: 10, color: '#1D578C'}} className="fa fa-arrow-circle-right"></i></a>)}
                {((((this.props.Notification.NotificationTarget == 'SectionUser') || (this.props.Notification.NotificationTarget == 'VolunteerPool')) && (this.props.Notification.DismissType == 'User')) && (this.props.Notification.Role == 'Instructor')) && (<a href={`/course-section-management/?org=${this.props.Notification.OrganizationID}?course=${this.props.Notification.CourseID}&semester=${this.props.Notification.SemesterID}&section=${this.props.Notification.SectionID}&user=${this.props.Notification.ActorID}`} target="_blank"><i style={{padding: 10, color: '#1D578C'}} className="fa fa-arrow-circle-right"></i></a>)}
                {(((this.props.Notification.NotificationTarget == 'SectionUser') || (this.props.Notification.NotificationTarget == 'VolunteerPool')) && (this.props.Notification.Role == 'Student') && (this.props.Notification.DismissType == 'User')) && (<a href={`/account/?section=${this.props.Notification.SectionID}`} target="_blank"><i style={{padding: 10, color: '#1D578C'}} className="fa fa-arrow-circle-right"></i></a>)}

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
