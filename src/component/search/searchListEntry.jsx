import React from 'react';
import { Link } from "react-router-dom";
import _ from 'lodash';

function Capitalize(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const Highlighted = ({ text = '', highlight = '' }) => {
    if (!highlight.trim()) {
        return <span>{text}</span>
    }
    const regex = new RegExp(`(${_.escapeRegExp(highlight)})`, 'gi')
    const parts = text.split(regex)
    return (
        <span>
            {parts.filter(part => part).map((part, i) => (
                regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
            ))}
        </span>
    )
}


export default function searchListEntry(props) {
    const { item, searchText } = props;

    let htmlType;
    let link;
    let linkLabel;
    let linkTitle;

    console.log(['props', props]);
    htmlType = <span className="search-result-type">{Capitalize(item.type)}:&nbsp;</span>
    linkLabel = <>{htmlType}<p className="search-result-heading">{item.name}</p></>
    linkTitle = item.title;
    
    switch (item.type) {
        case 'project':
            linkLabel = <>{htmlType}<p className="search-result-heading">{item.name}</p>
                <div className="d-flex flex-column justify-content-end search-detail">
                    {item.title ? <div className="p-2 search-highlight"><span className="search-detail-label">Title:</span> {item.title}</div> : ''}
                    {item.description ? <div className="p-2 search-highlight"><span className="search-detail-label">Description:</span> {item.description}</div> : ''}
                </div>
            </>
            link = <Link className="list-group-item list-group-item-action" to={`/project/${item.slug}`} title={linkTitle}>{linkLabel}</Link>;
            break;
        // case 'project':
        // case 'project_highlight':
        //     linkLabel = <>{htmlType}<p className="search-result-heading"><Highlighted text={item.name} highlight={searchText} /></p>
        //         <div className="d-flex flex-column justify-content-end search-detail">
        //             {item.title ? <div className="p-2 search-highlight"><span className="search-detail-label">Title:</span><Highlighted text={item.title} highlight={searchText} /></div> : ''}
        //             {item.description ? <div className="p-2 search-highlight"><span className="search-detail-label">Description:</span><Highlighted text={item.description} highlight={searchText} /></div> : ''}
        //         </div>
        //     </>
        //     link = <Link className="list-group-item list-group-item-action" to={`/project/${item.slug}`} title={linkTitle}>{linkLabel}</Link>;
        //     break;
        case 'partner':
            linkLabel = <>{htmlType}<p className="search-result-heading">{item.name}</p>
                <div className="d-flex flex-column justify-content-end search-detail">
                    {item.title ? <div className="p-2 search-highlight"><span className="search-detail-label">Title:</span> {item.title}</div> : ''}
                    {item.country ? <div className="p-2 search-highlight"><span className="search-detail-label">Country:</span> {item.country}</div> : ''}
                    {item.description ? <div className="p-2 search-highlight"><span className="search-detail-label">Description:</span> {item.description}</div> : ''}
                    {item.organisationType ? <div className="p-2 search-highlight"><span className="search-detail-label">Type:</span> {item.organisationType}</div> : ''}
                </div>
            </>

            link = <Link className="list-group-item list-group-item-action" to={`/partner/${item.slug}`} title={linkTitle}>{linkLabel}</Link>;
            break;
        case 'organisation':
            linkLabel = <>{htmlType}<p className="search-result-heading">{item.name}</p>
                <div className="d-flex flex-column justify-content-end search-detail">
                    {item.title ? <div className="p-2 search-highlight"><span className="search-detail-label">Title:</span> {item.title}</div> : ''}
                    {item.country ? <div className="p-2 search-highlight"><span className="search-detail-label">Country:</span> {item.country}</div> : ''}
                    {item.description ? <div className="p-2 search-highlight"><span className="search-detail-label">Description:</span> {item.description}</div> : ''}
                    {item.organisationType ? <div className="p-2 search-highlight"><span className="search-detail-label">Type:</span> {item.organisationType}</div> : ''}
                </div>
            </>
            
            link = <Link className="list-group-item list-group-item-action" to={`/organisation/${item.slug}`} title={linkTitle}>{linkLabel}</Link>;
            break;
        default:
    }
    return (
        <>
            { link }
            {/* <Highlighted text="the quick brown fox jumps over the lazy dog" highlight={searchText} /> */}
            {/* <pre className='debug'>{JSON.stringify(item, undefined, 2)}</pre>     */}
        </>
    );
}