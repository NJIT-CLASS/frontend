import React from 'react';
import { Markup } from 'interweave';
import bleach from 'bleach';

const MarkupText = ({content, classNames}) => {
    const whitelist = [
        'a',
        'b',
        'i',
        'em',
        'strong'
    ];

    const options = {
        mode: 'white',
        list: whitelist
    };

    return(
    <Markup className='regular-text' content={bleach.sanitize(content, options)}/>
    );


};

export default MarkupText;
