/*
This file loads all the React pages. It checks to see which element id is on the page and renders the appropriate Component.
It also gets the data(connected from the page's html and route-handler file) and passes it down as props.
If a new react page is created , it will need to be added here.
*/

import React from 'react';
import request from 'request';
import ReactDOM from 'react-dom';

import AddSectionContainer from './add-section/add-section-container';
import AddUserContainer from './add-user/add-user-container';
import AssignmentContainer from './create-assignment/assignment-container';
import AssignmentEditorContainer from './assignment-editor/assignmentEditorContainer';
import AssignToSectionContainer from './assign-to-section/AssigntoSection';
import ClassPageContainer from './shared/class-page-container';
import CourseContainer from './create-course/course-container';
import TemplateContainer from './task-template/TemplateContainer';
import TranslationContainer from './translation/translation-container';
import TestingGroundContainer from './testing/test';
import TaskStatusTable from './assignment-records/TaskStatus';
import CourseSectionManagement from './course-section-management/container';
import AccountManagement from './account/container';

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

const addsectionContainerEl = document.getElementById('add-section-container');
if (addsectionContainerEl) {
    const userId = addsectionContainerEl.dataset.userId;
    const apiUrl = addsectionContainerEl.dataset.apiUrl;

    ReactDOM.render(<AddSectionContainer userId={userId} apiUrl={apiUrl} />, addsectionContainerEl);
}

const adduserContainerEl = document.getElementById('add-user-container');

if (adduserContainerEl) {
    const userId = adduserContainerEl.dataset.userId;
    const apiUrl = adduserContainerEl.dataset.apiUrl;
    const userType = adduserContainerEl.dataset.userType;

    ReactDOM.render(<AddUserContainer userId={userId} apiUrl={apiUrl} userType={userType} />, adduserContainerEl);
}

const assignmentContainerEl = document.getElementById('create-assignment-container');

if (assignmentContainerEl) {
    ReactDOM.render(<AssignmentContainer />, assignmentContainerEl);
}

const courseContainerEl = document.getElementById('create-course-container'); // get id from .html file

if (courseContainerEl) {
    const userId = courseContainerEl.dataset.userId; // in here variables are camelCase, in html variables are hyphened, -
    const apiUrl = courseContainerEl.dataset.apiUrl;

    ReactDOM.render(<CourseContainer userId={userId} apiUrl={apiUrl} />, courseContainerEl);
}

const translationContainerEl = document.getElementById('translation-container');

if (translationContainerEl) {
    const translationApp = (
      <ClassPageContainer>
        <TranslationContainer />
      </ClassPageContainer>
    );

    ReactDOM.render(translationApp, document.getElementById('translation-container'));
}

const templateContainerEl = document.getElementById('template-container');

if (templateContainerEl) {
    const userId = templateContainerEl.dataset.userId;
    const apiUrl = templateContainerEl.dataset.apiUrl;
    const taskId = templateContainerEl.dataset.taskId;
    const sectionId = templateContainerEl.dataset.sectionId;
    const courseId = templateContainerEl.dataset.courseId;

    ReactDOM.render(
      <TemplateContainer
        SectionID={sectionId}
        CourseID={courseId}
        UserID={userId}
        apiUrl={apiUrl}
        TaskID={taskId}
        translateFunction={translationFunction}
      />, templateContainerEl);
}

const assignmentEditorContainerEl = document.getElementById('assignment-editor-container');

if (assignmentEditorContainerEl) {
    const userId = assignmentEditorContainerEl.dataset.userId;
    const courseId = assignmentEditorContainerEl.dataset.courseId;
    const assignmentId = assignmentEditorContainerEl.dataset.assignmentId;
    const partialAssignmentId = assignmentEditorContainerEl.dataset.partialAssignmentId;
    const apiUrl = assignmentEditorContainerEl.dataset.apiUrl;
    ReactDOM.render(<AssignmentEditorContainer UserID={userId} CourseID={courseId} AssignmentID={assignmentId} PartialAssignmentID={partialAssignmentId} apiUrl={apiUrl} __={translationFunction} />, assignmentEditorContainerEl);
}
const assignToSectionContainerEl = document.getElementById('assign-to-section-container');

if (assignToSectionContainerEl) {
    const userId = assignToSectionContainerEl.dataset.userId;
    const courseId = assignToSectionContainerEl.dataset.courseId;
    const assignmentId = assignToSectionContainerEl.dataset.assignmentId;
    const apiUrl = assignToSectionContainerEl.dataset.apiUrl;

    ReactDOM.render(<AssignToSectionContainer UserID={userId} AssignmentID={assignmentId} CourseID={courseId} apiUrl={apiUrl} />, assignToSectionContainerEl);
}
//
const testingGroundContainerEl = document.getElementById('testing-container');

if (testingGroundContainerEl) {
    ReactDOM.render(<TestingGroundContainer />, testingGroundContainerEl);
}

const assignmentRecordContainer = document.getElementById('assignment-record-container');

if (assignmentRecordContainer) {
    const userId = assignmentRecordContainer.dataset.userId;
    const assignmentId = assignmentRecordContainer.dataset.assignmentId;
    const apiUrl = assignmentRecordContainer.dataset.apiUrl;
    ReactDOM.render(<TaskStatusTable UserID={userId} AssignmentID={assignmentId} apiUrl={apiUrl} />, assignmentRecordContainer);
}

const courseSectionMgmntContainer = document.getElementById('course-section-management');
if (courseSectionMgmntContainer) {
    const userId = courseSectionMgmntContainer.dataset.userId;
    const apiUrl = courseSectionMgmntContainer.dataset.apiUrl;
    ReactDOM.render(<CourseSectionManagement UserID={userId} apiUrl={apiUrl} __={translationFunction} />, courseSectionMgmntContainer);
}

const accountContainer = document.getElementById('account');
if (accountContainer) {
    const userId = accountContainer.dataset.userId;
    const apiUrl = accountContainer.dataset.apiUrl;
    ReactDOM.render(<AccountManagement UserID={userId} apiUrl={apiUrl} __={translationFunction} />, accountContainer);
}
