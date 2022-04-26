import React from 'react';
import {Link} from "react-router-dom";
import _ from 'lodash';
import NumberFormat from "react-number-format"

function Capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const Highlighted = ({text = '', highlight = ''}: { text: string; highlight: string; }) => {
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


interface ScoreFormatProps {
    value?: number
    showPrefix?: boolean,
    showSuffix?: boolean,
}

export const ScoreFormat = ({value, showPrefix, showSuffix}: ScoreFormatProps) => {

    if (typeof (value) === 'undefined' || value == null) {
        return (<></>);
    }

    return (
        <NumberFormat
            value={value}
            thousandSeparator={','}
            prefix={showPrefix ? 'Score: ' : ''}
            suffix={showSuffix ? ' (Score)' : ''}
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}
ScoreFormat.defaultProps = {
    showPrefix: true,
    showSuffix: false,
};


interface itemProps {
    type: string,
    slug: string,
    name: string,
    title: string,
    description: string,
    organisationType?: string,
    country?: string,
    score: number,
}

export default function searchListEntry({item, searchText}: { item: itemProps; searchText: string; }) {

    let htmlType;
    let link;
    let linkLabel;
    let linkTitle;
    let score;
    let itemtype;

    htmlType = <span className="search-result-type">{Capitalize(item.type)}:&nbsp;</span>
    linkLabel = <>{htmlType}<p className="search-result-heading">{item.name}</p></>
    linkTitle = item.title;
    score = <div className="float-end search-result-score"><ScoreFormat value={item.score}/></div>
    itemtype = item.type;

    switch (itemtype) {
        case 'project':
            linkLabel = <>{htmlType}<p className="search-result-heading"><Highlighted text={item.name}
                                                                                      highlight={searchText}/></p>
                <div className="d-flex flex-column justify-content-end search-detail">
                    {item.title ? <div className="p-2 search-highlight"><span
                        className="search-detail-label">Title:</span> <Highlighted text={item.title}
                                                                                  highlight={searchText}/></div> : ''}
                    {item.description ? <div className="p-2 search-highlight"><span
                        className="search-detail-label">Description:</span> <Highlighted text={item.description}
                                                                                        highlight={searchText}/>
                    </div> : ''}
                </div>
                {score}
            </>
            link = <Link className="list-group-item list-group-item-action" to={`/project/${item.slug}`}
                         title={linkTitle}>{linkLabel}</Link>;
            break;
        case 'organisation':
            linkLabel = <>{htmlType}<p className="search-result-heading">{item.name}</p>
                <div className="d-flex flex-column justify-content-end search-detail">
                    {item.title ? <div className="p-2 search-highlight"><span
                        className="search-detail-label">Title:</span> <Highlighted text={item.title}
                                                                                  highlight={searchText}/></div> : ''}
                    {item.country ? <div className="p-2 search-highlight"><span
                        className="search-detail-label">Country:</span> <Highlighted text={item.country}
                                                                                    highlight={searchText}/></div> : ''}
                    {item.description ? <div className="p-2 search-highlight"><span
                        className="search-detail-label">Description:</span> <Highlighted text={item.description}
                                                                                        highlight={searchText}/>
                    </div> : ''}
                    {item.organisationType ? <div className="p-2 search-highlight"><span
                        className="search-detail-label">Type:</span> <Highlighted text={item.organisationType}
                                                                                 highlight={searchText}/></div> : ''}
                </div>
                {score}
            </>
            link = <Link className="list-group-item list-group-item-action" to={`/organisation/${item.slug}`}
                         title={linkTitle}>{linkLabel}</Link>;
            break;

        default:
    }
    return (
        <>
            {link}
            {/* <pre className='debug'>{JSON.stringify(item, undefined, 2)}</pre>     */}
        </>
    );
}