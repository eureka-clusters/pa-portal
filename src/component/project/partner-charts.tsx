import {Partner} from "@/interface/project/partner";
import OrganisationTypeChart from "@/component/project/charts/organisation-type-chart";
import OrganisationCountryChart from "@/component/project/charts/country-chart";
import BudgetByOrganisationTypeChart from "@/component/project/charts/budget-by-organisation-type-chart";
import BudgetByCountryChart from "@/component/project/charts/budget-and-effort-by-country-chart";

export default function PartnerCharts({partners}: { partners: Partner[] }) {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <OrganisationTypeChart results={partners}/>
                </div>
                <div className="col">
                    <OrganisationCountryChart results={partners}/>
                </div>
            </div>
            <div className="row">
                <BudgetByOrganisationTypeChart results={partners}/>
            </div>
            <div className="row">
                <BudgetByCountryChart results={partners}/>
            </div>
        </div>
    );
}
