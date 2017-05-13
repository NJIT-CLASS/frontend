import React from 'react';
import PropTypes from 'prop-types';

class ClassPageContainer extends React.Component {
    constructor() {
        super(...arguments);
    }

    getChildContext() {
        const appContainerEl = document.getElementById('app-container');
        const appDataAttributes = appContainerEl.dataset;

        return {
            backendApiUrl: appDataAttributes.apiUrl,
            frontendApiUrl: `${window.location.protocol}//${window.location.host}`
        };
    }

    render() {
        return this.props.children;
    }
}

ClassPageContainer.childContextTypes = {
    backendApiUrl: PropTypes.string,
    frontendApiUrl: PropTypes.string
};

export default ClassPageContainer;
