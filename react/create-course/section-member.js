import React from 'react';

import Select from 'react-select';

class SectionMember extends React.Component {
    constructor(props) {
        super(props);
    }

    onEmailChange(e) {
        this.props.updateMember({
            email: e.target.value,
            role: this.props.role
        });
    }

    onRoleChange(role) {
        this.props.updateMember({
            email: this.props.email,
            role: role
        });
    }

    render() {
        var roles = [
            { value: 'student', label: 'Student' },
            { value: 'instructor', label: 'Instructor' }
        ];

        return (
            <div className="member">
                <input
                    type="text"
                    placeholder="email"
                    value={this.props.email}
                    onChange={this.onEmailChange.bind(this)}
                ></input>
                <Select
                    name="role"
                    value={this.props.role}
                    options={roles}
                    clearable={false}
                    searchable={false}
                    onChange={this.onRoleChange.bind(this)}
                />
            </div>
        );
    }
}

SectionMember.defaultProps = {
    email: '',
    role: 'student'
};

export default SectionMember;
