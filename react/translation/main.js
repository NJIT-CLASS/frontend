import React from 'react';
import ReactDOM from 'react-dom';

import ClassPageContainer from '../shared/class-page-container';
import TranslationContainer from './translation-container';

let app = (
    <ClassPageContainer>
        <TranslationContainer/>
    </ClassPageContainer>
);

ReactDOM.render(app, document.getElementById('translation-container'));
