/* This component is used for the numeric fields. Was using 'react-numeric-input'
  but not compatible.
*/

import React from 'react';
import NumericInput from 'react-numeric-input';


class NumberField extends React.Component {

    constructor(props) {
        super(props);
    }
    // PROPS:
    //onChange
    // allowDecimals
    //min
    //max
    //value
    // step
    //speed (in milliseconds)
    //

    onValChange(value){
        if(!isNaN(value)){
            let inputValue = value;
            if(inputValue < this.props.min){
                this.props.onChange(this.props.min);
            } else if ( inputValue > this.props.max){
                this.props.onChange(this.props.max);
            }
            else{
                this.props.onChange(value);
            }
        }
        else{
            this.props.onChange(this.props.min);
        }
    }


    customLabelFormat(val){
        if(this.props.label == ''){
            return val;
        }
        else{
            return val + ' ' + this.props.label;
        }
    }

    /*
<span className="input-group-btn">
    <button type="button" className="btn"
     onMouseDown={this.decrementButtonDown.bind(this)}
     onMouseUp={this.decrementButtonUp.bind(this)}
     onMouseLeave={this.decrementButtonUp.bind(this)}
     onMouseOut={this.decrementButtonUp.bind(this)}
     onTouchEnd={this.decrementButtonUp.bind(this)}
      >
      <i aria-hidden="true">  -  </i>
    </button>
</span>
<input ref="input" placeholder={"max. " + this.props.max} type="text" pattern="[0-9.]*" onChange={this.onTextChange.bind(this)} value={inputShown} min={this.props.min} max={this.props.max} />
<span className="input-group-btn">
    <button type="button" className="btn" data-type="plus"
    onMouseDown={this.incrementButtonDown.bind(this)}
    onMouseUp={this.incrementButtonUp.bind(this)}
    onMouseLeave={this.incrementButtonUp.bind(this)}
    onMouseOut={this.incrementButtonUp.bind(this)}
    onTouchEnd={this.incrementButtonUp.bind(this)}
    >
        <i aria-hidden="true"> + </i>
    </button>
</span>
*/
    render(){
        const style = {

            // The wrapper (span)
            wrap: {
                position: 'relative',
                display : 'inline-block',
                width: '100%',
                margin: '0 auto'
            },

            'wrap.hasFormControl': {
                display : 'block'
            },

            // The vertical segment of the plus sign (for mobile only)
            plus: {
                position   : 'absolute',
                top        : '50%',
                left       : '50%',
                width      : 2,
                height     : 10,
                background : 'rgba(0,0,0,.7)',
                margin     : '-5px 0 0 -1px'
            },

            // The horizontal segment of the plus/minus signs (for mobile only)
            minus: {
                position   : 'absolute',
                top        : '50%',
                left       : '50%',
                width      : 10,
                height     : 2,
                background : 'rgba(0,0,0,.7)',
                margin     : '-1px 0 0 -5px'
            },

            // Common styles for the up/down buttons (b)
            btn: {
                position   : 'absolute',
                right      : 0,
                width      : '30px',
                borderColor: 'rgba(0,0,0,.1)',
                borderStyle: 'solid',
                textAlign  : 'center',
                cursor     : 'default',
                transition : 'all 0.1s',
                background : 'rgba(0,0,0,.1)',
                boxShadow  : `-1px -1px 3px rgba(0,0,0,.1) inset,
                 1px 1px 3px rgba(255,255,255,.7) inset`
            },

            btnUp: {
                top         : 2,
                bottom      : '50%',
                borderRadius: '2px 2px 0 0',
                borderWidth : '1px 1px 0 1px'
            },

            'btnUp.mobile': {
                width        : '3.3ex',
                marginTop   : '8px',
                height       : '34px',
                bottom       : 2,
                boxShadow    : 'none',
                borderRadius : 2,
                borderWidth  : 1
            },

            btnDown: {
                top         : '50%',
                bottom      : 2,
                borderRadius: '0 0 2px 2px',
                borderWidth : '0 1px 1px 1px'
            },

            'btnDown.mobile': {
                width        : '3.3ex',
                marginTop   : '8px',
                height       : '34px',
                bottom       : 2,
                left         : 0,
                top          : 2,
                right        : 'auto',
                boxShadow    : 'none',
                borderRadius : 2,
                borderWidth  : 1
            },

            'btn:hover': {
                background: 'rgba(0,0,0,.2)'
            },

            'btn:active': {
                background: 'rgba(0,0,0,.3)',
                boxShadow : `0 1px 3px rgba(0,0,0,.2) inset,
                 -1px -1px 4px rgba(255,255,255,.5) inset`
            },

            'btn:disabled': {
                opacity: 0.5,
                boxShadow: 'none',
                cursor: 'not-allowed'
            },

            // The input (input[type="text"])
            input: {
                paddingRight: '3ex',
                boxSizing   : 'border-box'
            },

            // The input with bootstrap class
            'input:not(.form-control)': {
                border           : '1px solid #ccc',
                borderRadius     : 2,
                paddingLeft      : 4,
                display          : 'block',
                WebkitAppearance : 'none',
                lineHeight       : 'normal'
            },

            'input.mobile': {
                paddingLeft :' 3.4ex',
                paddingRight: '3.4ex',
                textAlign   : 'center'
            },

            'input:focus': {},

            'input:disabled': {
                color     : 'rgba(0, 0, 0, 0.3)',
                textShadow: '0 1px 0 rgba(255, 255, 255, 0.8)'
            }
        };
        return(
            <div className="input-group">
                <NumericInput style={style} min={this.props.min} max={this.props.max} value={this.props.value}  onChange={this.onValChange.bind(this)} format={this.customLabelFormat.bind(this)} mobile={true}/>

            </div>
        );
    }
}

NumberField.defaultProps = {
    value: 1,
    min: -200,
    max: 200,
    speed: 250,
    step: 1,
    allowDecimals: false,
    label: ''
};

export default NumberField;
