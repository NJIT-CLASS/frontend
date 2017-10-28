import ReactTable from 'react-table';
import React, { Component } from 'react';

export default ({data, columns, noDataText}) => {
    return <ReactTable
        defaultPageSize={10}
        className="-striped -highlight"
        resizable={true}
        data={data}
        columns={columns}
        noDataText={noDataText}
        expanderDefaults= {{
            sortable: true,
            resizable: true,
            filterable: false,
        }}
    />;
};