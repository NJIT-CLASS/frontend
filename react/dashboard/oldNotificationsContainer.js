import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import MultiNotificationsComponent from './multiNotificationComponent';
import OldNotificationsComponent from './OldNotificationsComponent';
export default class OldNotificationsContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Courses: [],
            showOld: true
        };
    }
    componentWillMount() {
        this.fetchNotifications();
    }

    fetchNotifications(){
        apiCall.get(`/oldnotifications/user/${this.props.UserID}`, (err, res, body) => {
            this.setState({
                Notifications: body.Notifications.reverse()
            });
        });
    }

    toggleOld() {
      if (this.state.showOld) {
        this.setState({showOld: false});
      }
      else {
        this.setState({showOld: true});
      }
    }

    hideOld(){
    }

    render() {
        let {Strings} = this.props;
        let i = 1;
        return (
            <div className="section card-2" onClick={this.toggleOld.bind(this)}>
                <h2 className="title">{Strings.OldNotifications}
                  <span className={'fa fa-angle-' + (this.state.showOld ? 'up' : 'down')} style={{float: 'right'}}></span>
                  </h2>
              {this.state.showOld &&
                (<div className="section-content">
                  {(this.state.Notifications != undefined) && (this.state.Notifications.map((notification, index, array) => {
                                return (
                                      <OldNotificationsComponent
                                        key={i++}
                                        Notification={notification}
                                        OriginTaskInstanceID={notification.OriginTaskInstanceID}
                                        Update={this.fetchNotifications.bind(this)}
                                        />
                                );
                              }
                            )
                          )
                        }
                    {(this.state.Notifications != undefined) && (this.state.Notifications.length == 0) && Strings.NoNotifications}
                </div>
              )}
            </div>
        );
    }
}
