import React, { useEffect, useState} from 'react';
import { Breadcrumb } from "react-bootstrap";
import reactStringReplace from 'react-string-replace';

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
        let breadcrumbPath = findPath(tree, current);

        if(breadcrumbPath.children !== undefined) {
            setBreadcrumbs(flatten(breadcrumbPath.children));
        }
    }, [current]);
    
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

                    if (breadcrumbitem.href !== undefined) {
                        // console.log('href before', breadcrumbitem.href);
                        breadcrumbitem.href = substituteTexts(breadcrumbitem.href, data)
                        // console.log('href after ', breadcrumbitem.href);
                    } 

                    if (breadcrumbitem.displayname !== undefined) {
                        console.log('displayname before', breadcrumbitem.displayname);
                        breadcrumbitem.displayname = substituteTexts(breadcrumbitem.displayname, data);
                        console.log('displayname after', breadcrumbitem.displayname);
                    }

                    // not sure if i shouldn't use this instead so leave this here as backup
                    //linkProps = {{ to: item.href }} linkAs = { Link }

                    return (<Breadcrumb.Item {...breadcrumbitem} key={breadcrumbitem.name} >{breadcrumbitem.displayname}</Breadcrumb.Item>);
                })
            }
        </Breadcrumb>
        </>
    )
}

export default BreadcrumbTree;