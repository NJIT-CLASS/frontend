import React from 'react';
import ReactDOM from 'react-dom';

import ClassPageContainer from './shared/class-page-container';

import AssignmentContainer from './create-assignment/assignment-container';
import CourseContainer from './create-course/course-container';
import TranslationContainer from './translation/translation-container';
import TemplateContainer from './task-template/TemplateContainer';
import AssignmentEditorContainer from './assignment-editor/assignmentEditorContainer';

const assignmentContainerEl = document.getElementById('create-assignment-container');

if (assignmentContainerEl) {
    ReactDOM.render(<AssignmentContainer />, assignmentContainerEl);
}

const courseContainerEl = document.getElementById('create-course-container');

if (courseContainerEl) {
    const userId = courseContainerEl.dataset.userId;
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

  ReactDOM.render(<TemplateContainer SectionID={sectionId} UserID={userId} apiUrl={apiUrl} TaskID={taskId} />, templateContainerEl);
}

const assignmentEditorContainerEl = document.getElementById('assignment-editor-container');

if(assignmentEditorContainerEl){
  const userId = assignmentEditorContainerEl.dataset.userId;
  const apiUrl = assignmentEditorContainerEl.dataset.apiUrl;

  ReactDOM.render(<AssignmentEditorContainer UserID={userId} apiUrl={apiUrl}/>,assignmentEditorContainerEl);
}
