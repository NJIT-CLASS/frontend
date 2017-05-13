import React from 'react';
import request from 'request';
import {clone} from 'lodash';
import PropTypes from 'prop-types';

import StringsContainer from './strings-container';
import PageHeader from './page-header';

class TranslationContainer extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            strings: {},
            language: 'es',
            serverStrings: {},
            saving: false
        };
    }

    componentWillMount() {
        this.getStrings(this.state.language);
    }

    getStrings(language) {
        const options = {
            method: 'GET',
            uri: `${this.context.frontendApiUrl}/api/translations`,
            qs: {
                lang: language
            },
            json: true
        };

        request(options, (err, res, body) => {
            this.setState({
                strings: clone(body),
                serverStrings: clone(body)
            });
        });
    }

    saveString(str, translation) {
        if (str in this.state.strings) {
            let newStrings = this.state.strings;
            newStrings[str] = translation;

            this.setState({strings: newStrings});
        }
    }

    stringDiffsFromServer() {
        let differentStrings = {};

        for(let str in this.state.strings) {
            if (this.state.strings[str] !== this.state.serverStrings[str]) {
                differentStrings[str] = this.state.strings[str];
            }
        }

        return differentStrings;
    }

    saveChanges() {
        this.setState({saving: true});
        let strs = this.stringDiffsFromServer();

        const options = {
            method: 'POST',
            uri: `${this.context.frontendApiUrl}/api/translations`,
            body: {
                language: this.state.language,
                strs: strs
            },
            json: true
        };

        request(options, (err, result) => {
            this.setState({
                serverStrings: clone(this.state.strings),
                saving: false
            });
        });
    }

    changeLanguage(language) {
        this.setState({
            language: language.value,
            strings: {}
        });
        this.getStrings(language.value);
    }

    areUnsavedChanges() {
        if (Object.keys(this.stringDiffsFromServer()).length > 0) {
            return true;
        }

        return false;
    }

    render() {
        return (
            <div className="translation-container">
                <PageHeader
                    language={this.state.language}
                    saveChanges={this.saveChanges.bind(this)}
                    changeLanguage={this.changeLanguage.bind(this)}
                    areUnsavedChanges={this.areUnsavedChanges()}
                    saving={this.state.saving}
                />
                <div className="container">
                    <StringsContainer
                        strings={this.state.strings}
                        serverStrings={this.state.serverStrings}
                        saveString={this.saveString.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

TranslationContainer.contextTypes = {
    backendApiUrl: PropTypes.string,
    frontendApiUrl: PropTypes.string
};

export default TranslationContainer;
