import React from 'react';
import ReactTooltip from 'react-tooltip';

const Tooltip = ({Text, ID}) => {
    return (
        <div style={{display: 'inline-block'}}>
            <i className="fa fa-info-circle tooltip-icon"  aria-hidden="true" data-tip={Text} data-for={ID}></i>
            <ReactTooltip id={ID} effect='solid'/>
        </div>
    )
}

export default Tooltip;