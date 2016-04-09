import React from 'react';

class StringContainer extends React.Component {
    saveString(e) {
        this.props.saveString(this.props.str, e.target.value);
    }

    render() {
        let classes = ['string-container'];
        if (this.props.translation !== this.props.serverStr) {
            classes.push('unsaved');
        }

        return (
            <div className={classes.join(' ')}>
                <div>{this.props.str}</div>
                <div>
                    <textarea
                        value={this.props.translation}
                        onChange={this.saveString.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default StringContainer;