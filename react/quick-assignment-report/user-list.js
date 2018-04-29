import React from 'react';
import Checkbox from '../shared/checkbox';
import { RadioGroup, Radio } from 'react-radio-group';

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
        const isDisabled = this.props.isDisabled || (() => false);
        let users = this.props.users.map(user => (
            <tr key={user.id} className={isDisabled(user) ? 'disabled' : null}>
                <td>
                    {this.props.selectType === 'radio' ? (
                        <Radio value={user.id} disabled={isDisabled(user)} />
                    ) : (
                        <Checkbox
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
                            <th />
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>Email</th>
                            <th>User ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.users && this.props.users.length > 0
                            ? users
                            : empty}
                    </tbody>
                </table>
            </div>
        );

        return list;
    }
}

export default UserList;
