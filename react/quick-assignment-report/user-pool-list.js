import React, { Component } from 'react';
import Checkbox from '../shared/checkbox';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { cloneDeep } from 'lodash';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
};

class UserPoolList extends Component {
    constructor(props) {
        super(props);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const pools = reorder(
            this.props.pools,
            result.source.index,
            result.destination.index
        );

        this.props.onChange(pools);
    }

    onCheckboxChange(clickedPoolID) {
        const pools = cloneDeep(this.props.pools);
        const clickedPool = pools.find(pool => pool.id === clickedPoolID);
        clickedPool.enabled = !clickedPool.enabled;
        this.props.onChange(pools);
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
                <Droppable droppableId="user-pool-list">
                    {provided => (
                        <div
                            ref={provided.innerRef}
                            style={{
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
                                                    padding: '16px',
                                                    margin: '0 0 8px 0',
                                                    background: '#fff',
                                                    border: '1px solid #bbb'
                                                }}
                                            >
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
