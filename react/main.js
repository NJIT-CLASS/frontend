/*
This file loads all the React pages. It checks to see which element id is on the page and renders the appropriate Component.
It also gets the data(connected from the page's html and route-handler file) and passes it down as props.
If a new react page is created , it will need to be added here.
*/

import React from 'react';
import request from 'request';
import ReactDOM from 'react-dom';

import AddUserContainer from './add-user/add-user-container';
import AssignmentEditorContainer from './assignment-editor/assignmentEditorContainer';
import AssignToSectionContainer from './assign-to-section/AssigntoSection';
import ClassPageContainer from './shared/class-page-container';
import TemplateContainer from './task-template/TemplateContainer';
import TranslationContainer from './translation/translation-container';
import TestingGroundContainer from './testing/test';
import TaskStatusTable from './assignment-records/TaskStatus';
import CourseSectionManagement from './course-section-management/container';
import AccountManagement from './account/container';
import QuickAssignmentReport from './quick-assignment-report/main-container';
import AboutContainer from './about/about-container';
import ForgotPasswordContainer from './forgot-password/forgot-password-container';

const translationFunction = (objOfStrings, cb) => {
    const options = {
        method: 'POST',
        body: {
            string: objOfStrings,
        },
        uri: `${window.location.protocol}//${window.location.host}/api/getTranslatedString`,
        json: true,
    };

    return request(options, (err, res, body) => {
        cb(body);
    });
};

const reactElem = document.getElementById('react-page'); //get the react DOM element decalred in the server/views

const currentPage = reactElem.dataset.page;     // get some variables that are used in several pages
const userId = reactElem.dataset.userId;
const apiUrl = reactElem.dataset.apiUrl;
const courseId = reactElem.dataset.courseId;
const assignmentId = reactElem.dataset.assignmentId;
const userType = reactElem.dataset.userType;
/**
 * Decide which page is displayed currently and render the appropriate component
 */
switch (currentPage) {
case 'add-user-container':
    ReactDOM.render(<AddUserContainer userId={userId} apiUrl={apiUrl} userType={userType} __={translationFunction}/>,reactElem);
    break;

case 'translation-container':
    const translationApp = (
      <ClassPageContainer>
        <TranslationContainer />
      </ClassPageContainer>
    );
    ReactDOM.render(translationApp, reactElem);
    break;

case 'template-container':
    const taskId = reactElem.dataset.taskId;
    const sectionId = reactElem.dataset.sectionId;
    const isAdmin = reactElem.dataset.isAdmin;
    ReactDOM.render(
      <TemplateContainer
        SectionID={sectionId}
        CourseID={courseId}
        UserID={userId}
        apiUrl={apiUrl}
        TaskID={taskId}
        UserType={userType}
        Admin={isAdmin}
        __={translationFunction}
      />, reactElem);
    break;

case 'assignment-editor-container':
    const partialAssignmentId = reactElem.dataset.partialAssignmentId;
    ReactDOM.render(<AssignmentEditorContainer UserID={userId} CourseID={courseId} AssignmentID={assignmentId} PartialAssignmentID={partialAssignmentId} apiUrl={apiUrl} __={translationFunction} />, reactElem);
    break;

case 'assign-to-section-container':
    ReactDOM.render(<AssignToSectionContainer UserID={userId} AssignmentID = {assignmentId} CourseID={courseId} apiUrl={apiUrl} __={translationFunction}/>,reactElem);
    break;

case 'testing-container':
    ReactDOM.render(<TestingGroundContainer />, reactElem);
    break;

case 'assignment-record-container':
    ReactDOM.render(<QuickAssignmentReport UserID={userId} AssignmentID={assignmentId} apiUrl={apiUrl} __={translationFunction}/>, reactElem);
    break;

case 'course-section-management':
    ReactDOM.render(<CourseSectionManagement UserID={userId} apiUrl={apiUrl} __={translationFunction} />, reactElem);
    break;

case 'account':
    ReactDOM.render(<AccountManagement UserID={userId} apiUrl={apiUrl} __={translationFunction} />, reactElem);
    break;
case 'about':
    ReactDOM.render(<AboutContainer />, reactElem);
    break;
case 'forgot-password':
    ReactDOM.render(<ForgotPasswordContainer />, reactElem);
    break;
}
