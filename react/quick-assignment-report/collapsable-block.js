import React, { Component } from 'react';

class CollapsableBlock extends Component {
    constructor(props) {
        super(props);
        this.state = { showContent: false };
    }

    toggleContent() {
        this.setState(prevState => ({ showContent: !prevState.showContent }));
    }

    render() {
        let titleClass = 'title collapsible-header';
        let arrowClass =
            'fa' + (this.state.showContent ? ' fa-angle-up' : ' fa-angle-down');

        let content = (
            <div className="section-content">{this.props.children}</div>
        );

        return (
            <div className="section card-2">
                <div>
                    <h2
                        className={titleClass}
                        onClick={this.toggleContent.bind(this)}
                    >
                        {this.props.Title}
                        <span
                            className={arrowClass}
                            style={{ float: 'right' }}
                        />
                    </h2>
                </div>
                {this.state.showContent ? content : null}
            </div>
        );
    }
}

export default CollapsableBlock;
