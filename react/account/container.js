import React from 'react';
import request from 'request';

class Container extends React.Component {
	constructor(props){
		super(props);

		this.state = {}
		this.strings = { 
			account: "Account",
			name: "Name",
			firstName: "First Name",
			lastName: "Last Name",
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
			preferredEmail: "Preferred Email",
			phoneNumber: "Phone Number"
		}
	}

	componentWillMount(){

		const orgFetchOptions = {
			method: 'GET',
			uri: this.props.apiUrl + '/api/generalUser/' + this.props.UserID,
			json: true
		};

		request(orgFetchOptions, (err, res, body) => {
			let user = body.User[0];
			this.setState({
				user: user,
				first_name: user.FirstName,
				last_name: user.LastName,
				email: user.UserLogin.Email
			});
		});
	}

	updatePassword() {
		let password_error = null;
		if (this.state.new_password != this.state.confirm_password) {
			password_error = 'The passwords entered do not match.';
		}
		if (password_error) {
			this.setState({
				password_error: password_error
			});
		} else {
			this.setState({
				password_error: null,
				changing_password: false
			});
		}
	} 
	changePassword() {
		this.setState({
			changing_password: true
		});
	}
	editAccount() {	
		this.setState({
			editing: true
		});
	}
	cancel() {
		this.setState({
			editing: false,
			changing_password: false
		});
	}
	onSubmit(event) {
		event.preventDefault();
	}
	save() {

	}
	changePreferredEmail(event) {
		this.setState({
			preferred_email: event.target.value
		});
	}
	changeFirstName(event) {
		this.setState({
			first_name: event.target.value
		});
	}
	changeLastName(event) {
		this.setState({
			last_name: event.target.value
		});
	}
	changePhone(event) {
		this.setState({
			phone: event.target.value
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

		let accountView = (
			<div className="card">
				<h2 className="title">{this.state.first_name + ' ' + this.state.last_name}</h2>
				<button type="button" onClick={this.changePassword.bind(this)}>{this.strings.changePassword}</button>
				<button type="button" onClick={this.editAccount.bind(this)}>{this.strings.edit}</button>
				<div className="card-content">
					<p>Email: ajr42@njit.edu</p>
					<p>Preferred Email: alan.romano@gmail.com</p>
					<p>Phone Number: (201) 921-7284</p>
					<p>User Type: Instructor</p>
				</div>
			</div>
		);
		let accountEdit = (
			<div className="card">
				<h2 className="title">{this.strings.editAccount}</h2>
				<button type="button" onClick={this.save.bind(this)}>{this.strings.save}</button>
				<button type="button" onClick={this.cancel.bind(this)}>{this.strings.cancel}</button>
				<form className="card-content" onSubmit={this.onSubmit.bind(this)}>
					<label>{this.strings.firstName}</label>
					<input type="text" onChange={this.changeFirstName.bind(this)}></input>
					<label>{this.strings.lastName}</label>
					<input type="text" onChange={this.changeLastName.bind(this)}></input>
					<label>{this.strings.preferredEmail}</label>
					<input type="text" onChange={this.changePreferredEmail.bind(this)}></input>
					<label>{this.strings.phoneNumber}</label>
					<input type="text" onChange={this.changePhone.bind(this)}></input>
				</form>
			</div>
		);
		let passwordChange = null;
		if (this.state.changing_password) {
			passwordChange = (
				<div className="card">
					<h2 className="title">{this.strings.changePassword}</h2>
					<button type="button" onClick={this.updatePassword.bind(this)}>{this.strings.save}</button>
					<button type="button" onClick={this.cancel.bind(this)}>{this.strings.cancel}</button>
					<form className="card-content" onSubmit={this.onSubmit.bind(this)}>
						{ this.state.password_error ? <p>{this.state.password_error}</p> : null }
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
