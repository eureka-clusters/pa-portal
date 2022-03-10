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

    var stats = [];
    results.reduce(function (res, value) {
        if (!res[value.organisation.country.country]) {
            res[value.organisation.country.country] = { country: value.organisation.country.country, effort: 0, budget: 0 };
            stats.push(res[value.organisation.country.country])
        }
        res[value.organisation.country.country].budget += parseFloat(value.latestVersionCosts);
        res[value.organisation.country.country].effort += parseFloat(value.latestVersionEffort);
        return res;
    }, {});

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