import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import MultiNotificationsComponent from './multiNotificationComponent';
import NotificationsComponent from './notificationsComponent';
import OldNotificationsComponent from './OldNotificationsComponent';
export default class NotificationsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
            showOld: false
        };
    }
    componentWillMount() {
        this.fetchNotifications();
    }

    fetchNotifications(){
        apiCall.get(`/notifications/user/${this.props.UserID}`, (err, res, body) => {
            this.setState({
                Notifications: body.Notifications.reverse()
            });
        });
    }

    showOld() {
        this.setState({showOld: true});
    }

    hideOld(){
        this.setState({showOld: false});
    }

    render() {
        let {Strings} = this.props;
        let i = 1;
        return (
            <div className="section card-2">
                <h2 className="title">{Strings.Notifications}</h2>
                <div className="section-content">
                  {(this.state.Notifications != undefined) && (this.state.Notifications.map((notification, index, array) => {
                              console.log(notification.Dismiss);
                                return (
                                      <NotificationsComponent
                                        key={i++}
                                        Notification={notification}
                                        OriginTaskInstanceID={notification.OriginTaskInstanceID}
                                        Update={this.fetchNotifications.bind(this)}
                                        />
                                );
                              {/*else if (this.state.showOld){
                                return (
                                      <OldNotificationsComponent
                                        key={i++}
                                        Notification={notification}
                                        OriginTaskInstanceID={notification.OriginTaskInstanceID}
                                        Update={this.fetchNotifications.bind(this)}
                                        />
                                );
                              } */}
                              }
                            )
                          )
                        }
                    {(this.state.Notifications != undefined) && (this.state.Notifications.length == 0) && Strings.NoNotifications}
                </div>
            </div>
        );
    }
}
