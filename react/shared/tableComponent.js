import ReactTable from 'react-table';
import React, { Component } from 'react';
import { useTable, useExpanded } from 'react-table'

// use block layout for the table
export default (props) => {
    return <ReactTable
        defaultPageSize={10}
        className="-striped -highlight"
        resizable={true}
        {...props}
        layout="block"
        expanderDefaults= {{
            sortable: true,
            resizable: true,
            filterable: false,
        }}
    />;
};