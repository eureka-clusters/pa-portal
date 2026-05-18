import Chart from "react-google-charts";

type ResultChartItem = {
    name: string;
    latestVersionCosts: number;
};

const ResultChart = ({results}: { results: ResultChartItem[] }) => {
    const data: (string | number)[][] = [
        ["Project", "Costs"],
        ...results.map((result) => [result.name, result.latestVersionCosts]),
    ];

    return (
        <>
            <h2>Chart</h2>
            <Chart
                width="100%"
                height="400px"
                chartType="ColumnChart"
                loader={<div>Loading Chart</div>}
                data={data}
                options={{
                    title: "Costs",
                    hAxis: {
                        title: "Project",
                        minValue: 0,
                    },
                    vAxis: {
                        title: "Costs",
                    },
                    chartArea: {width: "50%", height: "70%"},
                }}
                legendToggle
            />
        </>
    );
};

export default ResultChart;
