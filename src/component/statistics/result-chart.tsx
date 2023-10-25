import React from 'react';
import Chart from "react-google-charts";

type Props = {
    name: string;
    latestVersionCosts: string;
}

const ResultChart = ({results}: { results: any }) => {

    //Do some stupid data formatting
    const $data = [
        ['Project', 'Costs']
    ];

    results.forEach((element: Props) => {
        $data.push([
            element.name,
            element.latestVersionCosts
        ]);
    });

    return (
        <React.Fragment>
            <h2>Chart</h2>
            <Chart
                // width={1000}
                // height={800}
                width="100%"
                // height={800}
                height="400px"

                chartType="ColumnChart"
                loader={<div>Loading Chart</div>}
                data={$data}
                options={{
                    title: 'Costs',
                    hAxis: {
                        title: 'Project',
                        minValue: 0,
                    },
                    vAxis: {
                        title: 'Costs',
                    },
                    // For the legend to fit, we make the chart area smaller
                    chartArea: {width: '50%', height: '70%'},
                }}
                legendToggle
            />

        </React.Fragment>
    );
}

export default ResultChart;