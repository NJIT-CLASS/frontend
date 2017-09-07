/**
 * Created by Sohail on 7/7/2017.
 */

import React from 'react';
import CourseForAchievementUnlock from './courseForAchievementUnlock';
import request from 'request';
import Select from 'react-select';


class MainLeaderboard extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            SemesterID: null,
            CourseID: null,
            SectionID: null
        };
        this.onSemesterChange= this.onSemesterChange.bind(this);
        this.onClassChange = this.onClassChange.bind(this);
    }

    componentWillMount() {
        const semOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/semester',
            json: true
        };
        request(semOptions, (err2, res2, bod2) => {
            let semestersArray = bod2.Semesters.map(function (sem) {
                return ( {value: sem.SemesterID, label: sem.Name} );
            });


            this.setState({
                Semesters: semestersArray
            });

        });
    }


    onSemesterChange(value){
        console.log('Semester value YEah ', value);
        console.log(value);
        this.setState({
            SemesterID: value.value
        });
    }

    onClassChange(value){
        console.log('Class value YEah ', value);
        this.setState({
            CourseID: value.value,
            SectionID: value.sectionId
        });
    }


    render(){
        var apiContentHolder = null;

        let courseAndSection = null;

        if(this.state.SemesterID != null) {
            courseAndSection = (
                <div id="courseForLeaderBoard">
                    <CourseForAchievementUnlock apiUrl={this.props.apiUrl}
                        UserID={this.props.UserID}
                        SemesterID={this.state.SemesterID}
                        onClassChange={this.onClassChange}
                        CourseID={this.state.CourseID}
                    />
                </div>
            );


            if (this.state.CourseID != null && this.state.SectionID != null) {

                apiContentHolder =
                    <div id="achievementUnlock">
                        <div id="classRanking">
                            <ClassRanking apiUrl={this.props.apiUrl}
                                UserID={this.props.UserID}
                                SemesterID={this.state.SemesterID}
                                CourseID={this.state.CourseID}
                                SectionID={this.state.SectionID}
                            />
                        </div>

                        <div id="topMovers">
                            <TopMovers />
                        </div>

                        <div id="vsSections">
                            <VsSections apiUrl={this.props.apiUrl}
                                UserID={this.props.UserID}
                            />
                        </div>
                    </div>;
            } else {
                apiContentHolder =
                    <div id="badge"><h1 id="noRankh1">Please select a Class!!!</h1></div>;
            }
        }
        else{

            apiContentHolder =
                <div id="badge"><h1 id="noRankh1">Please select a Semester!!!</h1></div>;
        }
        return (

            <div className="container">
                <div id="mainAchievementUnlockSelectDiv">
                    <div id="mainAchievementUnlockSemesterSelectDiv">
                        <Select
                            options={this.state.Semesters}
                            value={this.state.SemesterID}
                            onChange={this.onSemesterChange}
                            clearable={false}
                            searchable={false}
                            placeholder="Semester"
                        />
                    </div>
                    {courseAndSection}

                </div>
                <div></div>

                {apiContentHolder}


            </div>
        );
    }
}


export default MainLeaderboard;