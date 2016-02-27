function fetchCredentials() {
	//alert("Starting fetchCredentials()");
	//var userId = req.App.userId;			// TODO: get userId from local info
	//var userId = "1234";
	//alert(userId);
	
}

function validate_changePassword() {
	//var currPwd=document.forms["form_changePassword"]["field_currentPassword"].value;
	            var newPwd=document.forms['form_changePassword']['field_newPassword'].value;
	            var newPwdConf=document.forms['form_changePassword']['field_confirmNewPassword'].value;
	
	            if(newPwd=='' || newPwd!=newPwdConf) {
		            alert('\'New password\' and \'confirmed password\' fields do not match.');
		            return false;
	}
	
	            return true;
}


// 'Change name' form just needs non-empty fields, which is handled by HTML's 'required' tag on those input elements

/* TODO: Could use regex to restrict changing only to 'valid' email addresses, but should we? There are some 
 * non-standard email addresses that a usual regex check would weed out.
 */