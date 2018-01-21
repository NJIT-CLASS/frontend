import React, { Component } from 'react'; //import the React library and the Component class from the react package
import ReactTable from 'react-table';
import Tooltip from '../shared/tooltip';
import apiCall from '../shared/apiCall';
import 'react-dates/initialize';
import { DateRangePicker, SingleDatePicker, DayPickerRangeController } from 'react-dates';
import moment from 'moment';

class MyCommentsComponent extends Component { //create a class for the component
    //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
        // or C's int main() or Python's def main()

        this.state = {
            Data: [],
            Loaded: false,
      			startDate: null,
      			endDate: null,
        }; //initial state, only manually assigned here, elsewhere it's this.setState()
    }

    componentWillMount() {
        this.getCommentData();
    }

    getCommentData() {
        let commentData = [];
        apiCall.get(`/comments/userID/${this.props.UserID}`, (err, res, body) => {
            if (!body.Error) {
                commentData = body.Comments;
                for (let comment of commentData) {
                    apiCall.get(`/comments/courseData/${comment.AssignmentInstanceID}`, (err, res, body) => {
                        if (!body.Error) {
                            comment.CourseName = body.CourseName;
                            comment.SectionName = body.SectionName;
                            comment.SemesterName = body.SemesterName;
                            this.setState({Data: commentData});
                        }
                        else {
                            console.log('No course data received.');
                        }
                    });
                    let FinalTargetID;
                    apiCall.get(`/getNextTask/${comment.OriginTaskInstanceID}`, (err, res, body) => {
                        if ((body != undefined) && !body.Error) {
                            let tasks = body.NextTask;
                            FinalTargetID = comment.OriginTaskInstanceID;
                            tasks.forEach((task, index) => {
                                if (JSON.parse(task.Status)[0] == 'complete') {
                                    FinalTargetID = task.TaskInstanceID;
                                }
                            }, this);
                            comment.AccessLink = `/task/${FinalTargetID}?tab=comments&target=${comment.CommentTarget}&targetID=${comment.TargetID}&commentsID=${comment.CommentsID}`;

                            this.setState({Loaded: comment.CommentsID});
                        }
                        else {
                            console.log('No comment task data received.');
                        }
                    });
                }

            }
            else {
                console.log('No comment UserID data received.');
            }
        });
    }

    render() {
        let strings = {      // define all your strings in an object like this one (the name of the keys can be anything)
            // we use this for translation
            TitleText: 'My Comments, Ratings, and Flags',
            CommentLabel: 'Comment',
            TimestampLabel: 'Timestamp',
            CourseLabel: 'Course',
            SectionLabel: 'Section',
            SemesterLabel: 'Semester',
            RatingLabel: 'Rating',
            StatusLabel: 'Status',
            FlagStatusLabel: 'Flag Status',
            ViewLabel: 'View Comment or Flag',
            TypeLabel: 'Type',
            TooltipText: 'Hold the Shift key to select multiple columns for sorting',
            AllLabel: 'All',
            OnLabel: 'Activated',
            OffLabel: 'Deactivated',
            FlagLabel: 'Flag',
            SubmittedLabel: 'Submitted',
            SavedLabel: 'Draft'
        };

        let returnLoaded = (
            <div className="card">
                <div style={{paddingBottom: 10}}>
                    <h2 className="title">{strings.TitleText}</h2>
                    <Tooltip Text={strings.TooltipText}/>
                </div>
                
                <ReactTable
                    data = {this.state.Data}
                    minRows = {0}
                    filterable = {true}
                    showFilters= {true}
                    defaultFilterMethod = {(filter, row, column) => {
                        const id = filter.pivotId || filter.id;
                        return row[id] !== undefined ? String(row[id]).includes(filter.value) : true;
                    }
                    }
                    columns = {[
                        {
                            Header: strings.CourseLabel,
                            id: 'courseName',
                            accessor: (row) => row.CourseName,
                        },
                        {
                            Header: strings.SectionLabel,
                            id: 'sectionName',
                            accessor: (row) => row.SectionName,
                        },
                        {
                            Header: strings.SemesterLabel,
                            id: 'semesterName',
                            accessor: (row) => row.SemesterName,
                        },
                        {
                            Header: strings.TypeLabel,
                            id: 'type',
                            accessor: (row) => row.Type,
                            Cell: row => (row.value == 'flag') ? strings.FlagLabel : strings.CommentLabel,
                            filterMethod: (filter, row) => {
                                if (filter.value === 'all') {
                                    return true;
                                }
                                if (filter.value === 'true') {
                                    return row[filter.id] == 'flag';
                                }
                                return row[filter.id] == 'comment';
                            },
                            Filter: ({ filter, onChange }) =>
                                <select
                                    onChange={event => onChange(event.target.value)}
                                    style={{ width: '100%' }}
                                    value={filter ? filter.value : 'all'}
                                >
                                    <option value="all">{strings.AllLabel}</option>
                                    <option value="false">{strings.CommentLabel}</option>
                                    <option value="true">{strings.FlagLabel}</option>
                                </select>
                        },
                        {
                            Header: strings.CommentLabel,
                            id: 'commentsText',
                            accessor: (row) => row.CommentsText,
                        },
                        {
                            Header: strings.RatingLabel,
                            id: 'rating',
                            accessor: (row) => row.Rating,
                            width: 75,
                        },
                        {
                            Header: strings.StatusLabel,
                            id: 'status',
                            accessor: (row) => row.Status,
                            Cell: (row) => ((row.original.Status == 'saved') ? strings.SavedLabel : strings.SubmittedLabel),
                            filterMethod: (filter, row) => {
                                if (filter.value === 'all') {
                                    return true;
                                }
                                if (filter.value === 'true') {
                                    return row[filter.id] == 'submitted';
                                }
                                return row[filter.id] == 'saved';
                            },
                            Filter: ({ filter, onChange }) =>
                                <select
                                    onChange={event => onChange(event.target.value)}
                                    style={{ width: '100%' }}
                                    value={filter ? filter.value : 'all'}
                                >
                                    <option value="all">{strings.AllLabel}</option>
                                    <option value="true">{strings.SubmittedLabel}</option>
                                    <option value="false">{strings.SavedLabel}</option>
                                </select>
                        },
                        {
                            Header: strings.FlagStatusLabel,
                            id: 'flagStatus',
                            accessor: (row) => row.Flag,
                            Cell: row => (row.original.Type == 'flag') ? ((row.value == 1) ? <i className="fa fa-flag" style={{color:'red'}}></i> : <i className="fa fa-flag-o" style={{color:'gray'}}></i>) : <div></div>,
                            filterMethod: (filter, row) => {
                                if (filter.value === 'all') {
                                    return true;
                                }
                                if (filter.value === 'true') {
                                    return row[filter.id] == 1;
                                }
                                return ((row[filter.id] == 0) && (row.type == 'flag'));
                            },
                            Filter: ({ filter, onChange }) =>
                                <select
                                    onChange={event => onChange(event.target.value)}
                                    style={{ width: '100%' }}
                                    value={filter ? filter.value : 'all'}
                                >
                                    <option value="all">{strings.AllLabel}</option>
                                    <option value="true">{strings.OnLabel}</option>
                                    <option value="false">{strings.OffLabel}</option>
                                </select>
                        },
                        {
                            Header: strings.TimestampLabel,
                            id: 'timestamp',
                            accessor: (row) => row.Time,
                            Cell: row => (<div>{moment(row.value).format('MMM Do YYYY, h:mm a')}</div>),
                            Filter: ({filter, onChange}) => (
                                <DateRangePicker
                                    startDate={this.state.startDate}
                                    endDate={this.state.endDate}
                                    onDatesChange={({startDate, endDate}) => {
                                        this.setState({startDate: startDate, endDate: endDate},()=>
                                        {onChange({startDate, endDate});
                                        });
                                    }}
                                    focusedInput={this.state.focusedInput}
                                    onFocusChange={focusedInput => this.setState({ focusedInput })}
                                    isOutsideRange={() => false}
                                    withPortal={true}
                                    showClearDates={true}
                                    noBorder={true}
                                />
                            ),
                            filterMethod: (filter, row) => {
                                if (filter.value.startDate === null || filter.value.endDate === null) {
                                    return true;
                                }

                                if (moment(row[filter.id]).isBetween(filter.value.startDate, filter.value.endDate)) {
                                    return true;
                                }
                            },
                            width: 200,
                        },
                        {
                            Header: strings.ViewLabel,
                            id: 'view',
                            accessor: (row) => <a style={{color: '#7ABDF9'}} href={row.AccessLink} target='_blank'>{strings.ViewLabel}<i className="fa fa-arrow-circle-right" style={{paddingLeft: 5}} aria-hidden="true"></i></a>,
                            width: 200,
                            filterable: false,
                        },
                    ]}
                    defaultPageSize={10}
                />
            </div>
        );

        if (this.state.Loaded != false) {
            return returnLoaded;
        }
        else {
            return <div></div>;
        }
    }
}

export default MyCommentsComponent;
