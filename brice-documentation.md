# Course and Section Management

## Organization

The logo database field is in place to store a path to an image for the organization. The interface already has a drop zone for this logo in its edit mode. This needs to be wired up to the backend API to upload the image. A place for the logo should also be added to the default view when not editing. In other screens beyond this one, some code still defaults to the first organization. This should be rewritten with the assumption that there is more than one organization in the system.

Additional confirmation should be added when deleting entities from this page. Cascading deletes can wipe out extensive amounts of information. When a user clicks the delete button, the effects of the action should be explained clearly and succinctly. They should be given a default option of canceling the delete operation. It should be made more difficult to delete than to cancel the delete.

## Semester

The start and end date fields on the edit semester card should be replaced with a date picker for easier entry. The data type was changed from a date time value to only a date value. It is stored without the time, but Sequelize appends the time of midnight when accessing through the API. This can be stripped by using the 'T' as a delimiter (date times are represented as ISO 8601 strings).

## Student, Instructor, and Observer Rosters

The lists are fully functional and display all current information for the five columns. When Brian's volunteer pool table is integrated, it will likely replace these tables altogether. Currently, the active and volunteer flags are section-wide, not per assignment. Adding a user checks the system for a user with that email in the UserLogin table. If there is already a user there, it won't create a new one and will instead just add that existing user to the section. If the instructor adds a first and last name that do not match the existing organization names, they will be ignored and replaced with those that are already in the database. If a user email does not exist in the system, a new user will be created (with the new first and last names, if they are given). This user will be sent an email with a randomly generated temporary password.

The CSV input can be entered with different header orders, as controlled by the dropdown menu in the interface. It requires only an email, and has proper validation and defaults. It automatically strips whitespace and empty lines. In the future, the three different section user roles may have different fields or capabilities. Currently, they are all extended from the same user manager component in React.

It is not currently possible to select which fields to display in the list view with a dropdown. It would be easier to implement with the React-based table Brian used in his volunteer pool management interface. The edit mode is also not implemented, as this would be easier to implement with Brian's table. A user should be able to select a single section user to edit. In this case, if the instructor edits the name, these values should override the official names stored in the database (contrary to what happens when an existing user is added to a section — in that case, the new name is discarded in favor of the one that is already stored). This creates a safety net so that instructors will not accidentally override official names when inputting the user initially. Then, if the instructor goes back to edit the name, it can be assumed that the name change is intentional.

Additional error messages need to be shown to the instructor when he or she tries to add a section user that is already in the section. For example, trying to add a user who is already an instructor into the students section should return a warning.

Note: The email notification function in the backend API call, used to invite new users to the system, is currently commented out for development purposes. When entering a lot of CSV test data, the system would attempt to send many emails to fake addresses. The email notification IS functional, however, and can be uncommented to enable this functionality.

# Account

The account page works properly, displaying information from the User, UserLogin, and UserContact pages. The email in UserLogin is treated as the authoritative, organization-wide email. The first and last names in the User table are considered authoritative and cannot be changed by the user. When editing account information on this page, the user is only ever changing data in the UserLogin table, where the preferred first and last names, notification email, notification phone number, alias, profile picture, and avatar are stored.

If the user has both an official and preferred name, the preferred is used in the header and the official names are noted in the table. If only a preferred name or official name are found, that will be used in the header and the null alternate name will not be displayed in the table. Similarly, if only one email is given for a user, that is labeled 'email'. However, if the user provides a second notification email, this is added to the table and 'email' is renamed to 'login email' for clarity.

As it is now, the instructor and admin fields on this page are read-only. In the future, it would be a good idea to enable administrators to demote themselves from this screen, or convert themselves into instructors. There is no need to have a separate page for that. It might also be useful to let instructors and admins edit their authoritative first and last names, in addition to their preferred names

Future feature: it would be good to send an email notification to a user when the password is changed (ideally to both emails on file for redundancy) in case the account has been compromised. This would give the real user an opportunity to reset the password before it's too late.

# Login

