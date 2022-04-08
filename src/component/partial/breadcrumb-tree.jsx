import React, { useEffect, useState} from 'react';
import { Breadcrumb } from "react-bootstrap";
import reactStringReplace from 'react-string-replace';
import { Link } from "react-router-dom";

// Tree structure of all pages still needs harmonising of all dynamic variable names like projectIdentifier or projectName
var tree = {
    name: 'Root',
    children: [
        {
            name: 'home',
            displayname: 'Home',
            href: '/',

            children: [
                {
                    name: 'statistics',
                    displayname: "Statistics",
                    href: "/statistics",
                    children: [
                        // {
                        //     name: 'statistics-projects',
                        //     displayname: 'Projects',
                        //     href: '/statistics/projects',
                        // },
                        // {
                        //     name: 'statistics-partners',
                        //     displayname: 'Partners',
                        //     href: '/statistics/partners',
                        // },
                    ]
                },
                {
                    name: 'statistics-projects',
                    displayname: 'Project statistics',
                    href: '/statistics/projects',
                },
                {
                    name: 'statistics-partners',
                    displayname: 'Partner statistics',
                    href: '/statistics/partners',
                },
                {
                    name: 'organisations',
                    displayname: "Organisations",
                    href: "/organisations",
                    children: [
                        {
                            name: 'organisation',
                            displayname: 'Organisation: {name}',
                            href: '/organisation/{slug}',
                        },
                    ]
                },
                {
                    name: 'projects',
                    displayname: "Projects",
                    href: "/projects",
                    children: [
                        {
                            name: 'project',
                            // href: '/project/{slug}',
                            // displayname: 'Project: {name}',
                            // href: '/project/{project.slug}',
                            // displayname: 'Project: {project.name}',

                            href: '/project/{project_slug}',
                            displayname: 'Project: {project_name}',
                            children: [
                                {
                                    name: 'partner',
                                    // displayname: "Partner: {organisation.name}",
                                    // href: '/partner/{organisation.slug}',

                                    displayname: "Partner: {partner_name}",
                                    href: '/partner/{partner_slug}',
                                },
                            ]
                        },
                    ]
                },
                // {
                //     name: 'partners',
                //     displayname: 'Partners',
                //     href: "/partners",
                //     children: [
                //         {
                //             name: 'partner',
                //             displayname: 'Partner: {organisation.name}',
                //             href: '/partner/{slug}',
                //         },
                //     ]
                // },
                {
                    name: 'something_else'
                }
            ]
        },
        {
            name: 'user',
            displayname: 'User',
            href: '/account',
            children: [
                {
                    name: 'logout',
                    displayname: 'Logout',
                    href: '/logout',
                }
            ]
        }
    ]
};

/*
possibilities to set data

data.project.identifier
<BreadcrumbTree current="project_detail" data={data} />
<BreadcrumbTree current="project_partner" data={{projectIdentifier :'some value', projectName:'some other value'}} />
<BreadcrumbTree current="project_partner" data={{projectIdentifier: data.projectIdentifier, projectName: data.projectName }} />

how to overwrite or extend data values:
<BreadcrumbTree current="project_partner" data={{ ...data, ...{ name: 'some value', projectName: 'some other value' }}} />


link the current entry
<BreadcrumbTree current="project_partner" data={data} linkCurrent={true} />
*/

// function BreadcrumbTree({ children, ...props }) {
function BreadcrumbTree({ current, data, linkCurrent = false }) {

    const [breadcrumbs, setBreadcrumbs] = useState([]);

    // initial find the breadcrumbs from the path which should be rendered.
    useEffect(() => {

        // function to return the objects of the requested path
        function findPath({ children = [], ...object }, name) {
            var result;
            if (object.name === name) return object;
            return children.some(o => result = findPath(o, name)) && Object.assign({}, object, { children: [result] });
        }

        // function to flatten the array
        function flatten(array, result = []) {
            for (const { children, ...other } of array) {
                result.push(other);
                if (children) flatten(children, result);
            }
            return result;
        }
        
        let breadcrumbPath = findPath(tree, current);

        if(breadcrumbPath.children !== undefined) {
            setBreadcrumbs(flatten(breadcrumbPath.children));
        }
    }, [current, data]);
    
   

    // function to substitute texts parameters
    const substituteTexts = (str, data) => {
        const reg = /\{([a-z|A-Z|0-9|_|.]+)\}/g;
        
        // version which works with child objects like {organisation.name}
        var output = reactStringReplace(str, reg, (match, i) => (
            fetchFromObject(data, match)
        ));
        return output.join('');
    }


    function fetchFromObject(obj, prop) {
        if (typeof obj === 'undefined') {
            return false;
        }

        var _index = prop.indexOf('.')
        if (_index > -1) {
            return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }
        return obj[prop];
    }


    return (
        <>
        {/* <pre className='debug'>{JSON.stringify(data, undefined, 2)}</pre> */}
        <Breadcrumb>
            {
                breadcrumbs.map(breadcrumbitem => {
                    // current item should not be linked => set active = true which removes the link
                    if (current === breadcrumbitem.name && linkCurrent === false) {
                        breadcrumbitem.active = true;
                        delete breadcrumbitem.href;
                    }

                    // hard href link would => page reload
                    // if (breadcrumbitem.href !== undefined) {
                    //     breadcrumbitem.href = substituteTexts(breadcrumbitem.href, data)
                    // } 

                    // use react-router-dom => no page reload
                    if (breadcrumbitem.href !== undefined) {
                        breadcrumbitem.linkAs = Link ;
                        breadcrumbitem.linkProps = { to: substituteTexts(breadcrumbitem.href, data) };
                        delete breadcrumbitem.href;
                    }

                    if (breadcrumbitem.displayname !== undefined) {
                        breadcrumbitem.displayname = substituteTexts(breadcrumbitem.displayname, data);
                    }

                    return (<Breadcrumb.Item {...breadcrumbitem} key={breadcrumbitem.name} >{breadcrumbitem.displayname}</Breadcrumb.Item>);
                })
            }
        </Breadcrumb>
        </>
    )
}

export default BreadcrumbTree;