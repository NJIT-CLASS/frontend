import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserList extends Component {
    constructor(props) {
        super(props);
    }

    render() { 
        let {Users, Role} = this.props;
        return <div className="section">
            <h2 className="title">{Role}</h2>
            <ul>
                {
                    Users.map((user) => {
                        return <li key={user.UserID}>{user.User.FirstName} {user.User.LastName}</li>;
                    })
                }
            </ul>
        </div>;
    }
}
 
export default UserList;
