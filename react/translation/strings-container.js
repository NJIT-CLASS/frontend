import React from 'react';


import StringContainer from './string-container';

class StringsContainer extends React.Component {
    render() {
        // don't show the table until there are strings
        if (Object.keys(this.props.strings).length === 0) {
            return null;
        }

        console.log(this.props.serverStrings);

        const strings = Object.keys(this.props.strings).map((key) => {
            const value = this.props.strings[key];

            return (
                <StringContainer
                    str={key}
                    serverStr={this.props.serverStrings[key]}
                    translation={value}
                    key={key}
                    saveString={this.props.saveString}
                />
            );
        });

        return (
            <div className="section">
                <div className="string-container string-table-header">
                    <div>String</div>
                    <div>Translation</div>
                </div>
                {strings}
            </div>
        );
    }
}

export default StringsContainer;