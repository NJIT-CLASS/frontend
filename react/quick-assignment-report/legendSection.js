import React from 'react';

const LegendSection = ({Strings}) => {
    const colors = { Incomplete: 'incomplete',
        complete: 'complete',
        Late: 'late',
        'Not Needed': 'not-needed',
        not_yet_started: 'not-yet-started',
        started: 'started',
        bypassed:'bypassed',
        automatic: 'automatic',
    };

    const letters = {
        Incomplete: '(I)',
        complete: '(C)',
        Late: '(!)',
        'Not Needed': '(X)',
        not_yet_started: '(NS)',
        started: '(S)',
        bypassed: '(B)',
        automatic: '(A)',
    };

    const statusToString = {
        Incomplete: 'Incomplete',
        complete: 'Complete',
        Late: 'Late',
        'Not Needed': 'NotNeeded',
        not_yet_started: 'NotYetStarted',
        started: 'Started',
        bypassed: 'Bypassed',
        automatic: 'Automatic',
    };

    let statusArray =  ['Incomplete',
        'complete',
        'Late',
        'Not Needed',
        'not_yet_started',
        'started',
        'bypassed',
        'automatic'].map((status) => {
            return <div className={`legend-block ${colors[status]}`}>{Strings[statusToString[status]]} {letters[status]}</div>;
        });

    return <div className="legend-table">
      {statusArray}
    </div>;


};

export default LegendSection;
