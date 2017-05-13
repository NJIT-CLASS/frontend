import React from 'react';
import request from 'request';
import Dropzone from 'react-dropzone';

class Container extends React.Component {
	constructor(props){
		super(props);

		this.state = {}
		this.strings = { 
			account: "Account",
			name: "Name",
			firstName: "Preferred First Name",
			lastName: "Preferred Last Name",
			officialFirstName: "Official First Name",
			officialLastName: "Official Last Name",
			email: "Email",
			password: "Password",
			changePassword: "Change Password",
			currentPassword: "Current Password",
			newPassword: "New Password",
			confirmPassword: "Confirm Password",
			profilePicture: "Profile Picture",
			upload: "Drag an image or click",
			edit: "Edit",
			cancel: "Cancel",
			save: "Save",
			submit: "Submit",
			editAccount: "Edit Account",
			loginEmail: "Login Email",
			notificationEmail: "Notification Email",
			phoneNumber: "Text Number",
			alias: "Alias",
			avatar: "Avatar",
			yes: "Yes",
			no: "No",
			admin: "Administrator",
			instructor: "Instructor"
		}
	}

	// load user information when component is mounted
	componentWillMount(){
		this.fetch();
	}
	// retrieve information from User, UserLogin, and UserContact tables
	// initiate editable fields with current state (prefixed with new_)
	fetch() {
		const fetchOptions = {
			method: 'GET',
			uri: this.props.apiUrl + '/api/generalUser/' + this.props.UserID,
			json: true
		};
		// not all users have UserLogin row, so the ternary operators
		// account for this discrepancy
		request(fetchOptions, (err, res, body) => {
			this.setState({
				id: body.User.UserID,
				official_first_name: body.User.FirstName,
				official_last_name: body.User.LastName,
				instructor: body.User.Instructor,
				admin: body.User.Admin,
				login_email: body.User.UserLogin.Email,
				preferred_first_name: body.User.UserContact ? body.User.UserContact.FirstName : null,
				new_first_name: body.User.UserContact ? body.User.UserContact.FirstName : null,
				preferred_last_name: body.User.UserContact ? body.User.UserContact.LastName : null,
				new_last_name: body.User.UserContact ? body.User.UserContact.LastName : null,
				notification_email: body.User.UserContact ? body.User.UserContact.Email : null,
				new_email: body.User.UserContact ? body.User.UserContact.Email : null,
				phone: body.User.UserContact ? body.User.UserContact.Phone : null,
				new_phone: body.User.UserContact ? body.User.UserContact.Phone : null,
				alias: body.User.UserContact ? body.User.UserContact.Alias : null,
				new_alias: body.User.UserContact ? body.User.UserContact.Alias : null,
				profilePicture: body.User.UserContact ? body.User.UserContact.ProfilePicture : null,
				avatar: body.User.UserContact ? body.User.UserContact.Avatar : null

			});
		});
	}

