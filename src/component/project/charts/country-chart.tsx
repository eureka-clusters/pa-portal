import Chart from "react-google-charts";

import {Partner} from "@/interface/project/partner";

const OrganisationCountryChart = ({results}: { results: Partner[] }) => {
    const groupedCountries = results.reduce<Record<string, number>>((accumulator, partner) => {
        const country = partner.organisation.country.country;
        accumulator[country] = (accumulator[country] ?? 0) + 1;
        return accumulator;
    }, {});

    const data: (string | number)[][] = [
        ["Country", "Amount"],
        ...Object.entries(groupedCountries),
    ];

    return (
        <Chart
            width="500px"
            height="300px"
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={data}
            options={{
                title: "Partners by Countries",
            }}
            rootProps={{"data-testid": "1"}}
        />
    );
};

export default OrganisationCountryChart;
