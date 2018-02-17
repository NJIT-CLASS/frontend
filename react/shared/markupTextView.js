import React from 'react';
import { Markup } from 'interweave';
import bleach from 'bleach';

const MarkupText = ({content, classNames}) => {
    const whitelist = [
        'a',
        'b',
        'i',
        'em',
        'strong',
        'br',
        'ol',
        'ul',
        'li',
        'quote',
        'p',
        'span',
    ];

    const options = {
        mode: 'white',
        list: whitelist
    };
    // <Markup className={classNames} content={bleach.sanitize(content, options)}/>

    return(
        <div className={classNames} dangerouslySetInnerHTML={{__html: bleach.sanitize(content, options)}}></div>
    );


};

export default MarkupText;
