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
import ErrorComponent from './shared/ErrorComponent';
import AssignmentStatusTable from './assignment-status-table/main-container';
import DatabaseMaintenance from './database-maintenance/main-container';
//>>INSERTIMPORT

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
const hasInstructorPrivilege = reactElem.dataset.hasInstructorPrivilege === 'true';
/**
 * Decide which page is displayed currently and render the appropriate component
 */

let componentForCurrentPage = null;
switch (currentPage) {
case 'dashboard-container':
    componentForCurrentPage =<DashboardMain UserID={userId}  __={translationFunction}/>;
    break;
case 'add-user-container':
    componentForCurrentPage = <AddUserContainer userId={userId} userType={userType} __={translationFunction}/>;
    break;

case 'translation-container':
    const translationApp = (
        <ClassPageContainer>
            <TranslationContainer />
        </ClassPageContainer>
    );
    componentForCurrentPage = translationApp;
    break;
case 'template-container':
    const taskId = reactElem.dataset.taskId;
    const isAdmin = reactElem.dataset.isAdmin;
    const visitorId = reactElem.dataset.visitorId;
    componentForCurrentPage =
        <TemplateContainer
            SectionID={sectionId}
            CourseID={courseId}
            UserID={userId}
            TaskID={taskId}
            UserType={userType}
            Admin={isAdmin}
            VisitorID={visitorId}
            __={translationFunction}
        />;
    break;

case 'assignment-editor-container':
    const partialAssignmentId = reactElem.dataset.partialAssignmentId;
    componentForCurrentPage = <AssignmentEditorContainer UserID={userId} 
        CourseID={courseId} 
        AssignmentID={assignmentId} 
        PartialAssignmentID={partialAssignmentId}
        __={translationFunction} />;
    break;

case 'assign-to-section-container':
    componentForCurrentPage = <AssignToSectionContainer UserID={userId} AssignmentID = {assignmentId} CourseID={courseId}  __={translationFunction}/>;
    break;

case 'testing-container':
    componentForCurrentPage =<TestingGroundContainer />;
    break;

case 'assignment-record-container':
    componentForCurrentPage = <QuickAssignmentReport hasInstructorPrivilege={hasInstructorPrivilege} UserID={userId} AssignmentID={assignmentId} __={translationFunction}/>;
    break;

case 'course-section-management':
    componentForCurrentPage = <CourseSectionManagement UserID={userId} __={translationFunction} />;
    break;

case 'account':
    componentForCurrentPage = <AccountManagement UserID={userId}  __={translationFunction} />;
    break;
case 'about':
    componentForCurrentPage = <AboutContainer />;
    break;
case 'forgot-password':
    componentForCurrentPage = <ForgotPasswordContainer />;
    break;
case 'sections':
    componentForCurrentPage = <SectionsContainer  UserID={userId}/>;
    break;
case 'user-grade-report':
    componentForCurrentPage =  <UserGradeReportContainer UserID={userId} AssignmentID={assignmentId} __={translationFunction}/>;
    break;
case 'volunteer-pool':
    componentForCurrentPage = <VolunteerPoolContainer  UserID={userId} CourseID={courseId} SectionID={sectionId} />;
    break;
case 'user-management':
    componentForCurrentPage = <UserManagementContainer UserID={userId} __={translationFunction} />;
    break;
case 'everyones-work':
    componentForCurrentPage = <MainPageContainer UserID={userId} AssignmentID={assignmentId} __={translationFunction}/>;
    break;
case 'reallocation-container':
    componentForCurrentPage = <Reallocation UserID={userId} />;
    break;
case 'section':
    componentForCurrentPage = <SectionPage UserID={userId} SectionID={sectionId} __={translationFunction} />;
    break;
case 'assignment-status-table':
    componentForCurrentPage = <AssignmentStatusTable UserID={userId}  __={translationFunction} />;
    break; 
case 'database-maintenance':
    componentForCurrentPage = <DatabaseMaintenance UserID={userId}  __={translationFunction} />;
    break;    
//>>INSERTCASE


}

// let fullComponentToRender = <ErrorComponent>
//     {componentForCurrentPage}
// </ErrorComponent>;

ReactDOM.render(componentForCurrentPage,reactElem);