Automatic login timeout is fully functional for all logins. The attempts field tracks the number of incorrect attempts since the last successful login. Five attempts are allowed without a timeout. On the fifth attempt, a 1 minute timeout is set. Timeouts are set relative to the time of the attempt, rather than the previous timeout (this is by design). Any attempts during a timeout are blocked, but do NOT increment the incorrect attempts counter. This is by design. Attempts are only incremented after the timeout has passed and the password supplied is incorrect. Between 5 and 10 attempts, the timeout ranges from 1 minute 60 minutes.

The 'blocked' field on UserLogin denotes a user that cannot be unblocked without an administrator. There is currently no interface to manage all users at a system level for administrators. This would be an ideal place to manually toggle the blocked flag on accounts. This blocking is separate from the timeout feature. Timeouts automatically expire and users are able to log in without administrator intervention. A blocked user will never be able to get into the system until an administrator manually unblocks the account.

Future fix: the user is not given any feedback on timeout on the login screen. Manually blocked users should not receive any additional feedback (don't let them know they've been blocked, just pretend they entered an incorrect password even if they didn't). However, timeout users should be alerted if a timeout was set, and how long (in minutes). Do not tell the user what will happen if they enter subsequent incorrect passwords. For example, tell a user that they have been timed out for 1 minute, but don't tell them that the next incorrect attempt will trigger a 2 minute timeout. Let them find this out on their own. This is by design. In order to implement this, there needs to be greater state information transferred between the login backend API endpoint and the frontend login interface.

# Passwords

All passwords, including temporary passwords, are hashed with Argon2 and stored in the UserLogin table. The pending flag is used to denote a user with a temporary password. If a user logs in with a temporary password, there needs to be a screen that immediately prompts the user to create a new password before he or she can do anything else in the interface. Then, pending would be set to false when the new password is hashed and stored. All subsequent logins would be normal.

Currently, temporary passwords are generated with Math.random. This is not a cryptographically secure random number generator, so it could be exploited to guess temporary passwords. This should be replaced with a more secure random generation algorithm for temporary passwords.

There was not time to implement an interface to create dummy users. The only distinction between a dummy user and a real user is that when creating the account, the randomly generated password is displayed on screen before being hashed and stored in the database. Additionally, no email notification is sent to the email of the dummy user with the temporary password. Real user accounts are never shown the generated password except in the email that is delivered to them. This could be integrated with the system-level user management interface for administrators.

# Onboarding

There was not time to create the initial startup interface. It should bypass the login screen by first checking for any users in the database. If there are none, the user will be prompted to create an administrator account and an initial organization. It may be possible to delay the creation of the first organization, but currently some parts of the system assume there is a single organization and not having an initial organization may be problematic. If the system was rewritten to not assume a single organization, and account for situations with zero or multiple organizations, then the onboarding interface would require only an administrator account creation form.

# General

Input should be sanitized at a global level, rather than on an API or interface basis. User input should be assumed malicious and should be sanitized at the earliest opportunity possible. In some cases, validation occurs only on the backend or frontend. Validation should ideally be performed on both ends. Frontend validation provides a more usable and responsive interface by alerting a user to errors right after entry. Backend validation is to prevent malicious usage of the API. Whitespace should be stripped from user input globally, as this often causes inconsistencies when users accidentally type spaces that they cannot see.

While some APIs currently require password authentication, ideally, all API endpoints should enforce strict authentication. The only endpoint that should be exposed without authentication is the login endpoint. REST APIs typically make use of HTTP basic authentication (requires TLS) or OAuth tokens to authenticate clients. Authentication should be middleware to the rest of the API, so that it is transparent after the user has authenticated. The API is extremely insecure as it is implemented currently. There should be no access to data of any kind without proper login.

# Legacy Interfaces

The old interfaces for creating courses and sections have been removed from the sidebar, but are still accessible within the system. They are partially broken due to changes in the underlying schema and API, but have not been deleted (in case they need to be referenced at a later date). Likewise the user account page and settings pages have been hidden in favor of the new account page that incorporates both viewing and editing.
