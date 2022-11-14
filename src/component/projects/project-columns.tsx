import {createColumnHelper} from '@tanstack/react-table'
import {Project} from "interface/project";

const columnHelper = createColumnHelper<Project>()

export const ProjectColumns = [
    columnHelper.accessor('slug', {
        cell: info => info.getValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor(row => row.name, {
        id: 'name',
        cell: info => <i>{info.getValue()}</i>,
        header: () => <span>Name</span>,
        footer: info => info.column.id,
    }),
    columnHelper.accessor('number', {
        header: () => 'Number',
        cell: info => info.renderValue(),
        footer: info => info.column.id,
    }),
    columnHelper.accessor('title', {
        header: () => <span>Title</span>,
        footer: info => info.column.id,
    }),
    columnHelper.accessor('latestVersionTotalCosts', {
        header: 'latestVersionTotalCosts',
        footer: info => info.column.id,
    }),
    columnHelper.accessor('latestVersionTotalEffort', {
        header: 'latestVersionTotalEffort',
        footer: info => info.column.id,
    }),
];
