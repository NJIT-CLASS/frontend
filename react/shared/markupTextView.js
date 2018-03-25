import React from 'react';
import bleach from 'bleach';

class MarkupText extends React.Component {
    constructor(props) {
        super(props);
        this.whitelist = [
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
            'table',
            'carousel',
            
            'span',
            'math',
            'maction',
            'maligngroup',
            'malignmark',
            'menclose',
            'merror',
            'mfenced',
            'mfrac',
            'mglyph',
            'mi',
            'mlablededtr',
            'mlongdiv',
            'mmultiscripts',
            'mn',
            'mo',
            'mover',
            'mpadded',
            'mphantom',
            'mroot',
            'mrow',
            'ms',
            'mscarries',
            'mscarry',
            'msgroup',
            'msline',
            'mspace',
            'msqrt',
            'msrow',
            'mstack',
            'mstyle',
            'msub',
            'msup',
            'msubsup',
            'mtable',
            'mtd',
            'mtext',
            'mtr',
            'munder',
            'munderover',
        ];

        this.options = {
            mode: 'white',
            list: this.whitelist
        };
    }

    componentDidMount() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    }

    componentDidUpdate() {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
    }

    render() {
        return(
            <div className={this.props.classNames} dangerouslySetInnerHTML={{__html: bleach.sanitize(this.props.content, this.options)}}></div>
        );
    }
}

export default MarkupText;
