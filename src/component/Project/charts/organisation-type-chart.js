import React from 'react';
import Chart from "react-google-charts";

const OrganisationTypeChart = ({ results }) => {

    //Do some stupid data formatting
    var $data = [
        ['Organisation Type', 'Amount']
    ];

    const Types = results
        .map(dataItem => dataItem.organisation.type.type) // get all organisation types
        .filter((Type, index, array) => array.indexOf(Type) === index); // filter out duplicates

    const counts = Types
        .map(Type => ({
            type: Type,
            count: results.filter(item => item.organisation.type.type === Type).length
        }));


    counts.forEach(element => {
        $data.push([
            element.type,
            element.count
        ]);
    });

    return (
        <React.Fragment>
            {/* <h2>Partners by organisation type</h2> */}

            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={{
                    title: 'Partners by organisation type',
                }}
                rootProps={{ 'data-testid': '1' }}
            />
        </React.Fragment>
    );
}

export default OrganisationTypeChart;