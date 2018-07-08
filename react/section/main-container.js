import React, {Component} from 'react';
import apiCall from '../shared/apiCall';
import strings from './strings';
import UserListComponent from './userListComponent';
import UserManager from '../course-section-management/user-manager';

class SectionPageContainer extends Component {
    constructor(props){
        super(props);

        this.state = {
            SectionInfo: null,
            OngoingAssignments: [],
            GradedAssignments: [],
            Students: [],
            Instructors: [],
            Observers:[],
            Strings: strings
        };
    }
    componentDidMount() {
        this.props.__(this.state.Strings, newStrings => {
            this.setState({Strings: newStrings});
        });

        let {SectionID} = this.props;

        apiCall.get(`/section/info/${SectionID}`, (err, res, body) => {
            console.log(body);
            
            this.setState({
                SectionInfo: body.Section,
                OngoingAssignments: body.OngoingAssignments,
                Students: body.Users.filter(member => member.Role === 'Student'),
                Instructors: body.Users.filter(member => member.Role === 'Instructor'),
                Observers: body.Users.filter(member => member.Role === 'Observer'),
            });
        });
    }

    render() {
        let {SectionInfo, Students, Instructors, Observers,OngoingAssignments, Strings} = this.state;
        let {UserID, SectionID} = this.props;
        if(SectionInfo === null){
            return <div>
                
            </div>;
        
        }
        return <div>
            <div className="page-header">
                <h2>{SectionInfo.Course.Number} - {SectionInfo.Course.Name} - {SectionInfo.Name}</h2><br/>
                <div className="description">{SectionInfo.Description}</div>
            </div>
            <div className="user-view">
                <UserListComponent Users={Instructors} Role={Strings.Instructors}/>
                <UserListComponent Users={Students} Role={Strings.Students}/>
                <UserListComponent Users={Observers} Role={Strings.Observers}/>
                {/*
                <UserManager
                    key={5}
                    strings={Strings}
                    userID={UserID}
                    sectionID={SectionID}
                    role="Student"
                    title={Strings.Students}
                />
                <UserManager
                    key={6}
                    strings={Strings}
                    userID={UserID}
                    sectionID={SectionID}
                    role="Instructor"
                    title={Strings.Instructors}
                />
                <UserManager
                    key={7}
                    strings={Strings}
                    userID={UserID}
                    sectionID={SectionID}
                    role="Observer"
                    title={Strings.Observers}
                />
                */}
                
                <div className="section">
                    <h2 className="title">{Strings.OngoingAssignments}</h2>
                    <ul className="list-group">
                        { 
                            OngoingAssignments.map( assignment => <li className="list-group-item" key={assignment.AssignmentInstanceID}><a href={`/assignment-record/${assignment.AssignmentInstanceID}`}>{assignment.Assignment.DisplayName}</a></li>)
                        }
                    </ul>
                </div>
            </div>
            
            
            
        </div>;
    }
}

export default SectionPageContainer;
