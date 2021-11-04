import React from 'react';
import DataTable from 'react-data-table-component';

// import Checkbox from '@material-ui/core/Checkbox';
// import ArrowDownward from '@material-ui/icons/ArrowDownward';
// const sortIcon = <ArrowDownward />;

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

const customStyles = {
    rows: {
        style: {
            // minHeight: '72px!important', // override the row height
            minHeight: '172px',
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

const paginationRowsPerPageOptions = [2, 10, 15, 20, 25, 30];

function DataTableBase(props) {
    return (
        <DataTable
            pagination
            responsive
            direction="auto"
            striped={true}
            highlightOnHover={true}
            // selectableRowsComponent={Checkbox}
            selectableRowsComponentProps={selectProps}
            // sortIcon={sortIcon}
            dense
            noDataComponent="No results"
            paginationPerPage={10}
            paginationRowsPerPageOptions={paginationRowsPerPageOptions}
            customStyles={customStyles}
            {...props}
        />
    );
}

export default DataTableBase;