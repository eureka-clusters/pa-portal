import React from 'react';
import Chart from "react-google-charts";

const BudgetByCountryChart = ({ results }) => {

    //Do some stupid data formatting
    var $data = [
        ['Country', 'Budget']
    ];

    var $data2 = [
        ['Country', 'Effort']
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
        if (!res[value.organisation.country.country]) {
            res[value.organisation.country.country] = { country: value.organisation.country.country, effort: 0, budget: 0 };
            stats.push(res[value.organisation.country.country])
        }
        res[value.organisation.country.country].budget += value.latestVersionCosts;
        res[value.organisation.country.country].effort += value.latestVersionEffort;
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
            element.country,
            element.budget
        ]);


        $data2.push([
            element.country,
            element.effort
        ]);
    });


    return (
        <React.Fragment>
            {/* <h2>Budget by organisation type</h2> */}
            <div className="col">
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={{
                    title: 'Budget by Country',
                }}
                rootProps={{ 'data-testid': '1' }}
            />


            {/* <h2>Effort by organisation type</h2> */}
            </div>
            <div className="col">
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data2}
                options={{
                    title: 'Effort by Country',
                }}
                // graphID="EffortByCountryChart"
                rootProps={{ 'data-testid': '1' }}
            />
            </div>
        </React.Fragment>
    );
}

export default BudgetByCountryChart;