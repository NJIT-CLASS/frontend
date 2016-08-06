/* This component is used for the numeric fields. Was using 'react-numeric-input'
  but not compatible.
*/

import React from 'react';

 class NumberField extends React.Component {

   constructor(props) {
     super(props)
      this.state = {
        Value:this.props.value
      }
   }
   //this.props.onChange
    //min
    //max
    //value
    //props speed in milliseconds
    //

   onValChange(value){
     if(!isNaN(value)){
       let inputValue = parseInt(value);
       if(inputValue >= this.props.min && inputValue <= this.props.max){
         this.setState({
           Value: inputValue
         });
         this.props.onChange(inputValue);
       }
       else{
         return;
       }
     }
     else{
       return;
     }
   }

   onTextChange(e){
     if(e.target.value === '' || e.target.value === ' '){
       this.onValChange(this.props.min);
       this.setState({
         Value: ''
       });
       return;
     }
     this.onValChange(e.target.value);

   }

   decrementVal(e){

     e.preventDefault();
     if(this.state.Value == ''){
       this.onValChange((this.props.min));
     }
     else{
       this.onValChange((--this.state.Value));
    }

   }

   incrementVal(e){
     e.preventDefault();
     if(this.state.Value == ''){
       this.onValChange((this.props.min));
     }
     else{
       this.onValChange((++this.state.Value));
    }
   }

   decrementButtonDown(e){
     this.refs['input'].blur();
      clearInterval(this.timer);
       e.preventDefault();
       e.persist();
       this.decrementVal(e);
       this.timer = setInterval(() => {
           this.decrementVal(e);
       }, this.props.speed);
       return;
   }
   decrementButtonUp(e){
     e.preventDefault();
       if(this.timer)
        clearInterval(this.timer);
      }

   incrementButtonDown(e){
     this.refs['input'].blur();
     clearInterval(this.timer);
      e.preventDefault();
      e.persist();
      this.incrementVal(e);
       this.timer = setInterval(() =>{
           this.incrementVal(e);
       }, this.props.speed);
       return;
   }
   incrementButtonUp(e){

     e.preventDefault();
       if(this.timer)
        clearInterval(this.timer);
      }


   render(){
     return(<div className="input-group">
     <span className="input-group-btn">
         <button type="button" className="btn"
          onMouseDown={this.decrementButtonDown.bind(this)}
          onMouseUp={this.decrementButtonUp.bind(this)}
          onTouchEnd={this.decrementButtonUp.bind(this)}
           >
           <i aria-hidden="true">  -  </i>
         </button>
     </span>
     <input ref="input" placeholder={"max. " + this.props.max} type="number" pattern="[0-9]*" onChange={this.onTextChange.bind(this)} value={this.state.Value} min={this.props.min} max={this.props.max} />
     <span className="input-group-btn">
         <button type="button" className="btn" data-type="plus"
         onMouseDown={this.incrementButtonDown.bind(this)}
         onMouseUp={this.incrementButtonUp.bind(this)}
         onTouchEnd={this.incrementButtonUp.bind(this)}
         >
             <i aria-hidden="true"> + </i>
         </button>
     </span>
 </div>
   );
   }
 }

 NumberField.defaultProps = {
      value: 1,
      min: -200,
      max: 200,
      speed: 80
  };

 export default NumberField;
