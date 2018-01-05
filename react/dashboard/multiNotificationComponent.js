import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
var moment = require('moment');
import NotificationsComponent from './notificationsComponent';
export default class MultiNotificationsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
        };
    }

    /*componentWillMount() {
        this.getAccessLink();
    }*/

    dismissNotification() {
      for (let i of this.props.MultiNotification) {
        console.log(i.NotificationsID)
        apiCall.post(`/notifications/dismiss/${i.NotificationsID}`, (err, res, body) => {
            if (!body.Error) {
                console.log('Notification dismissed');
                this.props.Update();
            }
            else {
                console.log('Error dismissing notification');
            }
        });
      }
    }

    getAccessLink() {
        apiCall.get(`/comments/accessLink/${this.props.OriginTaskInstanceID}`, (err, res, body) => {
            if (!body.Error) {
                console.log('Link retreieved', body.ID);
                this.setState({Link: ('/task/'.concat(body.ID))});
            }
            else {
                console.log('Error retrieving link');
            }
        });

        for (let i of this.props.MultiNotification) {
          apiCall.get(`/comments/CommentsID/${i.CommentsID}`, (err, res, body) => {
              if (!body.Error) {
                  console.log('ID data retreieved for notification', body.Comments);
                  i.Link = this.state.Link
                  i.LinkTarget = body.Comments.CommentTarget;
                  i.LinkTargetID = body.Comments.TargetID;
                  i.AccessLink = `/task/${this.state.Link}?tab=comments&target=${body.Comments.CommentTarget}&targetID=${body.Comments.TargetID}&commentsID=${i.CommentsID}`;
              }
              else {
                  console.log('Error retrieving link');
              }
          });
        }
    }

    render() {
        let strings = {
            CommentNotification: 'New reply',
            FlagNotification: 'New flag'
        };

        /*var times;
        for (let i = 0; i < this.props.MultiNotification.length; i++) {
            if (i == this.props.MultiNotification.length - 1) {
                times.concat(<span>moment(this.props.MultiNotification[i].Time).format('dddd, MM/DD/YYYY, h:mm:ss a')</span>);
            }
            else {
                times = times + <span>moment(this.props.MultiNotification[i].Time).format('dddd, MM/DD/YYYY, h:mm:ss a')</span> + <a href={i.AccessLink} target="_blank"><i style={{padding: 10, color: '#7ABDF9'}} className="fa fa-arrow-circle-right"></i></a>;
            }
        }*/

        let notificationsText = strings.CommentNotification;
        let flag = true;
        for (let i of this.props.MultiNotification) {
            if (i.Flag == 0) {
                flag = false;
            }
        }
        if (flag == true) {
            notificationsText = strings.FlagNotification
        }
        return (
          <div className="notification">
            <div style={{display: 'inline'}} className="notificationtext">{notificationsText}</div>
            <span className="fa-stack fa-2x">
              <i className="fa fa-circle-o fa-stack-1x"></i>
              <span className="fa fa-stack-1x">
                <span className = "notification-number">{this.props.MultiNotification.length}</span>
              </span>
            </span>
            {/*<div style={{display: 'inline', float: 'right'}}>
              <a href={this.state.Link} target="_blank"><i style={{padding: 10, color: '#7ABDF9'}} className="fa fa-arrow-circle-right"></i></a>
              <i style={{padding: 10}} className="fa fa-times" onClick={this.dismissNotification.bind(this)}></i>
            </div>
            <div className="timestamp">{times}</div>*/}
            {(this.props.MultiNotification != undefined) && (this.props.MultiNotification.map((notification, index, array) => {
                        return (
                          <div style={{display: 'inline'}}>
                              <NotificationsComponent
                                key={notification.NotificationsID}
                                Notification={notification}
                                Update={this.props.Update}
                                />
                          </div>
                        );}
                      )
                    )
                  }
          </div>
        );
    }

  /*  render() {
        let {Strings} = this.props;
        let index = 1;
        return (
                <div>
                  {(this.props.MultiNotification != undefined) && (this.props.MultiNotification.map((notification, index, array) => {
                              return (
                                    <NotificationsComponent
                                      key={index++}
                                      Notification={notification}
                                      Update={this.props.Update}
                                      />
                              );}
                            )
                          )
                        }
                </div>
        );
    } */
}
