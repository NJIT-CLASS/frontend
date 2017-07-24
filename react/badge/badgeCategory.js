/**
 * Created by Sohail and Immaunel on 6/9/2017.
 */
import React from 'react';
import request from 'request';
import Tooltip from '../shared/tooltip';
import Select from 'react-select';

class BadgeCategory extends React.Component {
    constructor(props){
        super(props);

        this.state = {badgeCategory: []};

        this.onBadgeCategoryChange = this.props.onBadgeCategoryChange.bind(this);
    }

    fetchCategories(nextProps) {
        const fetchOptions = {
            method: 'GET',
            //'/api/{add the string or name that amoudo has made}
            uri: nextProps.apiUrl + '/api/badgeCategories/' + nextProps.CourseID+ '/' + nextProps.SectionID+ '/' + nextProps.SemesterID,
            //qs: {SemesterID: this.props.SemesterID},
            json: true
        };

        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        request(fetchOptions,(err, response, body) => {
            console.log(body);
            this.setState({
                badgeCategory: body.categories,
                //stuff we need from api
                //badges: body.badges//body.whatever we need from api
            })
        });

    }

    componentWillMount(){
        this.fetchCategories(this.props);
    };
    componentWillReceiveProps(nextProps){
        this.fetchCategories(nextProps);
    };

    /*
    *  {"Error":false,"categories":[{"CategoryID":1,"Name":"Questions","Description":" Given to students who successfully submit a question through PLA"
    *  ,"Tier1Points":100,"Tier2Points":200,"Tier3Points":300}]}*/

    render(){

        //let classListArray = [{classNumber: "CS110",key: 1}, {classNumber: "CS210",key: 2}, {classNumber: "CS400",key: 3}, {classNumber: "CS490",key: 4}];

        let badgeCategoryMap = this.state.badgeCategory.map(badgeKatKey => {
            return{
                value: badgeKatKey.CategoryID,
                label: badgeKatKey.Name
            }

            /*return <li key={badgeKatKey.CategoryID}>
                <Tooltip Text={badgeKatKey.Description} ID={`tooltip${badgeKatKey.CategoryID}`} />
                {badgeKatKey.Name}</li>*/
        });

        return (

            <Select
                options={badgeCategoryMap}
                value={this.props.selectedBadgeCategory}
                onChange={this.onBadgeCategoryChange}
                clearable={false}
                searchable={false}
                placeholder="Category"
            />

            /*<div className="section card-2">
                <h2 className="title">Category</h2>
                <form className="section-content" >

                    <ul>
                        {classList}
                    </ul>

                </form>
            </div>*/
        );
    }
}
export default BadgeCategory;