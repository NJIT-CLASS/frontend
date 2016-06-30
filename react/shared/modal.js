import React from 'react';

class Modal extends React.Component {
    render() {
        let styles = {};
        if(this.props.styles){
          styles=this.props.styles;
        }

        if (this.props.width) {
            styles.width = this.props.width;
        }

        return (
            <div className="modal-overlay">
                <div className="modal-overlay-container">
                    <div className="modal" style={ styles }>
                        <div className="modal-header">
                            <div>{ this.props.title }</div>
                            <i className="close-icon" onClick={this.props.close}>&times;</i>
                        </div>
                        <div className="modal-content">
                            { this.props.children }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
