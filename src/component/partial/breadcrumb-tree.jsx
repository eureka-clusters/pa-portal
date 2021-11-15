import React, {useEffect, useState, FC} from 'react';
import {Breadcrumb} from "react-bootstrap";
import reactStringReplace from 'react-string-replace';

// Tree structure of all pages still needs harmonising of all dynamic variable names like projectIdentifier or projectName
const tree = {
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

// interface Props {
//     current: string,
//     data: Object,
//     linkCurrent: boolean
// }

// function BreadcrumbTree({ children, ...props }) {
const BreadcrumbTree = ({current, data, linkCurrent}) => {

    const [breadcrumbs, setBreadcrumbs] = useState([]);

    // initial find the breadcrumbs from the path which should be rendered.
    useEffect(() => {

        // function to return the objects of the requested path
        function findPath({children = [], ...object}, name) {
            let result;
            if (object.name === name) return object;
            return children.some(o => result = findPath(o, name)) && Object.assign({}, object, {children: [result]});
        }

        // function to flatten the array
        function flatten(array, result = []) {
            for (const {children, ...other} of array) {
                result.push(other);
                if (children) flatten(children, result);
            }
            return result;
        }

        let breadcrumbPath = findPath(tree, current);

        if (breadcrumbPath.children !== undefined) {
            setBreadcrumbs(flatten(breadcrumbPath.children));
        }
    }, [current]);


    // function to substitute texts parameters
    const substituteTexts = (str, data) => {
        const reg = /\{([a-z|A-Z|0-9|_|.]+)\}/g;

        // version which works with child objects like {organisation.name}
        const output = reactStringReplace(str, reg, (match, i) => (
            fetchFromObject(data, match)
        ));
        return output.join('');
    }


    function fetchFromObject(obj, prop) {
        if (typeof obj === 'undefined') {
            return false;
        }

        const _index = prop.indexOf('.');
        if (_index > -1) {
            return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }
        return obj[prop];
    }


    return (
        <Breadcrumb>
            {
                breadcrumbs.map(breadcrumbItem => {
                    // current item should not be linked => set active = true which removes the link
                    if (current === breadcrumbItem.name && !linkCurrent) {
                        breadcrumbItem.active = true;
                        delete breadcrumbItem.href;
                    }

                    if (breadcrumbItem.href !== undefined) {
                        // console.log('href before', breadcrumbItem.href);
                        breadcrumbItem.href = substituteTexts(breadcrumbItem.href, data)
                        // console.log('href after ', breadcrumbItem.href);
                    }

                    if (breadcrumbItem.displayname !== undefined) {
                        console.log('displayname before', breadcrumbItem.displayname);
                        breadcrumbItem.displayname = substituteTexts(breadcrumbItem.displayname, data);
                        console.log('displayname after', breadcrumbItem.displayname);
                    }

                    // not sure if i shouldn't use this instead so leave this here as backup
                    //linkProps = {{ to: item.href }} linkAs = { Link }

                    return (<Breadcrumb.Item {...breadcrumbItem}
                                             key={breadcrumbItem.name}>{breadcrumbItem.displayname}</Breadcrumb.Item>);
                })
            }
        </Breadcrumb>
    )
}

export default BreadcrumbTree;