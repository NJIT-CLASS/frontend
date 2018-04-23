import { RadioGroup, Radio } from 'react-radio-group';
import React, { Component } from 'react';

class ExtraCreditSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p> Replacement users receive: </p>
                <RadioGroup
                    selectedValue={this.props.extraCredit}
                    onChange={this.props.onChange}
                >
                    <label>
                        <Radio value={true} /> Extra credit
                    </label>
                    <br />
                    <label>
                        <Radio value={false} /> No extra credit
                    </label>
                </RadioGroup>
            </div>
        );
    }
}

export default ExtraCreditSection;
