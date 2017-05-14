import React from 'react';
import Select from 'react-select';
import {LANGUAGES} from '../../server/utils/react_constants';

class PageHeader extends React.Component {
    changeLanguage(language) {
        this.props.changeLanguage(language);
    }

    render() {
        const languageList = LANGUAGES.map((lang) => {
            return {value:lang.locale, label: lang.language};
        });

        const disableLanguageSwitcher = this.props.areUnsavedChanges ? true : false;
        const buttonUnsavedState = this.props.areUnsavedChanges ? true : false;

        let buttonContent = 'Save';

        if (this.props.saving) {
            buttonContent = <i className="fa fa-circle-o-notch fa-spin"></i>;
        }

        return (
            <div className="page-header">
                <h2>Manage Translations</h2>
                <div className="right-container">
                    <Select
                        name='language'
                        value={this.props.language}
                        options={languageList}
                        clearable={false}
                        searchable={false}
                        onChange={this.changeLanguage.bind(this)}
                        disabled={disableLanguageSwitcher}
                    />
                    <button
                        onClick={this.props.saveChanges}
                        className={buttonUnsavedState ? 'unsaved' : ''}
                    >{buttonContent}</button>
                </div>
            </div>
        );
    }
}

export default PageHeader;
