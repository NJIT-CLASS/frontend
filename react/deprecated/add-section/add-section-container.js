import React from 'react';
import request from 'request';
import Select from 'react-select';
import { clone, cloneDeep } from 'lodash';
import Strings from './strings';

class AddSectionContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            courses: null,
            description: '',
            selected_course: null,
            semesters: [],
            semesterId: '',
            semester_name: '',
            section_identifier: '',
            start_date: '',
            end_date: '',
            submitted: null,
            Strings: Strings
        };
    }

    componentWillMount() {

        this.props.__(Strings, newStrings => {
            this.setState({Strings: newStrings});
        });

        let courseArray = null;
        const options = {
            method: 'GET',
            uri: this.props.apiUrl +
				'/api/getCourseCreated/' +
				this.props.userId, // get all course created
            json: true
        };

        request(options, (err, res, body) => {
            courseArray = body.Courses.map(function(course) {
                return {
                    value: course.CourseID,
                    label: course.Name + ' (' + course.Number + ')'
                };
            });

            this.setState({
                courses: courseArray
            });
        });

        const semFetchOptions = {
			// get all semester
            method: 'GET',
            uri: this.props.apiUrl + '/api/semester',
            json: true
        };

        request(semFetchOptions, (err, res, body) => {
            let semList = [];
            for (let sem of body.Semesters) {
                semList.push({ value: sem.SemesterID, label: sem.Name });
            }
            this.setState({
                semesters: semList
            });
        });
    }

    onSubmit() {
		//need to make API to handle this
        if (!this.state.semesterId || !this.state.selected_course) {
            this.setState({ submitted: false });
            return;
        }

        const options = {
            method: 'POST',
            uri: this.props.apiUrl + '/api/course/createsection',
            body: {
                semesterid: this.state.semesterId,
                courseid: this.state.selected_course,
                name: this.state.section_identifier,
                description: this.state.description,
                organizationid: 1
            },
            json: true
        };

        request(options, (err, res, body) => {
            if (err || res.statusCode == 401) {
                console.log('Error submitting!');
                this.setState({ submitted: false });
                return;
            }
            this.setState({ submitted: true });
            console.log('Section created', body.response);
        });
    }

    onChangeCourse(course) {
        this.setState({ selected_course: course.value });
    }

    onSemesterChange(sem) {
        this.setState({ semesterId: sem.value });
    }

    onChangeSemesterName(name) {
        this.setState({ semester_name: name.value });
    }

    onChangeStartDate(start) {
        this.setState({ start_date: start.value });
    }

    onChangeEndDate(end) {
        this.setState({ end_date: end.value });
    }

    onSectionIdentifierChange(event) {
        this.setState({
            section_identifier: event.target.value
        });
    }

    render() {
        const strings = this.state.Strings;
        let message = null;
        if (this.state.submitted == true) {
            message = (
				<span
					onClick={() => {
    this.setState({ submitted: null });
}}
					className="small-info-message"
				>
					<span className="success-message">
						{strings.Success}
					</span>
				</span>
			);
        } else if (this.state.submitted == false) {
            message = (
				<span
					onClick={() => {
    this.setState({ submitted: null });
}}
					className="small-info-message"
				>
					<div className="error-message">{strings.SubmitError}</div>
				</span>
			);
        }

        let semestersList = clone(this.state.semesters); // using lodash here
		//semestersList.push({ value: "create", label: 'Create new semester...' });

        let createSection = null;
        if (this.state.selected_course != null) {
            createSection = (
				<div>
					<label>{strings.SectionIdentifier}</label>
					<div>
						<input
							type="text"
							value={this.state.section_identifier}
							onChange={this.onSectionIdentifierChange.bind(this)}
						/>
					</div>
					<label>{strings.Semester}</label>
					<div>
						<Select
							options={semestersList}
							value={this.state.semesterId}
							onChange={this.onSemesterChange.bind(this)}
							resetValue={''}
							clearable={true}
							searchable={false}
						/>
					</div>
				</div>
			);
        }

        let createSemester = null;
		// if (this.state.semesterId == 'create'){
		//   createSemester = (
		//     <div>
		//       <label>Semester Name</label>
		//       <div>
		//           <input
		//             type="text"
		//             value={this.state.semester_name}
		//             onChange={this.onChangeSemesterName.bind(this)}/>
		//       </div>
		//       <label>Start Date</label>
		//       <div>
		//           <input
		//             type="date"
		//             value={this.state.start_date}
		//             onChange={this.onChangeStartDate.bind(this)}
		//             />
		//       </div>
		//       <label>End Date</label>
		//       <div className="col-sm-10">
		//           <input
		//             type="date"
		//             value={this.state.end_date}
		//             onChange={this.onChangeEndDate.bind(this)}/>
		//       </div>
		//     </div>
		//   );
		// }

		//alert(this.state.courses);
        return (
			<div>
				{message}
				<div className="section add-section-details">
					<h2 className="title">{strings.SelectCourse}</h2>
					<form className="section-content">
						<label>{strings.Course}</label>
						<div>
							<Select
								options={this.state.courses}
								value={this.state.selected_course}
								onChange={this.onChangeCourse.bind(this)}
								resetValue={''}
								clearable={true}
								searchable={true}
							/>
							{createSection}
							{createSemester}
							<div className="section-button-area">
								<button
									type="button"
									onClick={this.onSubmit.bind(this)}
								>
									{strings.Submit}
								</button>

							</div>
						</div>
					</form>
				</div>
			</div>
        );
    }
}

export default AddSectionContainer;
