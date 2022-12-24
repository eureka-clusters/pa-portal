import { useGetProjects } from 'hooks/project/use-get-projects';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import BreadcrumbTree from 'component/partial/breadcrumb-tree';
import { QueryClient } from 'react-query'
import { useQuery } from 'functions/filter-functions';
import { Project } from 'interface/project';
import SortableTableHeader from 'component/partial/sortable-table-header';


const queryClient = new QueryClient()

// Then, use it in a component.
export default function Projects() {

    const filterOptions = useQuery();

    const { state, setLocalFilterOptions } = useGetProjects({ filterOptions });

    useEffect(() => {
        setLocalFilterOptions(filterOptions);
    }, [filterOptions]);

    if (state.isLoading) {
        return <p>Loading projects...</p>;
    }

    return (
        <React.Fragment>
            <BreadcrumbTree current="projects" data={state.data} linkCurrent={false} />

            <h1>Projects</h1>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th><SortableTableHeader sort='name' filterOptions={filterOptions} >Project</SortableTableHeader></th>
                        <th><SortableTableHeader sort='primary_cluster' filterOptions={filterOptions} >Primary Cluster</SortableTableHeader></th>
                        <th><SortableTableHeader sort='secondary_cluster' filterOptions={filterOptions} >Secondary Cluster</SortableTableHeader></th>
                    </tr>
                </thead>
                <tbody>
                    {state.data._embedded.projects.map(
                        (project: Project, key: number) => (
                            <tr key={project.number}>
                                <td><small className="text-muted">{key}</small></td>
                                <td><Link to={`/project/${project.slug}`}>{project.name}</Link>{project.name}</td>
                                <td>{project.primaryCluster.name}</td>
                                <td>{project.secondaryCluster?.name}</td>
                            </tr>
                        )
                    )}
                </tbody>
            </table>

        </React.Fragment >

    );

}
