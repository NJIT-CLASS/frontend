import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';


export default class SelectReallocation extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    selectReallocate(val){
        this.setState({
            selected:val
        });
    }

    render(){
        let items = [
            {value: 'manual', label: 'Manual'},
            {value: 'reallocate', label: 'Reallocate'}
        ];

        return (
            <div>
                <Select options={items} value={this.state.selected} onChange={this.selectReallocate.bind(this)} placeholder="Selected"/>
            </div>
        );
    }
};