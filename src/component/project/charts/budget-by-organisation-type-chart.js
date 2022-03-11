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

    var stats = [];
    results.reduce(function (res, value) {
        if (!res[value.organisation.type.type]) {
            res[value.organisation.type.type] = { type: value.organisation.type.type, effort: 0, budget: 0 };
            stats.push(res[value.organisation.type.type])
        }
        res[value.organisation.type.type].budget += parseFloat(value.latestVersionCosts);
        res[value.organisation.type.type].effort += parseFloat(value.latestVersionEffort);
        return res;
    }, {});

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
            <div className="col">
            <Chart
                width={'500px'}
                height={'300px'}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={{
                    title: 'Budget by Organisation Types',
                }}
                // graphID="BudgetByOrganisationTypesChart"
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
                    title: 'Effort by Organisation Types',
                }}
                // graphID="EffortByOrganisationTypesChart"
                rootProps={{ 'data-testid': '1' }}
            />
            </div>
        </React.Fragment>
    );
}

export default BudgetByOrganisationTypeChart;