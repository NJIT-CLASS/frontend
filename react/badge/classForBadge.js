/**
 * Created by Sohail and Immanuel on 7/7/2017.
 */
import React from 'react';
import request from 'request';
import Tooltip from '../shared/tooltip';
import Select from 'react-select';

class ClassForBadge extends React.Component {
    constructor(props){
        super(props);

        this.state = {studentClasses: []};
        this.onClassChange= this.props.onClassChange.bind(this);
    }

    fetchClassData(nextProps) {
        const fetchOptions = {
            method: 'GET',
            //'/api/{add the string or name that amoudo has made}
            uri: this.props.apiUrl + '/api/studentCourses/' + nextProps.UserID + '/' + nextProps.SemesterID,
            //qs: {SemesterID: this.props.SemesterID},
            json: true
        };

        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        request(fetchOptions,(err, response, body) => {
            console.log(body);
            this.setState({
                studentClasses: body.courses
                //stuff we need from api
                //badges: body.badges//body.whatever we need from api
            })
        });

    }

    componentWillMount(){
        this.fetchClassData(this.props);
    };
    componentWillReceiveProps(nextProps){
        this.fetchClassData(nextProps);
    };

    /*
    * {"Error":false,"courses":[{"Name":"Intro to Computer Science","Number":"CS100","Description":null},
    * {"Name":"Programming Language Concept","Number":"CS280","Description":null},
    * {"Name":"Calculus II","Number":"Math121","Description":null}]}
    * */

    render(){

        //Change Object.keys(Workflow) to the api (So example if the api badges then it would be this.state.badges)
        //TaskActivity will be replaced by the things we need

        //badgeDisplay = Object.keys(Workflow).map(key => {
        //return <BadgeDisplay TaskActivity={Workflow[key]}

        //key is the ID from Database
        //let classListArray = [{classNumber: "CS100",key: 1}, {classNumber: "CS310",key: 2}, {classNumber: "CS400",key: 3}, {classNumber: "CS490",key: 4}];

        let classList = this.state.studentClasses.filter(klass => klass.Section !== null).map(klass => {

         return {
             value: klass.CourseID,
             label: klass.Number,
             sectionId: klass.SectionID,
         }


            /*   return <li key={klass.courseID}>
                <Tooltip Text={klass.Name} ID={`tooltip${klass.courseID}`} />
                {klass.Number}</li>*/
        });

        return (

            <Select
                options={classList}
                value={this.props.CourseID}
                onChange={this.onClassChange}
                clearable={false}
                searchable={false}
                placeholder="Class Number"
            />
            /*<div className="section card-2">
                <h2 className="title">Class</h2>
                <form className="section-content">
                    <ul>
                        {classList}
                    </ul>

                </form>
            </div>*/
        );
    }
}

export default ClassForBadge;
