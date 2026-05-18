import Chart from "react-google-charts";

import {Partner} from "@/interface/project/partner";

const OrganisationTypeChart = ({results}: { results: Partner[] }) => {
    const groupedTypes = results.reduce<Record<string, number>>((accumulator, partner) => {
        const organisationType = partner.organisation.type.type;
        accumulator[organisationType] = (accumulator[organisationType] ?? 0) + 1;
        return accumulator;
    }, {});

    const data: (string | number)[][] = [
        ["Organisation Type", "Amount"],
        ...Object.entries(groupedTypes),
    ];

    return (
        <Chart
            width="500px"
            height="300px"
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
                title: "Partners by organisation type",
                tooltip: {
                    showColorCode: true,
                },
            }}
            rootProps={{"data-testid": "1"}}
        />
    );
};

export default OrganisationTypeChart;
