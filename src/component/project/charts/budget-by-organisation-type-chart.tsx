import Chart from "react-google-charts";

import {Partner} from "@/interface/project/partner";

type OrganisationTypeStats = {
    type: string;
    budget: number;
    effort: number;
};

const BudgetByOrganisationTypeChart = ({results}: { results: Partner[] }) => {
    const stats = results.reduce<Record<string, OrganisationTypeStats>>((accumulator, partner) => {
        const organisationType = partner.organisation.type.type;

        accumulator[organisationType] ??= {
            type: organisationType,
            budget: 0,
            effort: 0,
        };

        accumulator[organisationType].budget += Number(partner.latestVersionCosts ?? 0);
        accumulator[organisationType].effort += Number(partner.latestVersionEffort ?? 0);

        return accumulator;
    }, {});

    const dataBudget: (string | number)[][] = [
        ["Organisation Type", "Budget"],
        ...Object.values(stats).map((entry) => [entry.type, entry.budget]),
    ];

    const dataEffort: (string | number)[][] = [
        ["Organisation Type", "Effort"],
        ...Object.values(stats).map((entry) => [entry.type, entry.effort]),
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
                        title: "Budget by Organisation Types",
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
                        title: "Effort by Organisation Types",
                    }}
                    rootProps={{"data-testid": "1"}}
                />
            </div>
        </>
    );
};

export default BudgetByOrganisationTypeChart;
