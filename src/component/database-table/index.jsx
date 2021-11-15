import React from 'react';
import DataTable, { defaultThemes } from 'react-data-table-component';

// import Checkbox from '@material-ui/core/Checkbox';
// import ArrowDownward from '@material-ui/icons/ArrowDownward';
// const sortIcon = <ArrowDownward />;

const selectProps = { indeterminate: isIndeterminate => isIndeterminate };

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

const InlineTableStyle = {
    header: {
        style: {
            paddingLeft: '0px',
            minHeight: 'unset',
            // minHeight: '56px',
        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: defaultThemes.default.divider.default,
        },
    },
    headCells: {
        style: {
            paddingLeft: '2px', // override the cell padding for head cells
            paddingRight: '2px',

            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
    cells: {
        style: {
            paddingLeft: '2px', // override the cell padding for data cells
            paddingRight: '2px',

            '&:not(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,

            },
        },
    },
    rows: {
        style: {
            // backgroundColor: 'rgba(63, 195, 128, 0.9)',
            '&:is(:last-of-type)': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: defaultThemes.default.divider.default,
            },
        },
    },
};



const gridStyle = {
    header: {
        style: {
            paddingLeft: '0px',
            minHeight: 'unset',
            // minHeight: '56px',
        },
    },
    headRow: {
        style: {
            borderTopStyle: 'solid',
            borderTopWidth: '1px',
            borderTopColor: defaultThemes.default.divider.default,
        },
    },
    headCells: {
        style: {
            paddingLeft: '2px', // override the cell padding for head cells
            paddingRight: '2px',

            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderLeftColor: defaultThemes.default.divider.default,
            '&:is(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
    cells: {
        style: {
            paddingLeft: '2px', // override the cell padding for data cells
            paddingRight: '2px',

            borderLeftStyle: 'solid',
            borderLeftWidth: '1px',
            borderLeftColor: defaultThemes.default.divider.default,
            
            '&:is(:last-of-type)': {
                borderRightStyle: 'solid',
                borderRightWidth: '1px',
                borderRightColor: defaultThemes.default.divider.default,
            },
        },
    },
    rows: {
        style: {
            // backgroundColor: 'rgba(63, 195, 128, 0.9)',
            '&:is(:last-of-type)': {
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: defaultThemes.default.divider.default,
            },
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
            // striped={true}
            highlightOnHover={true}
            // selectableRowsComponent={Checkbox}
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