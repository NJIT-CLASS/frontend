import React, { Component } from 'react';
import CollapsableBlock from './collapsable-block';
import UserList from './user-list';
import UserPoolList from './user-pool-list';
import { cloneDeep } from 'lodash';
import Tooltip from '../shared/tooltip';

class ReplacementPoolsSection extends Component {
    constructor(props) {
        super(props);
    }

    handleSelectedAsReplacementChange(changedUserID) {
        const users = cloneDeep(this.props.users);
        const changedUser = users.find(user => user.id === changedUserID);
        changedUser.selectedAsReplacement = !changedUser.selectedAsReplacement;
        this.props.onUsersChange(users);
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
                {this.props.replacementPools.find(pool => pool.id === 'specific')
                    .enabled ? (
                        <CollapsableBlock Title="Choose specific replacement users">
                            <UserList
                                users={this.props.users}
                                selectType="checkbox"
                                onSelectionChange={changedUserID => this.handleSelectedAsReplacementChange(changedUserID)}
                                isSelected={user => user.selectedAsReplacement}
                                isDisabled={user => user.selectedForRemoval}
                            />
                        </CollapsableBlock>
                    ) : null}
            </div>
        );
    }
}

export default ReplacementPoolsSection;
