import React, { Component } from 'react';
import apiCall from '../shared/apiCall';
import GoalComponent from './goalComponent';
import AchievementUnlockBar from './achievementUnlock';
import {isEmpty} from 'lodash';

class AchievementUnlockContainer extends Component {
    constructor(props){
        super(props);

        this.state = {
            SectionUserRecord: {},
            Goals:{},
            Loaded: false,
            NoRecords: false
        };

        this.claimReward = this.claimReward.bind(this);
    }

    componentDidMount() {
        
        this.fetchData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.fetchData(nextProps);
    }

    fetchData(props){
        apiCall.get(`/getSectionUserRecord/${props.SectionUserID}`, (err, res, body) => {
            if(isEmpty(body.SectionUserRecord)){
                return this.setState({
                    NoRecords: true,
                    Loaded: true
                });
            }
            this.setState({
                SectionUserRecord: body.SectionUserRecord,
                Goals: JSON.parse(body.SectionUserRecord.GoalProgression),
                Loaded: true,
                NoRecords: false,
                
            });
        });
    }

    claimReward(goalInstanceId){
        const postVars = {
            goalInstanceID:  goalInstanceId,
            sectionUserID: this.props.SectionUserID
        };
        apiCall.get('/claimExtraCredit', (err, res, body)=> {
            this.fetchData(this.props);
        });
        showMessage(this.props.Strings.SuccessClaim);
        return false;
    }

    render() {
        let {SectionUserRecord, Goals,Loaded, NoRecords} = this.state; 
        let {Strings, SectionUserID, CourseInfo} = this.props;

        if(!Loaded){
            return <div>
                <i className=" fa fa-cog fa-spin fa-4x fa-fw"></i>

            </div>;
        }
        if(NoRecords){
            return (<div>{Strings.NoRecords}</div>);
        }

        let goals = Object.keys(Goals).map(key => {
            let goal = Goals[key];
            return <GoalComponent Goal={goal}
                key={goal.UserPointInstanceID} 
                Strings={Strings}
                claimReward={this.claimReward}
            />;
        });
    
        return (
            <div>
                <AchievementUnlockBar Record={SectionUserRecord} Strings={Strings} CourseInfo={CourseInfo} />
                <div className="dividing-header">{Strings.ClassGoalsForSemester}</div>
                <div className="goals-section">
                    {goals}
                </div>
            </div>
        );
    }
}

export default AchievementUnlockContainer;