	// check that new password matches confirmation
	// ensure that new password is different from old password
	// enforce six character minimum on password for security
	// show error message if current password is incorrect
	updatePassword() {
		let password_error = null;
		if (this.state.new_password != this.state.confirm_password) {
			password_error = 'The passwords entered do not match.';
		} else if (this.state.new_password == null || this.state.new_password.length < 6) {
			password_error = 'Password must be at least six characters long.';
		} else if (this.state.new_password == this.state.current_password) {
			password_error = 'New password is same as current password.';
		}
		if (password_error) {
			this.setState({
				password_error: password_error
			});
		} else {
			const passwordOptions = {
				method: 'POST',
				uri: this.props.apiUrl + '/api/update/password',
				body: {
					userId: this.state.id,
					oldPasswd: this.state.current_password,
					newPasswd: this.state.new_password
				},
				json: true
			};

			request(passwordOptions, (err, res, body) => {
				if (err || res.statusCode == 401) {
					console.log('Error submitting!');
					this.setState({
						password_error: 'Incorrect password.'
					})
				} else {
					this.setState({
						password_error: null,
						changing_password: false
					});
				}
			});

		}
	}
	// used to conditionally show the password change card
	changePassword() {
		this.setState({
			changing_password: true
		});
	}
	// used to change account card from view to edit
	editAccount() {
		this.setState({
			editing: true
		});
	}
	// used to cancel both edit mode and password change mode
	// reset edited values to current state for later editing
	cancel() {
		this.setState({
			editing: false,
			errors: null,
			changing_password: false,
			new_first_name: this.state.preferred_first_name,
			new_last_name: this.state.preferred_last_name,
			new_email: this.state.notification_email,
			new_phone: this.state.phone,
			new_alias: this.state.alias
		});
	}
	// prevent enter button from submitting form normally
	onSubmit(event) {
		event.preventDefault();
	}
	// validate user, save to server, exit edit mode if successful
	update() {
		let user = this.validate();
		if (user) {
			user.UserID = this.state.id;
			const saveOptions = {
				method: 'POST',
				uri: this.props.apiUrl + '/api/userContact',
				body: user,
				json: true
			};

			request(saveOptions, (err, res, body) => {
				if (err || res.statusCode == 401 || res.statusCode == 404) {
					console.log('Error submitting!');
					return;
				} else {
					this.setState({
						editing: false
					})
					this.fetch();
				}
			});
		}
	}
	// ensure that edited values (non-null) are either whitespace or proper format
	// validates emails and phone number with rudimentary regex
	// new phone formats might need to be accommodated
	// whitespace is converted to null on backend when storing
	validate() {
		let email = /^.+@.+\..+$/;
		let phone = /^\(\d{3}\) \d{3}-\d{4}$/;
		let whitespace = /^\s*$/;
		let user = {};
		let errors = [];

		if (this.state.new_email != null && (email.test(this.state.new_email) || whitespace.test(this.state.new_email))) {
			user.Email = this.state.new_email
		} else if (this.state.new_email != null) {
			errors.push('Invalid email')
		}

		if (this.state.new_first_name != null) {
			user.FirstName = this.state.new_first_name
		}
		if (this.state.new_last_name != null) {
			user.LastName = this.state.new_last_name
		}
		if (this.state.new_alias != null) {
			user.Alias = this.state.new_alias
		}

		if (this.state.new_phone != null && (phone.test(this.state.new_phone) || whitespace.test(this.state.new_phone))) {
			user.Phone = this.state.new_phone
		} else if (this.state.new_phone != null) {
			errors.push('Invalid phone number: (###) ###-####')
		}

		// store error array in state for display in interface
		if (errors.length > 0) {
			this.setState({
				errors: errors
			})
			return false;
		} else {
			this.setState({
				editing: false,
				errors: null,
				new_email: null,
				new_first_name: null,
				new_last_name: null,
				new_alias: null,
				new_phone: null
			});
			return user;
		}
	}
	// the subsequent functions are just used to store state values from the forms
	changeNotificationEmail(event) {
		this.setState({
			new_email: event.target.value
		});
	}
	changeFirstName(event) {
		this.setState({
			new_first_name: event.target.value
		});
	}
	changeLastName(event) {
		this.setState({
			new_last_name: event.target.value
		});
	}
	changeAlias(event) {
		this.setState({
			new_alias: event.target.value
		});
	}
	changePhone(event) {
		this.setState({
			new_phone: event.target.value
		});
	}
	changeCurrentPassword(event) {
		this.setState({
			current_password: event.target.value
		});
	}
	changeNewPassword(event) {
		this.setState({
			new_password: event.target.value
		});
	}
	changeConfirmPassword(event) {
		this.setState({
			confirm_password: event.target.value
		});
	}

