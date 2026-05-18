import Chart from "react-google-charts";

import {Partner} from "@/interface/project/partner";

type CountryStats = {
    country: string;
    budget: number;
    effort: number;
};

const BudgetByCountryChart = ({results}: { results: Partner[] }) => {
    const stats = results.reduce<Record<string, CountryStats>>((accumulator, partner) => {
        const country = partner.organisation.country.country;

        accumulator[country] ??= {
            country,
            budget: 0,
            effort: 0,
        };

        accumulator[country].budget += Number(partner.latestVersionCosts ?? 0);
        accumulator[country].effort += Number(partner.latestVersionEffort ?? 0);

        return accumulator;
    }, {});

    const dataBudget: (string | number)[][] = [
        ["Country", "Budget"],
        ...Object.values(stats).map((entry) => [entry.country, entry.budget]),
    ];

    const dataEffort: (string | number)[][] = [
        ["Country", "Effort"],
        ...Object.values(stats).map((entry) => [entry.country, entry.effort]),
    ];

    return (
        <>
            <div className="col">
                <Chart
                    width="500px"
                    height="300px"
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={dataBudget}
                    options={{
                        title: "Budget by Country",
                    }}
                    rootProps={{"data-testid": "1"}}
                />
            </div>
            <div className="col">
                <Chart
                    width="500px"
                    height="300px"
                    chartType="PieChart"
                    loader={<div>Loading Chart</div>}
                    data={dataEffort}
                    options={{
                        title: "Effort by Country",
                    }}
                    rootProps={{"data-testid": "1"}}
                />
            </div>
        </>
    );
};

export default BudgetByCountryChart;
