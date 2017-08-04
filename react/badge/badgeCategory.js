/**
 * Created by Sohail on 6/9/2017.
 * This file will allow the user to choose the category of the badge
 */
import React from 'react';
import request from 'request';
import Select from 'react-select';

class BadgeCategory extends React.Component {
    constructor(props){
        super(props);

        this.state = {badgeCategory: []};

        this.onBadgeCategoryChange = this.props.onBadgeCategoryChange.bind(this);//Coming from main badge File
    }

    fetchCategories(nextProps) {
        const fetchOptions = {
            method: 'GET',
            //Badge Category API to get all the categories of the badge based on course ID, Section ID, and Semester ID.
            uri: nextProps.apiUrl + '/api/badgeCategories/' + nextProps.CourseID+ '/' + nextProps.SectionID+ '/' + nextProps.SemesterID,
            json: true
        };

        //body will contain the information which will be passes and it is json
        //err will say if there is any error
        //response will be status
        request(fetchOptions,(err, response, body) => {
            this.setState({
                badgeCategory: body.categories,//List of Badge Categories
                //badges: body.badges//body.whatever we need from api
            })
        });

    }

    //Will render the data
    componentWillMount(){
        this.fetchCategories(this.props);
    };
    //If the data is changed without reloading the page then this function will take place
    componentWillReceiveProps(nextProps){
        this.fetchCategories(nextProps);
    };


    render(){

        //get data of badge Category to pass it in the select
        let badgeCategoryMap = this.state.badgeCategory.map(badgeKatKey => {
            return{
                value: badgeKatKey.CategoryID,
                label: badgeKatKey.Name
            }
        });

        //Select menu for badge Category
        return (

            <Select
                options={badgeCategoryMap}
                value={this.props.selectedBadgeCategory}
                onChange={this.onBadgeCategoryChange}
                clearable={false}
                searchable={false}
                placeholder="Category"
            />
        );
    }
}
export default BadgeCategory;