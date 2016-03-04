import React from 'react';

import Select from 'react-select';

import SectionMember from './section-member';

class CourseSections extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            members: props.members
        };
    }

    updateMember(index, member) {
        this.setState((previousState) => {
            let memberCount = previousState.members.length;
            let newMembers = previousState.members;

            // if new member then add object to array
            if (index >= memberCount) {
                let difference = index - memberCount - 1;

                while(difference > 0) {
                    newMembers.push({});
                }
            }

            newMembers[index] = member;
            return {members: newMembers};
        });
    }

    render() {
        var options = [
            { value: 's16', label: 'Spring 2016' },
            { value: 'f15', label: 'Fall 2015' }
        ];

        let lastIndex = 0;

        let members = this.state.members.map((member) => {
            return (
                <SectionMember
                    email={member.email}
                    role={member.role}
                    updateMember={this.updateMember.bind(this, lastIndex)}
                    key={lastIndex++}
                />
            );
        });

        // always have one extra member field
        members.push(<SectionMember updateMember={this.updateMember.bind(this, lastIndex)} key={lastIndex++}/>);

        return (
            <div className="section">
                <h2 className="title">Create Section</h2>
                <div className="section-content">
                    <label>Section Name</label>
                    <div>
                        <input type="text"></input>
                    </div>
                    <label>Section Description</label>
                    <div>
                        <textarea></textarea>
                    </div>
                    <label>Semester</label>
                    <Select
                        name="semester"
                        value="s16"
                        options={options}
                        clearable={false}
                        searchable={false}
                    />
                    <label>Course Members</label>
                    <div>
                        {members}
                    </div>
                </div>
            </div>
        );
    }
}

CourseSections.defaultProps = {
    members: []
};

export default CourseSections;