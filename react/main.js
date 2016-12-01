/*
This file loads all the React pages. It checks to see which element id is on the page and renders the appropriate Component.
It also gets the data(connected from the page's html and route-handler file) and passes it down as props.
If a new react page is created , it will need to be added here.
*/

import React from 'react';
import ReactDOM from 'react-dom';

import ClassPageContainer from './shared/class-page-container';
import AssignmentContainer from './create-assignment/assignment-container';
import CourseContainer from './create-course/course-container';
import TranslationContainer from './translation/translation-container';
import TemplateContainer from './task-template/TemplateContainer';
import AssignmentEditorContainer from './assignment-editor/assignmentEditorContainer';
import AssignToSectionContainer from './assign-to-section/AssigntoSection';
import TestingGroundContainer from './testing/test';

const assignmentContainerEl = document.getElementById('create-assignment-container');

if (assignmentContainerEl) {
    ReactDOM.render(<AssignmentContainer />, assignmentContainerEl);
}

const courseContainerEl = document.getElementById('create-course-container'); //get id from .html file

if (courseContainerEl) {
    const userId = courseContainerEl.dataset.userId; //in here variables are camelCase, in html variables are hyphened, -
    const apiUrl = courseContainerEl.dataset.apiUrl;

    ReactDOM.render(<CourseContainer userId={userId} apiUrl={apiUrl}/>, courseContainerEl);
}

const translationContainerEl = document.getElementById('translation-container');

if (translationContainerEl) {
    let translationApp = (
        <ClassPageContainer>
            <TranslationContainer/>
        </ClassPageContainer>
    );

    ReactDOM.render(translationApp, document.getElementById('translation-container'));
}

const templateContainerEl = document.getElementById('template-container');

if(templateContainerEl){
  const userId = templateContainerEl.dataset.userId;
  const apiUrl = templateContainerEl.dataset.apiUrl;
  const taskId= templateContainerEl.dataset.taskId;
  const sectionId= templateContainerEl.dataset.sectionId;
  const courseId = templateContainerEl.dataset.courseId;

  ReactDOM.render(<TemplateContainer SectionID={sectionId} CourseID={courseId} UserID={userId} apiUrl={apiUrl} TaskID={taskId} />, templateContainerEl);
}

const assignmentEditorContainerEl = document.getElementById('assignment-editor-container');

if(assignmentEditorContainerEl){
  const userId = assignmentEditorContainerEl.dataset.userId;
  const courseId = assignmentEditorContainerEl.dataset.courseId;
  const apiUrl = assignmentEditorContainerEl.dataset.apiUrl;

  ReactDOM.render(<AssignmentEditorContainer UserID={userId} CourseID={courseId} apiUrl={apiUrl}/>,assignmentEditorContainerEl);
}
const assignToSectionContainerEl = document.getElementById('assign-to-section-container');

if(assignToSectionContainerEl){
  const userId = assignToSectionContainerEl.dataset.userId;
  const courseId = assignToSectionContainerEl.dataset.courseId;
  const assignmentId = assignToSectionContainerEl.dataset.assignmentId;
  const apiUrl = assignToSectionContainerEl.dataset.apiUrl;

  ReactDOM.render(<AssignToSectionContainer UserID={userId} AssignmentID = {assignmentId} CourseID={courseId} apiUrl={apiUrl}/>,assignToSectionContainerEl);
}
//
const testingGroundContainerEl = document.getElementById('testing-container');

if(testingGroundContainerEl){
  ReactDOM.render(<TestingGroundContainer />, testingGroundContainerEl);
}
