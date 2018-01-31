import ReactTable from 'react-table';
import React, { Component } from 'react';

export default (props) => {
    return <ReactTable
        defaultPageSize={10}
        className="-striped -highlight"
        resizable={true}
        {...props}
        expanderDefaults= {{
            sortable: true,
            resizable: true,
            filterable: false,
        }}
    />;
};