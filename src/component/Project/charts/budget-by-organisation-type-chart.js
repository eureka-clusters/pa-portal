import React from 'react';
import Chart from "react-google-charts";

const BudgetByOrganisationTypeChart = ({ results }) => {

    //Do some stupid data formatting
    var $data = [
        ['Organisation Type', 'Budget']
    ];

    var $data2 = [
        ['Organisation Type', 'Effort']
    ];


    // const Types = results
    //     .map(dataItem => dataItem.organisation.type.type) // get all organisation types
    //     .filter((Type, index, array) => array.indexOf(Type) === index); // filter out duplicates

    // console.log(results.flatMap(a => a.organisation.type.type));
    // const res = results.flatMap(a => a.organisation.type.type).reduce((acc, { type, score }) => {
    //     console.log(['acc', acc]);

    //     console.log(['type', type]);
    //     console.log(['score', score]);
    //     return acc;
    // }, {})
    // console.log(res)

    var stats = [];
    results.reduce(function (res, value) {
        if (!res[value.organisation.type.type]) {
            res[value.organisation.type.type] = { type: value.organisation.type.type, effort: 0, budget: 0 };
            stats.push(res[value.organisation.type.type])
        }
        res[value.organisation.type.type].budget += value.latestVersionCosts;
        res[value.organisation.type.type].effort += value.latestVersionEffort;
        return res;

    }, {});
    console.log(stats);

  
    // const counts = Types
    //     .map(Type => ({
    //         type: Type,
    //         count: results.filter(item => item.organisation.type.type === Type).length
    //     }));


    // counts.forEach(element => {
    //     $data.push([
    //         element.type,
    //         element.count
    //     ]);
    // });

    stats.forEach(element => {
        $data.push([
            element.type,
            element.budget
        ]);


        $data2.push([
            element.type,
            element.effort
        ]);
    });


    return (
        <React.Fragment>
            {/* <h2>Budget by organisation type</h2> */}

            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={{
                    title: 'Budget by Organisation Types',
                }}
                rootProps={{ 'data-testid': '1' }}
            />


            {/* <h2>Effort by organisation type</h2> */}

            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data2}
                options={{
                    title: 'Effort by Organisation Types',
                }}
                rootProps={{ 'data-testid': '1' }}
            />

        </React.Fragment>
    );
}

export default BudgetByOrganisationTypeChart;