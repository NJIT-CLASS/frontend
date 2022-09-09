import React from 'react';
import Tooltip from '../shared/tooltip';

export function headerWithTooltip(header, tooltip) {

    const APPROX_LINE_LENGTH = 20;

    let breakPositions = [];
    let charArrTooltip = tooltip.split('');
    // iterate over each character in tooltip
    for (let i = 0, j = 0; i < tooltip.length; i++) {
        if (i / APPROX_LINE_LENGTH >= j + 1 && tooltip[i] == ' ') {
            breakPositions.push(i);
            j = i / APPROX_LINE_LENGTH;
        }

    }

    for (let i = 0; i < breakPositions.length; i++) {
        let index = breakPositions[i];
        charArrTooltip[index] = '<br />';
    }

    let brokenTooltip = charArrTooltip.join('');
    console.log('brokenTooltip: ', brokenTooltip);

    return (
        <span>
            {header}
            <Tooltip
                ID={header}
                // style={{ float: 'bottom' }}
                // multiline={true}
                Text={brokenTooltip}
            />
        </span>
    );
}

export function titleWithTooltip(header, tooltip) {
    return (
        <div>
            <h2 className="title">{header}</h2>
            <Tooltip
                // multiline={true}
                ID={header}
                Text={tooltip}
            />
        </div>
    );
}




