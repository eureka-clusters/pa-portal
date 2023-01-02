import React from 'react';
import Chart from "react-google-charts";

const OrganisationCountryChart = ({results}: { results: any[] }) => {

    //Do some stupid data formatting
    let $data = [
        ['Country', 'Amount']
    ];

    const Types = results
        .map(dataItem => dataItem.organisation.country.country) // get all countries types
        .filter((Type, index, array) => array.indexOf(Type) === index); // filter out duplicates

    const counts = Types
        .map(Type => ({
            type: Type,
            count: results.filter(item => item.organisation.country.country === Type).length
        }));


    counts.forEach(element => {
        $data.push([
            element.type,
            element.count
        ]);
    });

    return (
        <React.Fragment>
            {/* <h2>Partners by Countries</h2> */}

            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={{
                    title: 'Partners by Countries',
                }}
                // graphID="PartnersByCountryChart"
                rootProps={{'data-testid': '1'}}
            />
        </React.Fragment>
    );
}

export default OrganisationCountryChart;