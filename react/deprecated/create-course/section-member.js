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
        //alert(role.value);
        this.props.updateMember({
            email: this.props.email,
            role: role.value
        });
    }

    render() {
        var roles = [
            { value: 'Student', label: 'Student' },
            { value: 'Instructor', label: 'Instructor' }
        ];

        return (
            <div className="member">
                <input
                    type="text"
                    placeholder="email"
                    value={this.props.email}
                    onChange={this.onEmailChange.bind(this)}
                ></input>
              <Select options={roles} value={this.props.role} onChange={this.onRoleChange.bind(this)} />

            </div>
        );
    }
}

SectionMember.defaultProps = {
    email: '',
    role: 'Student'
};

export default SectionMember;
