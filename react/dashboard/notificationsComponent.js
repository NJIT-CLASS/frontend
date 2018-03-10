import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
var moment = require('moment');
export default class NotificationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
        this.getAccessLink();
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
        return (
          <div>
              <div style={{float: 'right', marginTop: '-15px'}}>
                {(this.props.Notification.Flag == 1) && <i className="fa fa-flag" style={{color:'red'}}></i>}
                {(this.state.TargetID != undefined) && (this.state.LinkID != undefined) && (this.state.CommentTarget != undefined) && (<a href={`/task/${this.state.LinkID}?tab=comments&target=${this.state.CommentTarget}&targetID=${this.state.TargetID}&commentsID=${this.props.Notification.CommentsID}`} target="_blank"><i style={{padding: 10, color: '#7ABDF9'}} className="fa fa-arrow-circle-right"></i></a>)}
                <i style={{padding: 10}} className="fa fa-times" onClick={this.dismissNotification.bind(this)}></i>
                </div>
            <div className="timestamp">{moment(this.props.Notification.Time).format('dddd, MM/DD/YYYY, h:mm:ss a')}</div>
          </div>
        );
    }
}
