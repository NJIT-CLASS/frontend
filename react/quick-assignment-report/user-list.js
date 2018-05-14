import React from 'react';
import Checkbox from '../shared/checkbox';
import { RadioGroup, Radio } from 'react-radio-group';

// This component renders a list of users that is passed down as a prop. The users are
// grouped by role (ie 'student,' 'instructor,' and 'observer'). The list shows either 
// a checkbox or a radio button beside each user so that they can be selected.
class UserList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const students = this.props.users.filter(
            user => user.role === 'Student'
        );
        const instructors = this.props.users.filter(
            user => user.role === 'Instructor'
        );
        const observers = this.props.users.filter(
            user => user.role === 'Observer'
        );

        return (
            <div>
                <RadioGroup
                    selectedValue={this.props.defaultSelection}
                    onChange={this.props.onSelectionChange}
                >
                    <UserListSection
                        {...this.props}
                        users={students}
                        title={'Students'}
                    />
                    <UserListSection
                        {...this.props}
                        users={instructors}
                        title={'Instructors'}
                    />
                    <UserListSection
                        {...this.props}
                        users={observers}
                        title={'Observers'}
                    />
                </RadioGroup>
            </div>
        );
    }
}

class UserListSection extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // isDisabled is a callback for indicating whether or not the checkbox/radio button
        // beside a user should be disabled.
        const isDisabled = this.props.isDisabled || (user => false);

        let users = this.props.users.map(user => (
            <tr key={user.id} className={isDisabled(user) ? 'disabled' : null}>
                <td>
                    {this.props.selectType === 'radio' ? (
                        <Radio value={user.id} disabled={isDisabled(user)} />
                    ) : (
                        <Checkbox
                            // isSelected is a callback for indicating whether or not the 
                            // checkbox/radio button beside a user should be selected.
                            isClicked={this.props.isSelected(user)}
                            click={() => this.props.onSelectionChange(user.id)}
                            disabled={isDisabled(user)}
                        />
                    )}
                </td>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                <td>{user.id}</td>
            </tr>
        ));

        // show message if no users in role for section yet
        let empty = (
            <tr>
                <td colSpan={512}>
                    No {this.props.title.toLowerCase()} available.
                </td>
            </tr>
        );

        let list = (
            <div>
                <h2 className="title">{this.props.title}</h2>
                <table className="user-list">
                    <thead>
                        <tr>
                            {/* Heading-less column for the checkboxes/radio buttons */}
                            <th />
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Email</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? users : empty}
                    </tbody>
                </table>
            </div>
        );

        return list;
    }
}

export default UserList;
