import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import CollapsableBlock from './collapsable-block';
import UserList from './user-list';

class FallbackReplacementSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <p>How should the fallback replacement user be chosen?</p>
                <RadioGroup
                    selectedValue={
                        this.props.useDefaultFallback && !this.props.mustSpecifyFallback
                    }
                    onChange={this.props.onUseDefaultFallbackChange}
                >
                    <label>
                        <Radio value={true} disabled={this.props.mustSpecifyFallback} />
                        Use any instructor as the fallback replacement
                    </label>
                    <br />
                    <label>
                        <Radio value={false} disabled={this.props.mustSpecifyFallback} />
                        Choose a specific fallback replacement
                    </label>
                </RadioGroup>
                {!this.props.useDefaultFallback || this.props.mustSpecifyFallback ? (
                    <CollapsableBlock Title="Choose a fallback replacement user">
                        <UserList
                            users={this.props.users}
                            selectType="radio"
                            defaultSelection={this.props.fallbackID}
                            onSelectionChange={this.props.onFallbackChange}
                            isDisabled={user => user.selectedForRemoval}
                        />
                    </CollapsableBlock>
                ) : null}
            </div>
        );
    }
}

export default FallbackReplacementSection;
