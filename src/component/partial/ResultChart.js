import React from 'react';
import Chart from "react-google-charts";

const ResultChart = ({ results }) => {

    //Do some stupid data formatting
    var $data = [
        ['Project', 'Costs']   ];

    results.forEach(element => {
        $data.push([
            element.projectName,
            element.latestVersionTotalCosts
        ]);
    });

    return (
        <React.Fragment>
            <h2>Chart</h2>

            <Chart
                width={1000}
                height={800}
                chartType="ColumnChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={{
                    title: 'Costs',
                    chartArea: { width: '80%' },
                    hAxis: {
                        title: 'Project',
                        minValue: 0,
                    },
                    vAxis: {
                        title: 'Costs',
                    },
                }}
                legendToggle
            />

        </React.Fragment>
    );
}

export default ResultChart;