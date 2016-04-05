import React from 'react';
import ReactDOM from 'react-dom';

import CourseContainer from './course-container';

const containerEl = document.getElementById('create-course-container');

const userId = containerEl.dataset.userId;
const apiUrl = containerEl.dataset.apiUrl;

ReactDOM.render(<CourseContainer userId={userId} apiUrl={apiUrl}/>, containerEl);
