import React from 'react';
import PropTypes from 'prop-types';
//have to go into react-checkbox-list node_module and manually alter checkboxes to match style
class Checkbox extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            Clicked: this.props.isClicked
        };
    }

    // componentDidMount(){
    //   if(this.props.isClicked == true){
    //     this.props.click();
    //   }
    // }
    componentWillReceiveProps(nextProps){
        if(this.state.Clicked != nextProps.isClicked){
            this.setState({Clicked: nextProps.isClicked});
        }
    }

    render(){
        let checkedValue = false;
        let styles = this.props.style ? this.props.style : {};
        if(this.props.isClicked != null){
            checkedValue = this.props.isClicked;
        }
        else{
            checkedValue = this.state.Clicked;
        }

        let className = "checkbox";
        if (checkedValue) {
            className += " checked";
        }
        if (this.props.disabled) {
            className += " disabled";
        }
        return(<div className={className}  style={styles} onClick={(e) => {
            e.preventDefault();
            if (this.props.disabled) {
                return;
            }
            this.setState({
                Clicked: this.state.Clicked ? false: true
            });
            if(this.props.click){
                this.props.click();
            }
        }}>

        </div>);
    }
}

Checkbox.propTypes = {
    click: PropTypes.func,
    isClicked: PropTypes.bool,
    style: PropTypes.object,
};

export default Checkbox;
