import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import MultiNotificationsComponent from './multiNotificationComponent';
export default class NotificationsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
        };
    }
    componentWillMount() {
        this.fetchNotifications();
    }

    fetchNotifications(){
        apiCall.get(`/notifications/user/${this.props.UserID}`, (err, res, body) => {
            this.setState({
                Notifications: body.Notifications
            });
        });
    }

    render() {
        let {Strings} = this.props;
        let i = 1;
        return (
            <div className="section card-2">
                <h2 className="title">{Strings.Notifications}</h2>
                <div className="section-content">
                  {(this.state.Notifications != undefined) && (this.state.Notifications.map((notification, index, array) => {
                              return (
                                    <MultiNotificationsComponent
                                      key={i++}
                                      MultiNotification={notification}
                                      OriginTaskInstanceID={notification[0].OriginTaskInstanceID}
                                      Update={this.fetchNotifications.bind(this)}
                                      />
                              );}
                            )
                          )
                        }
                    {(this.state.Notifications != undefined) && (this.state.Notifications.length == 0) && Strings.NoNotifications}
                </div>
            </div>
        );
    }
}
