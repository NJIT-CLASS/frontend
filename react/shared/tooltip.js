import React from 'react';
import ReactTooltip from 'react-tooltip';

const Tooltip = (props) => {
  const {Text, ID, style, multiline} = props;
  return (
    <div style={{ ...style, display: 'inline-block' }}>
      {console.log(Text)}
      <i className="fa fa-info-circle tooltip-icon"  aria-hidden="true" data-tip={Text} data-for={ID}></i>
        <ReactTooltip html={true} className="react-tooltip-custom" id={ID} effect='solid' multiline={multiline} {...props}>

        </ReactTooltip>
    </div>
  )
}

export default Tooltip;