	render() {

		// create name for display in card header
		// prefer user-provided names over official names where possible
		let first_name = this.state.preferred_first_name ? this.state.preferred_first_name : this.state.official_first_name;
		let last_name = this.state.preferred_last_name ? this.state.preferred_last_name : this.state.official_last_name;
		let name = [];
		if (first_name != null && first_name != '') name.push(first_name);
		if (last_name != null && first_name != '') name.push(last_name);
		name = name.join(' ');

		// display official email as 'email' when alone, add additional clarifying
		// labeling when both emails are present
		let email = null;
		if (this.state.notification_email != null) {
			email = [
				(<tr key={1}><td>{this.strings.loginEmail}</td><td>{this.state.login_email}</td></tr>),
				(<tr key={2}><td>{this.strings.notificationEmail}</td><td>{this.state.notification_email}</td></tr>)
			]
		} else {
			email = (
				<tr><td>{this.strings.email}</td><td>{this.state.login_email}</td></tr>
			)
		}

		// conditionally render optional fields from the UserLogin table
		// show official names in table if preferred name is being used in header
		let alias = this.state.alias != null ? (<tr><td>{this.strings.alias}</td><td>{this.state.alias}</td></tr>) : null;
		let phone = this.state.phone != null ? (<tr><td>{this.strings.phoneNumber}</td><td>{this.state.phone}</td></tr>) : null;
		let official_first_name = (this.state.preferred_first_name != null && this.state.official_first_name != null) ? (<tr><td>{this.strings.officialFirstName}</td><td>{this.state.official_first_name}</td></tr>) : null;
		let official_last_name = (this.state.preferred_last_name != null && this.state.official_last_name != null) ? (<tr><td>{this.strings.officialLastName}</td><td>{this.state.official_last_name}</td></tr>) : null;
		let instructor = (<tr><td>{this.strings.instructor}</td><td>{this.state.instructor ? this.strings.yes : this.strings.no }</td></tr>);
		let admin = (<tr><td>{this.strings.admin}</td><td>{this.state.admin ? this.strings.yes : this.strings.no }</td></tr>);

		// account view, buttons to change password or edit account info
		// display fields in table
		let accountView = (
			<div className="card">
				<h2 className="title">{name == '' ? this.strings.account : name}</h2>
				<button type="button" onClick={this.editAccount.bind(this)}>{this.strings.edit}</button>
				<button type="button" onClick={this.changePassword.bind(this)}>{this.strings.password}</button>
				<div className="card-content">
					<table><tbody>
						{ email }
						{ official_first_name }
						{ official_last_name }
						{ alias }
						{ phone }
						{ instructor }
						{ admin }
					</tbody></table>
				</div>
			</div>
		);
		// push error list into error message (formatted in red with icon)
		let errors = null;
		if (this.state.errors) {
			let error_list = this.state.errors.map((error, index) => {
				return (
					<p key={index}>{error}</p>
				);
			});
			errors = (
				<div className={`error form-error`}>
					<i className={`fa fa-exclamation-circle`}></i>
					{ error_list }
				</div>
			); 
		}
		// account editing card, prepopulated with existing information
		// photo upload Dropzone components are not functional
		let accountEdit = (
			<div className="card">
				<h2 className="title">{this.strings.editAccount}</h2>
				<button type="button" onClick={this.update.bind(this)}>{this.strings.save}</button>
				<button type="button" onClick={this.cancel.bind(this)}>{this.strings.cancel}</button>
				<form className="card-content" onSubmit={this.onSubmit.bind(this)}>
					{ errors }
					<label>{this.strings.firstName}</label>
					<input type="text" value={this.state.new_first_name == null ? '' : this.state.new_first_name} onChange={this.changeFirstName.bind(this)}></input>
					<label>{this.strings.lastName}</label>
					<input type="text" value={this.state.new_last_name == null ? '' : this.state.new_last_name} onChange={this.changeLastName.bind(this)}></input>
					<label>{this.strings.alias}</label>
					<input type="text" value={this.state.new_alias == null ? '' : this.state.new_alias} onChange={this.changeAlias.bind(this)}></input>
					<label>{this.strings.notificationEmail}</label>
					<input type="text" value={this.state.new_email == null ? '' : this.state.new_email} onChange={this.changeNotificationEmail.bind(this)}></input>
					<label>{this.strings.phoneNumber}</label>
					<input type="text" value={this.state.new_phone == null ? '' : this.state.new_phone} onChange={this.changePhone.bind(this)} placeholder="(###) ###-####"></input>
					<label>{this.strings.profilePicture}</label>
					<Dropzone accept="image/*">{this.strings.upload}</Dropzone>
					<label>{this.strings.avatar}</label>
					<Dropzone accept="image/*">{this.strings.upload}</Dropzone>
				</form>
			</div>
		);
		// format password change errors
		let password_error = null;
		if (this.state.password_error) {
			password_error = (
				<div className={`error form-error`}>
					<i className={`fa fa-exclamation-circle`}></i>
					<p>{ this.state.password_error }</p>
				</div>
			)
		}
		// render password change card if it is enabled in state
		// display error if present
		let passwordChange = null;
		if (this.state.changing_password) {
			passwordChange = (
				<div className="card">
					<h2 className="title">{this.strings.changePassword}</h2>
					<button type="button" onClick={this.updatePassword.bind(this)}>{this.strings.save}</button>
					<button type="button" onClick={this.cancel.bind(this)}>{this.strings.cancel}</button>
					<form className="card-content" onSubmit={this.onSubmit.bind(this)}>
						{ password_error }
						<label>{this.strings.currentPassword}</label>
						<input type="password" onChange={this.changeCurrentPassword.bind(this)}></input>
						<label>{this.strings.newPassword}</label>
						<input type="password" onChange={this.changeNewPassword.bind(this)}></input>
						<label>{this.strings.confirmPassword}</label>
						<input type="password" onChange={this.changeConfirmPassword.bind(this)}></input>
					</form>
				</div>
			);
		}
		return (
			<div>
				{ this.state.editing ? accountEdit : accountView }
				{ passwordChange }
			</div>
		);
	}

}

export default Container;
