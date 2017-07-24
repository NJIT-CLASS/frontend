/*
 * Created by Sohail and Immanuel on 7/2/2017.
 */

import React from 'react';
import ClassForBadge from './classForBadge';
import BadgeCategory from './badgeCategory';
import Badge from './badge';
import Select from 'react-select';
import request from 'request';


class MainBadge extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            SemesterID: null,
            CourseID: null,
            BadgeCategory: null,
            SectionID: null
        };
        this.onSemesterChange= this.onSemesterChange.bind(this);
        this.onClassChange = this.onClassChange.bind(this);
        this.onBadgeCategoryChange = this.onBadgeCategoryChange.bind(this);
        // this.onSectionIDChange= this.onSectionIDChange.bind(this);
    }

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


    onSemesterChange(value){
        console.log(value);
        this.setState({
            SemesterID: value.value
        });
    }

    onClassChange(value){
        console.log("Class value", value);
        this.setState({
            CourseID: value.value,
            SectionID: value.sectionId
        });
    }

    onBadgeCategoryChange(value){
        console.log(value);
        this.setState({
            BadgeCategory: value.value
        });
    }

    /*onSectionIDChange(value){
     console.log(value);
     this.setState({
     sectionID: value.value
     });
     }*/

    render(){
        var apiContentHolder = null;

        let classAndCategory = null;



        if(this.state.SemesterID != null){

            classAndCategory =  (
                <div>
                    <ClassForBadge apiUrl={this.props.apiUrl}
                                   SemesterID={this.state.SemesterID}
                                   UserID={this.props.UserID}
                                   onClassChange={this.onClassChange}
                                   CourseID={this.state.CourseID}
                    />
                    <div id = "badgeCategory">
                        <BadgeCategory apiUrl={this.props.apiUrl}
                                       selectedBadgeCategory={this.state.BadgeCategory}
                                       onBadgeCategoryChange={this.onBadgeCategoryChange}
                                       CourseID={this.state.CourseID}
                                       SemesterID={this.state.SemesterID}
                                       SectionID={this.state.SectionID}                        />
                    </div>
                </div>
            );

        }

        if(this.state.CourseID != null && this.state.BadgeCategory != null){

            apiContentHolder =
                <div id = "badge">
                    <Badge apiUrl={this.props.apiUrl}
                           SemesterID={this.state.SemesterID}
                           UserID={this.props.UserID}
                           CourseID={this.state.CourseID}
                           SectionID={this.state.SectionID}
                           BadgeCategory={this.state.BadgeCategory}
                    />
                </div>
        }else{
            apiContentHolder =
                <div id="badge"><h1 id="noBadgeh1">No Badge To Display 😭</h1></div>
        }


        return (

            <div className="container">
                <div id="mainBadgeSelectDiv">
                    <Select
                        options={this.state.Semesters}
                        value={this.state.SemesterID}
                        onChange={this.onSemesterChange}
                        clearable={false}
                        searchable={false}
                        placeholder="Semester"
                    />

                    {classAndCategory}

                </div>
                <div></div>

                {apiContentHolder}

            </div>
        );
    }
}


export default MainBadge;