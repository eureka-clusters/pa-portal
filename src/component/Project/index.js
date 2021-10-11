import React, { useEffect, useState } from 'react';
import { apiStates, Api } from '../../function/Api'
import Moment from 'react-moment';
import PrintObject from '../../function/react-print-object'
import { Breadcrumb } from "react-bootstrap";
import moment from 'moment';

export default function Project(props) {

    //'/api/view/project/' + identifier,
    const identifier = props.match.params.identifier;
    const [url, setUrl] = React.useState('/view/project/' + identifier);

    const { state, error, data, load } = Api(url);


    const breadcrumbs = [
        // @Johan perhaps we could create some array will all the possible breadcrumbs routes and only render the specific branch of the tree?
        { id: 1, href: "/", title: "Home" },  //   href={href} title = { title } target = { target }
        { id: 2, href: "/projects", title: "Projects" },
        // { id: 3, active: true, title: "test" }
    ];

    // how can we get a breadcrumb like this 
    // Home / Projects / [ProjectName] / [PartnerName]

    // dont know if something like this would work?
    // problem is we have i guess two ways to get to the partner detail page. 
    // 1) through the project detail
    // 2) through the partners listing ?

    // another problem we have different data variables for e.g. the project identifier (which is needed for the link) + project name on different pages. 
    // example on partner detail page the project name is "data.projectName" but on the project detail page : "data.name"
    
    // so we either harmonize the names which are returned by the api so project_name is always the project_name same for project_identifier, partner_name, partner_identifier, etc.
    // so we could just give our breadcrumb function the "complete data"
    // or we always have so give them those parameters
      
    // function to return the objects of the requested path
    function findPath({ children = [], ...object }, name) {
        var result;
        if (object.name === name) return object;
        return children.some(o => result = findPath(o, name)) && Object.assign({}, object, { children: [result] });
    }

    // tests with a tree structrue to render the breadcrumps inside a function
    var tree = {
        name: 'Root',
        children: [
            {   
                name: 'home',
                text: 'Home',
                href: '/',

                children: [
                    { 
                        name: 'statistics',
                        text: "Statistics",
                        href: "/statistics",
                    },
                    { 
                        name: 'projects',
                        text: "Projects",
                        href: "/projects",
                        children: [
                            {   
                                name: 'project_detail',
                                text: "Projectdetail: {{data.name}}",
                                children : [
                                    { 
                                        name: 'project_partner',
                                        text: "Partner: {{data.name}}",
                                    },
                                ]
                            },
                        ]
                    },
                    {
                        name: 'partners',
                        text: 'Partners',
                        href: "/partners",
                        children: [
                            { 
                                name: 'partner_detail',
                                text: 'Partner: {{data.name}}',
                            },
                        ]
                    },
                    { 
                        name: 'something_else'
                    }
                ] 
            },
            {   
                name: 'user',
                text: 'User',
                href: '/account',
                children: [
                    { 
                        name: 'logout',
                        text: 'Logout',
                        href: '/logout',
                    }
                ] 
            }
        ]
    };

    // tests to return different path's
    console.log('statistics', findPath(tree, 'statistics'));  // root-> home -> statistics
    console.log('project_partner', findPath(tree, 'project_partner')); // root-> home -> projects-> project_detail -> project_partner
    console.log('partner_detail', findPath(tree, 'partner_detail')); // root-> home -> partners-> partner_detail

    let breadcrumbPath = findPath(tree, 'project_partner');

    
    function flatten(array, result = []) {
        for (const { children, ...other } of array) {
            result.push(other);
            if (children) flatten(children, result);
        }
        return result;
    }

    //flatten for the result for rendering the breadcrumbs
    let testbreadcrumb = flatten(breadcrumbPath.children);
    console.log('testbreadcrumb', testbreadcrumb);

    
    // problem is strings like {data.name} aren't rendered with the values from data. i don't know how this could be achieved.
    // e.g. if the {breadcrumbitem.title}  contains {data.name}

    switch (state) {
        case apiStates.ERROR:
            return <p>ERROR: {error || 'General error'}</p>;
        case apiStates.SUCCESS:

            // @ johan we could also push the dynamic items for the breadcrumb like this
            breadcrumbs.push({id: 3, active: true, title: data.name});
            // or render them manually after the foreach rendering see "breadcrumbs.map" */ }
            
            return (
                <React.Fragment>
                    <p>Debug:</p>
                    <PrintObject value={data} />
                 
                    <Breadcrumb>
                        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                        <Breadcrumb.Item href={`/projects`}>Projects</Breadcrumb.Item>
                        {/* <Breadcrumb.Item href={`/project/${identifier}/${data.name}`}>{data.name}</Breadcrumb.Item> */}
                        <Breadcrumb.Item active>{data.name}</Breadcrumb.Item>
                    </Breadcrumb>

                    <Breadcrumb>
                        {breadcrumbs.map((breadcrumbitem) => (
                            <Breadcrumb.Item {...breadcrumbitem} key={breadcrumbitem.id} >{breadcrumbitem.title}</Breadcrumb.Item>
                        ))}
                        {/* // render dynamic items manually */}
                        <Breadcrumb.Item active>{data.name}</Breadcrumb.Item>
                    </Breadcrumb>

                    Breadcrumb from tree<br />
                    <Breadcrumb>
                        {testbreadcrumb.map((breadcrumbitem) => (
                            <Breadcrumb.Item {...breadcrumbitem} key={breadcrumbitem.name} >{breadcrumbitem.text}</Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                    <h1>Project Page</h1>

                    <dl className="row">
                        <dt className="col-sm-3">Project:</dt>
                        <dd className="col-sm-9">{data.name}</dd>

                        <dt className="col-sm-3">Status:</dt>
                        <dd className="col-sm-9">{data.status.status}</dd>

                        <dt className="col-sm-3">Primary Cluster:</dt>
                        <dd className="col-sm-9">{data.primaryCluster.name}</dd>

                        <dt className="col-sm-3">Programme:</dt>
                        <dd className="col-sm-9">{data.programme}</dd>

                        <dt className="col-sm-3">Coordinator:</dt>
                        <dd className="col-sm-9">{String(data.coordinator)}</dd>

                        <dt className="col-sm-3">TechnicalArea:</dt>
                        <dd className="col-sm-9">{data.technicalArea}</dd>
                       
                        <dt className="col-sm-3">Label date:</dt>
                        <dd className="col-sm-9">
                            {data.labelDate}
                            <br />
                            localized: {moment(data.labelDate).format('LLL')}
                            <br />
                        </dd>
                        
                        <dt className="col-sm-3">Description:</dt>
                        <dd className="col-sm-9">
                            <details>
                                <summary>open/close</summary>
                                <p>{data.description}</p>
                            </details>
                        </dd>
                    </dl>
                </React.Fragment>
            );
        default:
            return <p>Loading project...</p>;
    }
}