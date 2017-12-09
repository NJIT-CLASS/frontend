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
import SectionsContainer from './sections/sections-container';
import UserGradeReportContainer from './grade-report/user-grade-report-container';
import VolunteerPoolContainer from './volunteer-pool/volunteer-pool-container';
import UserManagementContainer from './user-management/main-container';
import EveryonesWorkMain from './everyones-work/main-container';
import Reallocation from './reallocation/reallocation-container';
import MainPageContainer from './everyones-work/main-container';
import DashboardMain from './dashboard/main-container';
import SectionPage from './section/main-container';

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
const courseId = reactElem.dataset.courseId;
const assignmentId = reactElem.dataset.assignmentId;
const userType = reactElem.dataset.userType;
const sectionId = reactElem.dataset.sectionId;
/**
 * Decide which page is displayed currently and render the appropriate component
 */
switch (currentPage) {
case 'dashboard-container':
    ReactDOM.render(<DashboardMain UserID={userId}  __={translationFunction}/>,reactElem);
    break;
case 'add-user-container':
    ReactDOM.render(<AddUserContainer userId={userId} userType={userType} __={translationFunction}/>,reactElem);
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
    const isAdmin = reactElem.dataset.isAdmin;
    const visitorId = reactElem.dataset.visitorId;
    ReactDOM.render(
        <TemplateContainer
            SectionID={sectionId}
            CourseID={courseId}
            UserID={userId}
            TaskID={taskId}
            UserType={userType}
            Admin={isAdmin}
            VisitorID={visitorId}
            __={translationFunction}
        />, reactElem);
    break;

case 'assignment-editor-container':
    const partialAssignmentId = reactElem.dataset.partialAssignmentId;
    ReactDOM.render(<AssignmentEditorContainer UserID={userId} CourseID={courseId} AssignmentID={assignmentId} PartialAssignmentID={partialAssignmentId} __={translationFunction} />, reactElem);
    break;

case 'assign-to-section-container':
    ReactDOM.render(<AssignToSectionContainer UserID={userId} AssignmentID = {assignmentId} CourseID={courseId}  __={translationFunction}/>,reactElem);
    break;

case 'testing-container':
    ReactDOM.render(<TestingGroundContainer />, reactElem);
    break;

case 'assignment-record-container':
    ReactDOM.render(<QuickAssignmentReport UserID={userId} AssignmentID={assignmentId} __={translationFunction}/>, reactElem);
    break;

case 'course-section-management':
    ReactDOM.render(<CourseSectionManagement UserID={userId} __={translationFunction} />, reactElem);
    break;

case 'account':
    ReactDOM.render(<AccountManagement UserID={userId}  __={translationFunction} />, reactElem);
    break;
case 'about':
    ReactDOM.render(<AboutContainer />, reactElem);
    break;
case 'forgot-password':
    ReactDOM.render(<ForgotPasswordContainer />, reactElem);
    break;
case 'sections':
    ReactDOM.render(<SectionsContainer  UserID={userId}/>, reactElem);
    break;
case 'user-grade-report':
    ReactDOM.render( <UserGradeReportContainer UserID={userId} AssignmentID={assignmentId} __={translationFunction}/>, reactElem);
    break;
case 'volunteer-pool':
    ReactDOM.render(<VolunteerPoolContainer  UserID={userId} CourseID={courseId} SectionID={sectionId} />, reactElem);
    break;
case 'user-management':
    ReactDOM.render(<UserManagementContainer UserID={userId} __={translationFunction} />, reactElem);
    break;
case 'everyones-work':
    ReactDOM.render(<MainPageContainer UserID={userId} AssignmentID={assignmentId} __={translationFunction}/>, reactElem);
    break;
case 'reallocation-container':
    ReactDOM.render(<Reallocation UserID={userId} />, reactElem);
    break;
case 'section':
    ReactDOM.render(<SectionPage UserID={userId} SectionID={sectionId} __={translationFunction} />, reactElem);
}

