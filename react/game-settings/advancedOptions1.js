import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import Toggle from '../shared/toggleSwitch';
import Tooltip from '../shared/tooltip';

class BadgeOptions extends Component {
    constructor(props){
        super(props);

        this.state = {
            Badges: []
        };
    }

    componentWillMount() {
        this.fetchBadges(this.props);
    }
    componentWillReceiveProps(nextProps) {
        this.fetchBadges(nextProps);
    }

    fetchBadges(props){
        const {CourseID, SectionID, SemesterID} = this.props;
        apiCall.get(`/badgeCategories/${CourseID}/${SectionID}/${SemesterID}`, (err,res,body) => {
            console.log(body);
            this.setState({
                Badges: body.categories
            });
        });
    }

    render() {
        let {Badges} = this.state;
        let {Strings} = this.props;
        return (
            <div className="badge-settings">
                <div className="center-block">
                    <div className="header">{Strings.Goals}</div>
                    { Badges.map(badge => 
                        <div className="option" key={badge.CategoryID}>
                            <div className="option-label">
                                <label className="badge-name">
                                    {badge.Name}
                                </label>
                                <Tooltip ID={`badge-${badge.CategoryID}-tooltip`} />
                                <Toggle />
                                
                            </div>
                            <div className="option-value">
                                <span>{Strings.Bronze}</span>
                                <input type="text" name="bronze"  value={badge.Tier1Instances}/>
                                <span>{Strings.Silver}</span>
                                <input type="text" name="silver" value={badge.Tier2Instances} />
                                <span>{Strings.Gold}</span>
                                <input type="text" name="gold" value={badge.Tier3Instances} />
                            </div>
                        </div>
                    )}
                </div>
                    
                
            </div>
        );
    }
}

BadgeOptions.defaultProps = {
    CourseID: 1,
    SectionID: 1,
    SemesterID: 1
};

export default BadgeOptions;