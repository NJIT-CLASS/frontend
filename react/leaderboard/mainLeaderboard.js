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
import apiCall from '../shared/apiCall';
import Select from 'react-select';
import CourseSelect from '../everyones-work/courseSelect';
import SectionSelectComponent from '../everyones-work/sectionSelect';
import strings from '../achievementUnlock/strings';


class MainLeaderboard extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            SemesterID: null,
            CourseID: null,
            SectionID: null,
            Strings: strings,
        };
        this.onSemesterChange= this.onSemesterChange.bind(this);
        this.onClassChange = this.onClassChange.bind(this);
        this.selectSection = this.selectSection.bind(this);
    }

    //Will render the Data
    componentWillMount() {
        
        apiCall.get('/semester', (err2, res2, bod2) => {
            let semestersArray = bod2.Semesters.map(function (sem) {
                return ( {value: sem.SemesterID, label: sem.Name} );
            });


            this.setState({
                Semesters: semestersArray
            });

        });
    }

    componentDidMount() {
        this.props.__(strings, newStrings => {
            this.setState({
                Strings: newStrings
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
            CourseID: value.value
        });
    }

    selectSection(e){
        this.setState({
            SectionID: e.value
        });
    }


    render(){
        let {CourseID, SemesterID, SectionID, Strings} = this.state;
        var apiContentHolder = null;//Initially null, Basically declaring the variable

        let courseAndSection = null;//Initially null, Basically declaring the variable

        //If Semester is not null then allow user to choose a class
        if(this.state.SemesterID != null) {
            courseAndSection = (
                <div id="courseForLeaderBoard">
                    <CourseSelect selectCourse={this.onClassChange}
                        UserID={this.props.UserID}
                        Strings={Strings}
                        CourseID={CourseID}/>

                    <SectionSelectComponent selectSection={this.selectSection} 
                        UserID={this.props.UserID}
                        CourseID={CourseID}
                        SectionID={SectionID}
                        SemesterID={SemesterID}
                        Strings={Strings}
                    /> 
                </div>
            );

            //If user has already chose a class then show him rankings, (Class Ranking, Top Movers, and vs Sections)
            if (this.state.CourseID != null && this.state.SectionID != null) {

                apiContentHolder =
                    <div >
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
                    </div>;
            } else {
                //If class is not selected then have a placeholder that says "Please select a class!!!"
                apiContentHolder =
                    <div id="leaderboard"><h1 id="noRankh1">Please select a Class!!!</h1></div>;
            }
        }
        else{
            //If section is not selected then have a placeholder that says "Please select a semester!!!"
            apiContentHolder =
                <div id="leaderboard"><h1 id="noRankh1">Please select a Semester!!!</h1></div>;
        }

        //Semester Dropdown and passing data to other files
        return (

            <div className="container">
                <div className="select-section">
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
                <div className="badge-section">
                    {apiContentHolder}

                </div>



            </div>
        );
    }
}


export default MainLeaderboard;