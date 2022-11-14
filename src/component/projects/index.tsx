import {useState} from "react";
import {QueryClient} from 'react-query'
import {createColumnHelper, flexRender, getCoreRowModel, useReactTable} from '@tanstack/react-table'
import {Project} from "interface/project";
import {useProject} from "hooks/api/project/use-project";


const queryClient = new QueryClient()

// Then, use it in a component.
export default function Projects() {

    const {project, isLoading} = useProject('aissi');
    // const {project, isLoading2} = useProject('aidems');

    const defaultData = [project];
    const [data, setData] = useState(() => [...defaultData])


    console.log(data);

    return <div>Test</div>;


    // const columnHelper = createColumnHelper<Project>()
    //
    // const ProjectColumns = [
    //     columnHelper.accessor('slug', {
    //         cell: info => info.getValue(),
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor(row => row.name, {
    //         id: 'name',
    //         cell: info => <i>{info.getValue()}</i>,
    //         header: () => <span>Name</span>,
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('number', {
    //         header: () => 'Number',
    //         cell: info => info.renderValue(),
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('title', {
    //         header: () => <span>Title</span>,
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('latestVersionTotalCosts', {
    //         header: 'latestVersionTotalCosts',
    //         footer: info => info.column.id,
    //     }),
    //     columnHelper.accessor('latestVersionTotalEffort', {
    //         header: 'latestVersionTotalEffort',
    //         footer: info => info.column.id,
    //     }),
    // ];
    //
    //
    // const table = useReactTable({
    //     data,
    //     ProjectColumns,
    //     getCoreRowModel: getCoreRowModel(),
    // })
    //
    // return (
    //     <table>
    //         <thead>
    //         {table.getHeaderGroups().map(headerGroup => (
    //             <tr key={headerGroup.id}>
    //                 {headerGroup.headers.map(header => (
    //                     <th key={header.id}>
    //                         {header.isPlaceholder
    //                             ? null
    //                             : flexRender(
    //                                 header.column.columnDef.header,
    //                                 header.getContext()
    //                             )}
    //                     </th>
    //                 ))}
    //             </tr>
    //         ))}
    //         </thead>
    //         <tbody>
    //         {table.getRowModel().rows.map(row => (
    //             <tr key={row.id}>
    //                 {row.getVisibleCells().map(cell => (
    //                     <td key={cell.id}>
    //                         {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //                     </td>
    //                 ))}
    //             </tr>
    //         ))}
    //         </tbody>
    //         <tfoot>
    //         {table.getFooterGroups().map(footerGroup => (
    //             <tr key={footerGroup.id}>
    //                 {footerGroup.headers.map(header => (
    //                     <th key={header.id}>
    //                         {header.isPlaceholder
    //                             ? null
    //                             : flexRender(
    //                                 header.column.columnDef.footer,
    //                                 header.getContext()
    //                             )}
    //                     </th>
    //                 ))}
    //             </tr>
    //         ))}
    //         </tfoot>
    //     </table>
    // )

}
