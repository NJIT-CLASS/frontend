/**
 * Created by Sohail on 7/7/2017.
 * This file will render the entire leaderboard page
 * Dropdown for Semester and Course
 * 3 Components
 *  Class Ranking
 *  Top Movers
 *  vsSection
 */

import React from 'react';
import ClassRanking from './classRanking';
import TopMovers from './topMovers';
import VsSections from './vsSections';
import CourseForLeaderBoard from './courseForLeaderBoard';
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

    //Will render the Data
    componentWillMount() {
        const semOptions = {
            method: 'GET',
            uri: this.props.apiUrl + '/api/semester',
            json: true
        }
        request(semOptions, (err2, res2, bod2) => {
            let semestersArray = bod2.Semesters.map(function (sem) {
                return ( {value: sem.SemesterID, label: sem.Name} );
            });


            this.setState({
                Semesters: semestersArray
            });

        });
    }

    //Changes value of semester when user selects semester from dropdown
    onSemesterChange(value){
        this.setState({
            SemesterID: value.value
        });
    }

    //Changes value of Course and Section when user selects course from dropdown
    onClassChange(value){
        this.setState({
            CourseID: value.value,
            SectionID: value.sectionId
        });
    }


    render(){
        var apiContentHolder = null;//Initially null, Basically declaring the variable

        let courseAndSection = null;//Initially null, Basically declaring the variable

        //If Semester is not null then allow user to choose a class
        if(this.state.SemesterID != null) {
            courseAndSection = (
                <div id="courseForLeaderBoard">
                    <CourseForLeaderBoard apiUrl={this.props.apiUrl}
                                          UserID={this.props.UserID}
                                          SemesterID={this.state.SemesterID}
                                          onClassChange={this.onClassChange}
                                          CourseID={this.state.CourseID}
                    />
                </div>
            );

            //If user has already chose a class then show him rankings, (Class Ranking, Top Movers, and vs Sections)
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
                            <TopMovers apiUrl={this.props.apiUrl}
                                UserID={this.props.UserID}
                                SemesterID={this.state.SemesterID}
                            />
                        </div>

                        <div id="vsSections">
                            <VsSections apiUrl={this.props.apiUrl}
                                        UserID={this.props.UserID}
                                        SemesterID={this.state.SemesterID}
                            />
                        </div>
                    </div>
            } else {
                //If class is not selected then have a placeholder that says "Please select a class!!!"
                apiContentHolder =
                    <div id="leaderboard"><h1 id="noRankh1">Please select a Class!!!</h1></div>
            }
        }
    else{
            //If section is not selected then have a placeholder that says "Please select a semester!!!"
            apiContentHolder =
                <div id="leaderboard"><h1 id="noRankh1">Please select a Semester!!!</h1></div>
        }

        //Semester Dropdown and passing data to other files
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