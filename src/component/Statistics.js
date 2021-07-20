import React, { useContext, useEffect, useState } from 'react';
import { Form, Button } from "react-bootstrap";
import Config from "../constants/Config";
import { UserContext } from "../context/UserContext";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import ProjectTable from "./partial/ProjectTable";
import PartnerTable from "./partial/PartnerTable";
import ResultChart from "./partial/ResultChart";

export default function Statistics(props) {

    const serverUri = Config.SERVER_URI;

    const { accessToken } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [facets, setFacets] = useState([]);
    const [output, setOutput] = useState(1);
    const [errors, setErrors] = useState(false);
    const [hash, setHash] = useState(true);

    const [filter, setFilter] = useState({
        country: [],
        country_method: 'or',
        partner_type: [],
        partner_type_method: 'or',
        project_status: [],
        project_status_method: 'or',
        primary_cluster: [],
        primary_cluster_method: 'or',
        year: [],
    });

    useEffect(() => {
        if (!accessToken || !output) {
            return null;
        }

        updateResults();

        setLoading(false);
    }, [accessToken, output, setLoading]);

    const updateResults = () => {
        fetch(serverUri + '/api/statistics/facets?output=' + output + '&filter=' + btoa(JSON.stringify(filter)),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        ).then((res) => res.json())
            .then(res => setFacets(res._embedded.facets))
            .catch(err => setErrors(err));

        fetch(serverUri + '/api/statistics/results?output=' + output + '&filter=' + btoa(JSON.stringify(filter)),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        ).then((res) => res.json())
            .then(res => setResults(res._embedded.results))
            .catch(err => setErrors(err));
    }

    const downloadExcel = () => {
        fetch(serverUri + '/api/statistics/download/' + output + '/' + btoa(JSON.stringify(filter)),
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            }
        ).then(response => {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = 'Download.xlsx';
                a.click();
            });
            //window.location.href = response.url;
        });
    }

    const updateFilter = (event) => {
        const target = event.target;

        var name = target.name;
        var value = target.value;

        if (target.type === 'checkbox') {
            if (target.checked) {
                filter[name].push(value);
            } else {
                const index = filter[name].indexOf(value);
                filter[name].splice(index, 1);
            }
        } else {
            filter[name] = value;
        }

        updateResults();
        updateHash();
    }

    const updateCountryMethod = (event) => {
        filter['country_method'] = event ? 'and' : 'or';
        updateResults();
        updateHash();
    }

    const updatePartnerTypeMethod = (event) => {
        filter['partner_type_method'] = event ? 'and' : 'or';
        updateResults();
        updateHash();
    }

    const updateProjectStatusMethod = (event) => {
        filter['project_status_method'] = event ? 'and' : 'or';
        updateResults();
        updateHash();
    }

    const updatePrimaryClusterMethod = (event) => {
        filter['primary_cluster_method'] = event ? 'and' : 'or';
        updateResults();
        updateHash();
    }

    const updateHash = () => {
        props.history.push({
            'hash': btoa(JSON.stringify(filter))
        });

        setHash(btoa(JSON.stringify(filter)))
    }

    if (loading) {
        return 'Loading 1234';
    }
    if (errors) {
        return 'Error';
    }

    return (
        <React.Fragment>
            <Form>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <h1>PA report portal</h1>
                    </div>
                </div>
                <div className={'row'}>
                    <div className={'col-2'}>
                        <fieldset>
                            <legend><small>Countries</small></legend>

                            {output === 1 &&
                                <BootstrapSwitchButton checked={filter['country_method'] === 'and'}
                                    size="sm"
                                    onlabel={"and"}
                                    offlabel={"or"}
                                    onstyle={'primary'}
                                    offstyle={'secondary'} onChange={updateCountryMethod} />
                            }

                            {facets[0] && facets[0].map((country, i) => (
                                <div key={i}>
                                    <Form.Check type={'checkbox'} id={`check-country-${i}`}>
                                        <Form.Check.Input name="country" value={country['country']}
                                            onChange={updateFilter} />
                                        <Form.Check.Label>{country['country']} ({country['amount']})</Form.Check.Label>
                                    </Form.Check>
                                </div>
                            ))}
                        </fieldset>

                        <fieldset>
                            <legend><small>Partner type</small></legend>

                            {output === 1 &&
                                <BootstrapSwitchButton checked={filter['partner_type_method'] === 'and'}
                                    size="sm"
                                    onlabel={"and"}
                                    offlabel={"or"}
                                    onstyle={'primary'}
                                    offstyle={'secondary'} onChange={updatePartnerTypeMethod} />
                            }

                            {facets[1] && facets[1].map((partnerType, i) => (
                                <div key={i}>
                                    <Form.Check type={'checkbox'} id={`check-type-${i}`}>
                                        <Form.Check.Input name="partner_type" value={partnerType['partnerType']}
                                            onChange={updateFilter} />
                                        <Form.Check.Label>{partnerType['partnerType']} ({partnerType['amount']})</Form.Check.Label>
                                    </Form.Check>
                                </div>
                            ))}
                        </fieldset>

                        <fieldset>
                            <legend><small>Project Status</small></legend>

                            {output === 1 &&
                                <BootstrapSwitchButton checked={filter['project_status_method'] === 'and'}
                                    size="sm"
                                    onlabel={"and"}
                                    offlabel={"or"}
                                    onstyle={'primary'}
                                    offstyle={'secondary'} onChange={updateProjectStatusMethod} />
                            }

                            {facets[2] && facets[2].map((projectStatus, i) => (
                                <div key={i}>
                                    <Form.Check type={'checkbox'} id={`check-project-status-${i}`}>
                                        <Form.Check.Input name="project_status" value={projectStatus['projectStatus']}
                                            onChange={updateFilter} />
                                        <Form.Check.Label>{projectStatus['projectStatus']} ({projectStatus['amount']})</Form.Check.Label>
                                    </Form.Check>
                                </div>
                            ))}
                        </fieldset>

                        <fieldset>
                            <legend><small>Primary Cluster</small></legend>

                            {output === 1 &&
                                <BootstrapSwitchButton checked={filter['primary_cluster_method'] === 'and'}
                                    size="sm"
                                    onlabel={"and"}
                                    offlabel={"or"}
                                    onstyle={'primary'}
                                    offstyle={'secondary'} onChange={updatePrimaryClusterMethod} />
                            }

                            {facets[3] && facets[3].map((primaryCluster, i) => (
                                <div key={i}>
                                    <Form.Check type={'checkbox'} id={`check-primary-cluster-${i}`}>
                                        <Form.Check.Input name="primary_cluster" value={primaryCluster['primaryCluster']}
                                            onChange={updateFilter} />
                                        <Form.Check.Label>{primaryCluster['primaryCluster']} ({primaryCluster['amount']})</Form.Check.Label>
                                    </Form.Check>
                                </div>
                            ))}
                        </fieldset>

                        {output === 2 &&
                            <fieldset>
                                <legend><small>Years</small></legend>

                                {facets[4] && facets[4].map((year, i) => (
                                    <div key={i}>
                                        <Form.Check type={'checkbox'} id={`check-year-${i}`}>
                                            <Form.Check.Input name="year" value={year['year']}
                                                onChange={updateFilter} />
                                            <Form.Check.Label>{year['year']}</Form.Check.Label>
                                        </Form.Check>
                                    </div>
                                ))}
                            </fieldset>
                        }
                    </div>
                    <div className={'col-10'}>

                        <Form.Check id={'output_projects'}>
                            <Form.Check.Input type={'radio'} checked={output === 1} onChange={() => setOutput(1)} />
                            <Form.Check.Label>Projects</Form.Check.Label>
                        </Form.Check>
                        <Form.Check id={'output_partners'}>
                            <Form.Check.Input type={'radio'} checked={output === 2} onChange={() => setOutput(2)} />
                            <Form.Check.Label>Partners</Form.Check.Label>
                        </Form.Check>
                        <Form.Check id={'output_chart'}>
                            <Form.Check.Input type={'radio'} checked={output === 3} onChange={() => setOutput(3)} />
                            <Form.Check.Label>Chart</Form.Check.Label>
                        </Form.Check>

                        {output === 1 && <ProjectTable results={results} hash={hash} downloadExcel={downloadExcel} />}
                        {output === 2 && <PartnerTable results={results} hash={hash} filter={filter} downloadExcel={downloadExcel} />}
                        {output === 3 && <ResultChart results={results} hash={hash} filter={filter} downloadExcel={downloadExcel} />}

                        <Button onClick={downloadExcel}>Download</Button>
                    </div>
                </div>
            </Form>
        </React.Fragment>
    )
}