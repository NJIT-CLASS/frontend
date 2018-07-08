import React, { Component } from 'react';
import Checkbox from '../shared/checkbox';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cloneDeep } from 'lodash';

// This component renders a list of user pools (passed in as a prop) as a drag-and-drop list.
// Used by ReplacementPoolsSection.
// See the react-beautiful-dnd documentation (https://github.com/atlassian/react-beautiful-dnd).
// A lot of the code here is just boilerplate required by the above library and has no relevance 
// to this application. I commented the important parts.
class UserPoolList extends Component {
    constructor(props) {
        super(props);
    }

    onDragEnd(result) {
        // This function reorders the pools list after one has been dragged and dropped.
        if (!result.destination) {
            // The item was dragged outside of the droppable area, so do nothing.
            return;
        }

        // Make a new copy of the pools list with the new order.
        const startIndex = result.source.index;
        const endIndex = result.destination.index;
        const pools = cloneDeep(this.props.pools);
        const [movedPool] = pools.splice(startIndex, 1);
        pools.splice(endIndex, 0, movedPool);

        // Update the pools list in the parent component.
        this.props.onChange(pools);
    }

    onCheckboxChange(clickedPoolID) {
        // This function toggles a pool's enabled property when it is clicked on.
        const pools = cloneDeep(this.props.pools);
        const clickedPool = pools.find(pool => pool.id === clickedPoolID);
        clickedPool.enabled = !clickedPool.enabled;

        // Update the pools list in the parent component
        this.props.onChange(pools);
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                <Droppable droppableId="user-pool-list">
                    {provided => (
                        <div
                            ref={provided.innerRef}
                            style={{ // These are styles for the background of the list
                                background: '#fff',
                                padding: '8px 8px 0 8px',
                                width: '550px'
                            }}
                        >
                            {this.props.pools.map((pool, index) => (
                                <Draggable
                                    key={pool.id}
                                    draggableId={pool.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div>
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={{
                                                    ...provided.draggableProps.style,
                                                    // Below are styles for the draggable list items (the pools)
                                                    padding: '16px',
                                                    margin: '0 0 8px 0',
                                                    background: '#fff',
                                                    border: '1px solid #bbb'
                                                }}
                                            >
                                                {/* These are the contents of the draggable list items */}
                                                <span className="drag-handle" />
                                                <span className={!pool.enabled ? 'disabled' : null}>
                                                    {pool.displayName}
                                                </span>
                                                <Checkbox
                                                    style={{
                                                        float: 'right',
                                                        margin: '-4px 4px'
                                                    }}
                                                    isClicked={pool.enabled}
                                                    click={() => this.onCheckboxChange(pool.id)}
                                                />
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );
    }
}

export default UserPoolList;
