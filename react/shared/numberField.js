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
     console.log("dcrease")
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


   render(){
     return(<div className="input-group">
     <span className="input-group-btn">
         <button type="button" className="btn" onMouseDown={(e) => {
             e.preventDefault();
             e.persist();
             this.decrementVal(e);
           this._timer = setInterval(() => {
               this.decrementVal(e);
           }, 200);
           return;
         }} onMouseUp={(e)=>{
             if(this._timer)
              clearInterval(this._timer);}} >
           <i aria-hidden="true">  -  </i>
         </button>
     </span>
     <input placeholder={"max. " + this.props.max} type="text" pattern="[0-9]" onChange={this.onTextChange.bind(this)} value={this.state.Value} min={this.props.min} max={this.props.max} />
     <span className="input-group-btn">
         <button type="button" className="btn" data-type="plus" onMouseDown={(e) => {
             e.preventDefault();
             e.persist();
             this.incrementVal(e);
           this._timer = setInterval(() => {
               this.incrementVal(e);
           }, 200);
           return;
         }}  onMouseUp={(e)=>{
             if(this._timer)
              clearInterval(this._timer);}}>
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
  };

 export default NumberField;
