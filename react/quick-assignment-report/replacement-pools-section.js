import React, { Component } from 'react';
import CollapsableBlock from './collapsable-block';
import UserList from './user-list';
import UserPoolList from './user-pool-list';
import { cloneDeep } from 'lodash';
import Tooltip from '../shared/tooltip';

// This component renders the part of a form for choosing and reordering replacement user pools.
// Used by AssignmentReallocationForm and TaskReallocationForm.
class ReplacementPoolsSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const tooltip =
            `A replacement user that satisfies the problem constraints will be selected from one of the pools below.
            Click and drag to change the order in which the pools are tried.
            Use the checkboxes to enable and disable pools from being used.`;
        return (
            <div>
                <div>
                    Replacement users will be picked in the following order:
                    <Tooltip Text={tooltip} ID="replacement-pools-tooltip" />
                </div>
                <UserPoolList
                    onChange={this.props.onPoolChange}
                    pools={this.props.replacementPools}
                />
                {/* If the 'Specific Users' pool is enabled, reveal a user list for selecting new 
                    candidate replacement users. */}
                {this.props.replacementPools.find(pool => pool.id === 'specific')
                    .enabled ? (
                        <CollapsableBlock Title="Choose specific replacement users">
                            <UserList
                                users={this.props.users}
                                selectType="checkbox"
                                onSelectionChange={changedUserID => this.handleSelectedAsReplacementChange(changedUserID)}
                                isSelected={user => user.selectedAsReplacement}
                                // Users that are selected for removal cannot also be replacements, so we 
                                // disable their checkboxes/radio buttons to disqualify them from selection
                                isDisabled={user => user.selectedForRemoval}
                            />
                        </CollapsableBlock>
                    ) : null}
            </div>
        );
    }

    handleSelectedAsReplacementChange(changedUserID) {
        // This function toggles a user's selectedAsReplacement property when it is selected/deselected.
        const users = cloneDeep(this.props.users);
        const changedUser = users.find(user => user.id === changedUserID);
        changedUser.selectedAsReplacement = !changedUser.selectedAsReplacement;

        // Update the users list in the parent component.
        this.props.onUsersChange(users);
    }

}

export default ReplacementPoolsSection;
