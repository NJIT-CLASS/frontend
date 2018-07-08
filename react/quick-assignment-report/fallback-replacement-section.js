import React, { Component } from 'react';
import { RadioGroup, Radio } from 'react-radio-group';
import CollapsableBlock from './collapsable-block';
import UserList from './user-list';
import Tooltip from '../shared/tooltip';

// This component renders a form section for choosing a fallback replacement user.
// Used by TaskReallocationForm and AssignmentReallocationForm.
class FallbackReplacementSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const tooltip =
            'The fallback replacement user will be the replacement if none of the users in the pools above satisfy the problem constraints.';
        return (
            <div>
                <div>
                    How should the fallback replacement user be chosen?
                    <Tooltip Text={tooltip} ID="fallback-tooltip" />
                </div>
                <RadioGroup
                    selectedValue={this.props.useDefaultFallback && !this.props.mustSpecifyFallback}
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
