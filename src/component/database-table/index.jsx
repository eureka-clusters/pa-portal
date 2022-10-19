import React from 'react';
import DataTable from 'react-data-table-component';

export { TableProps, TableProps as IDataTableProps, TableColumn, TableRow, TableStyles, Theme, Themes, ConditionalStyles, ExpanderComponentProps, PaginationComponentProps, PaginationOptions, PaginationServerOptions, ContextMessage, SortOrder, SortFunction, Selector, } from 'react-data-table-component';
// import Checkbox from '@material-ui/core/Checkbox';
// import ArrowDownward from '@material-ui/icons/ArrowDownward';
// const sortIcon = <ArrowDownward />;

const selectProps = {indeterminate: isIndeterminate => isIndeterminate};

const customStyles = {
    header: {
        style: {
            paddingLeft: '0px',
            minHeight: 'unset',
            // minHeight: '56px',
        },
    },
    rows: {
        style: {
            // minHeight: '72px!important', // override the row height
            // minHeight: '172px',
        },
    },
    headCells: {
        style: {
            paddingLeft: '2px', // override the cell padding for head cells
            paddingRight: '2px',
            // minWidth: '80px!important',
        },
    },
    cells: {
        style: {
            paddingLeft: '2px', // override the cell padding for data cells
            paddingRight: '2px',
            // minWidth: '180px',
            // minWidth: '80px!important',
        },
    },
};

const paginationRowsPerPageOptions = [10, 15, 20, 25, 30];

const paginationComponentOptions = {
    selectAllRowsItem: true,  // All in pagination
};

function DataTableBase(props) {
    return (
        <DataTable
            direction="auto"
            responsive
            dense
            highlightOnHover={true}
            selectableRowsComponentProps={selectProps}
            // sortIcon={sortIcon}
            
            noDataComponent="No results"

            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            paginationComponentOptions={paginationComponentOptions}

            customStyles={customStyles}
            {...props}
        />
    );
}

export default DataTableBase;