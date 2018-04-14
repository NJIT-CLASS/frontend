import React, { Component } from 'react';
import CollapsableBlock from './collapsable-block';
import UserList from './user-list';
import UserPoolList from './user-pool-list';
import { cloneDeep } from 'lodash';

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
        return (
            <div>
                <p>Replacement users will be picked in the following order:</p>
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
